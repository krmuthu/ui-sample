Objective:
Implement a series of latency optimizations for our hybrid search pipeline and update our HyDE generator to be language-aware and grounded in repository metadata fetched from our PostgreSQL (pgvector) database.

Context Setup:
Please review and edit the following files. (I have @-mentioned them to ensure they are in your context):

@src/lib/hybrid_search.ts

@src/lib/llama_client.ts

@.env.example

@test_script/test_reranker_hyde_optimizations.mjs

[Please also @-mention your specific database client file here, e.g., @src/lib/db.ts]

Step 1: Environment Variables (.env.example)
Add the following configurations while preserving existing ones:

RERANK_SCORE_RATIO=0.35 (Minimum RRF score ratio vs top candidate)

RERANK_MIN_CANDIDATES=5 (Minimum candidates to always send to reranker)

Step 2: Implement Code Language Detection (llama_client.ts)
Create an exported function detectCodeLanguage(query: string): string | null before generateHypotheticalDoc().
Use priority-ordered keyword regex matching for the following:

Java: spring, @Controller, maven, pom.xml, jpa, hibernate, lombok, @Transactional, liquibase, .java

TypeScript: typescript, .tsx, angular, nestjs

JavaScript/JSX: react, component, useState, redux, webpack, npm, next.js, qiankun

Python: python, django, flask, pip, pytest, pandas

Go: golang, goroutine, .go

SQL: sql, liquibase, flyway, migration, create table

Step 3: Fetch Repository Metadata from PostgreSQL (llama_client.ts)
Before calling the LLM in generateHypotheticalDoc(), write a Postgres SQL query using our DB client to fetch the repository_description and component_ownership metadata associated with the target codebase. Since we use pgvector, you can query these metadata columns directly from our existing tables to provide architectural context to the LLM.

Step 4: Update the HyDE Prompt (llama_client.ts)
Inject both the detected language and the PostgreSQL metadata into the HyDE system prompt.

Modify the prompt to instruct the model: "Write the hypothetical code in ${lang} using proper syntax. The target repository is described as: ${repository_description}. It is owned by the ${component_ownership} team. Ensure the generated code aligns with this domain context and internal naming conventions."

If no language is detected, fallback to: "Use Java, TypeScript, or JavaScript syntax as appropriate (the primary languages in this codebase). Do NOT default to Python unless explicitly requested."

Step 5: Pre-Rerank Content Deduplication (hybrid_search.ts)
Before the reranker is called (around line 931), implement an exact-content deduplication step. Compute the MD5 hash of each candidate's content and filter out exact duplicates to save cross-encoder compute cycles. Ensure the post-rerank line-range overlap dedup remains intact.

Step 6: Dominant-Winner Short-Circuit (hybrid_search.ts)
Around lines 940-943, extend the existing short-circuit logic to also fire when the top score is overwhelmingly dominant:
sortedScores[1] > sortedScores[1][1] * 2.5
If this condition is met, skip the cross-encoder entirely and return the top candidate.

Step 7: Score-Ratio Candidate Gating (hybrid_search.ts)
Replace the variance-based adaptiveK logic (lines 833-848) with score-ratio logic:

Read SCORE_RATIO (fallback to 0.35) and MIN_RERANK (fallback to 5) from process.env.

MAX_RERANK = Math.max(topK + 2, 12)

topRRFScore = sortedScores?.??[1] 0

scoreFloor = topRRFScore * SCORE_RATIO

Filter the candidates list to keep only those above scoreFloor, while strictly respecting the MIN_RERANK and MAX_RERANK boundaries.

Step 8: Adaptive Pruning Budget (hybrid_search.ts)
Modify the maxChars parameter in pruneForReranker() (around line 970) to scale dynamically based on the candidate count:

<= 6 candidates: 1680 chars

7-9 candidates: 1200 chars

= 10 candidates: 900 chars
Strictly preserve the structural prefix (File: path\ncontext_header) during any string truncation.

Step 9: Automated Tests (test_script/test_reranker_hyde_optimizations.mjs)
Update the tests to verify the detectCodeLanguage regex logic, the MD5 deduplication removal, the 2.5x short-circuit firing, the score-ratio gating reductions, the adaptive pruning budgets, and the new Postgres metadata injection into the HyDE prompt.


What HyDE Is Actually Doing (and Why You Can Skip It)
Your current pipeline uses HyDE to solve one specific problem:
User query: "how to configure spring transaction rollback"
           ↓
This is natural language. Its embedding lives in "NL space"
           ↓
Your indexed code lives in "code space"
           ↓
The two embeddings are far apart → poor vector recall
HyDE bridges this by generating a fake code snippet, embedding that instead of the query, and landing closer to "code space." It's a workaround for the fundamental NL→code embedding gap.
Your Postgres vector store already contains real code at those exact coordinates in "code space." You don't need the LLM to imagine what the code looks like — you can just go fetch something close.

The Mechanics Step by Step
Step 1: Embed the raw query (you already do this)
"how to configure spring transaction rollback"
           ↓ embedding model
     query_vector: [0.23, -0.41, ...]   ← lives in NL space
Step 2: Fast first-pass ANN search (new step)
Run a cheap cosine similarity search against your Postgres vector store using query_vector. No reranker, no Jira/Confluence sources, just the code index:
sqlSELECT id, content, embedding
FROM code_chunks
ORDER BY embedding <=> $1   -- pgvector cosine distance operator
LIMIT 3;
```

This returns 2-3 real code snippets that are "nearest" to your query in the embedding space. They won't be perfect matches — the NL→code gap still exists — but they'll be in the right neighborhood.
```
Retrieved snippet 1: @Transactional(rollbackFor = Exception.class) Spring Java code
Retrieved snippet 2: TransactionTemplate with rollback logic  
Retrieved snippet 3: @Rollback annotation in a test class
Step 3: Extract their embeddings (already stored)
You already have these vectors in Postgres — no re-embedding needed. Pull them directly:
javascriptconst firstPassResults = await pgVectorFastSearch(queryVector, { topK: 3 });
const realCodeVectors = firstPassResults.map(r => r.embedding);
Step 4: Construct composite query vector
Combine the original query vector with the retrieved code vectors. Weighted average works well here:
javascriptfunction compositeVector(queryVec, codeVecs, queryWeight = 0.4) {
  const codeWeight = (1 - queryWeight) / codeVecs.length;
  
  return queryVec.map((val, i) => {
    const codeContribution = codeVecs.reduce((sum, vec) => sum + vec[i] * codeWeight, 0);
    return val * queryWeight + codeContribution;
  });
}

const compositeVec = compositeVector(queryVector, realCodeVectors);
```

Now `compositeVec` is a blend that sits somewhere between NL space and code space — exactly what HyDE was trying to achieve, but built from real coordinates rather than hallucinated ones.

### Step 5: Use compositeVec in your main pipeline

Replace the HyDE embedding with `compositeVec` everywhere your current pipeline feeds in the query vector:
```
Before: Query → [HyDE LLM call] → embed(hydeText) → main search
After:  Query → embed(query) → fast ANN → compositeVec → main search
Your existing RRF fusion, reranker, and post-processing all stay exactly the same.

Where This Lands in Your Codebase
In llama_client.ts, your generateHypotheticalDoc() function gets replaced or bypassed. In hybrid_search.ts, wherever you currently call:
javascript// Current
const hydeDoc = await generateHypotheticalDoc(query);
const hydeVector = await embed(hydeDoc);
You'd instead call:
javascript// New
const queryVector = await embed(query);
const firstPass = await fastVectorSearch(queryVector, { topK: 3 });
const compositeVec = compositeVector(queryVector, firstPass.map(r => r.embedding));
Everything downstream receives compositeVec and doesn't need to know how it was constructed.

The Fallback Logic
The weak point of Option A is when your codebase doesn't contain anything close to the query — e.g., a query about a new pattern you're planning to implement, or a framework not yet used in the repos. In that case, the first-pass results are low-quality and you'd be blending noise into your query vector, which is worse than using the raw query vector.
Guard against this with a similarity threshold check:
javascriptconst FIRST_PASS_CONFIDENCE_THRESHOLD = 0.72; // tune this

const firstPass = await fastVectorSearch(queryVector, { topK: 3 });
const highConfidenceResults = firstPass.filter(r => r.similarity >= FIRST_PASS_CONFIDENCE_THRESHOLD);

let searchVector;
if (highConfidenceResults.length >= 2) {
  // Enough signal — use composite vector
  searchVector = compositeVector(queryVector, highConfidenceResults.map(r => r.embedding));
} else {
  // Weak first pass — fall back to raw query vector
  // Optionally trigger lightweight HyDE here as last resort
  searchVector = queryVector;
}
This makes the optimization strictly additive — it only fires when it's confident, and degrades gracefully when it isn't.

Latency Profile Compared to Current HyDE
StepCurrent HyDEOption ALLM call to generate doc~400-600ms❌ eliminatedEmbed the HyDE doc~30-50ms❌ eliminatedFast ANN search (new)—~20-40msVector math for composite—<1msNet changebaseline~-450ms to -600ms
This is a bigger latency win than any of your four P1 reranker optimizations individually.

Why Language Detection Becomes Unnecessary
This is the elegant part. Your detectCodeLanguage() regex work in P2 is entirely solving a problem that Option A doesn't have:

First-pass retrieval from a Java-heavy repo returns Java snippets → composite vector naturally skewed toward Java space
A query with React/TypeScript keywords lands near TypeScript snippets → composite vector skewed toward TS space
The language signal is implicit in the geometry of your own embedding space

The language is already encoded in the vectors. You don't need to detect it explicitly.

One Tuning Decision: The Query Weight
The queryWeight = 0.4 in the composite vector controls how much the original query intent is preserved versus being pulled toward the retrieved code. This is the main knob to tune:

Higher weight (0.5-0.6): Stays closer to query intent, better for abstract/architectural queries
Lower weight (0.3-0.4): Pulled more toward code space, better for concrete implementation queries

You could even make this adaptive — if the query contains natural language words with no code keywords, use higher weight; if it looks code-like already, use lower weight. But starting with a fixed 0.4 and measuring retrieval quality is the right first step.


Deep Dive: Improving the Reranker
The plan's four optimizations attack the reranker indirectly — by reducing how many documents reach it and how many tokens each document contributes. That's the right instinct, but there's significantly more leverage available. Let me go layer by layer.

First: Understand Where Time Actually Goes
Before optimizing, it's worth decomposing that 0.8-1.2s per pair more precisely. Cross-encoder inference on CPU has three cost components:
Per pair cost = tokenization + attention computation + scoring

Tokenization:     ~5-10ms   (negligible)
Attention:        ~750-1100ms (quadratic in sequence length — this is the bottleneck)
Scoring (linear): ~10-20ms  (negligible)
The attention computation is quadratic in token count. This is why your adaptive pruning budget (P1-4) works — it's not just saving tokens linearly, it's attacking a quadratic cost. A 30% token reduction gives you roughly 50% compute reduction per pair. This is underemphasized in the current plan.
The implication: token reduction per document is more valuable than candidate count reduction, at equal percentages. Your plan has the priority backwards — P1-4 (pruning) should be weighted higher than P1-1 (gating).

Layer 1: Smarter Candidate Selection (Pre-Rerank)
The current plan filters by RRF score ratio. This is good but incomplete. RRF is a rank-fusion signal, not a semantic signal. Here's a stronger pre-rerank filtering strategy:
1A: Two-Signal Gating (RRF + Embedding Similarity)
Use both RRF score and cosine similarity to the query vector. A candidate that ranks well in RRF and is semantically close deserves reranking. A candidate that ranks well in RRF only because of FTS keyword overlap (but is semantically distant) is less likely to win reranking.
javascriptfunction shouldRerank(candidate, queryVector, rrfTopScore) {
  const rrfOk = candidate.rrfScore >= rrfTopScore * SCORE_RATIO;
  const simOk = candidate.cosineSimilarity >= SIMILARITY_FLOOR; // e.g. 0.65
  
  // Must pass RRF gate AND at least one semantic signal
  return rrfOk && (simOk || candidate.isFromVectorSearch);
}
```

This catches the case where a Jira/Confluence result scores high in FTS (exact keyword match) but is semantically unrelated — a common source of wasted reranker calls.

### 1B: Source-Aware Candidate Budget

Not all retrieval sources produce equally rerank-worthy candidates. In a Java/TS codebase:
```
Code (vector search)    → high rerank ROI, usually semantically dense
Confluence docs         → medium ROI, often verbose with low signal density  
Jira tickets            → low ROI, short text, reranker rarely changes rank
PR descriptions         → medium ROI, variable quality
Instead of a flat MIN_RERANK = 5, allocate a per-source budget:
javascriptconst SOURCE_BUDGET = {
  code:       { min: 3, max: 6 },
  confluence: { min: 1, max: 3 },
  jira:       { min: 0, max: 2 },
  pr:         { min: 1, max: 2 },
};
```

This prevents Jira tickets from consuming reranker slots that should go to code results, while still keeping at least one Confluence result in the mix.

---

## Layer 2: Cascaded Reranking (The Biggest Structural Win)

This is the most impactful change not in your current plan. Instead of one reranker pass over all candidates, use two passes at different quality/speed tradeoffs:
```
Stage 1: Fast lightweight scorer (no LLM, no cross-encoder)
         → reduces 12 candidates to 4-5
         
Stage 2: Full cross-encoder (bge-reranker-v2-m3)
         → reranks only the 4-5 survivors
Stage 1: Fast Lightweight Scorer Options
Option A: BM25 re-scoring — recompute BM25 between query tokens and candidate content. Pure in-process, ~2ms total for 12 documents. Eliminates candidates that scored well in RRF via vector similarity but have zero term overlap with the query.
Option B: Bi-encoder similarity re-scoring — you already have embeddings for all candidates in Postgres. Compute cosine similarity between query embedding and each candidate embedding. ~1ms for 12 dot products. Sort, keep top 5.
Option C: Lightweight cross-encoder — use a smaller, faster model (e.g. ms-marco-MiniLM-L-6-v2) for stage 1. On CPU this runs in ~50-80ms per pair, not 1000ms. It's a weaker model but good enough to eliminate the bottom 50% of candidates.
Option B is the right default for your setup because you already have all the embeddings — no extra infrastructure.
javascript// Stage 1: bi-encoder re-scoring using stored embeddings (already in Postgres)
const stage1Ranked = candidates
  .map(c => ({
    ...c,
    biEncoderScore: cosineSimilarity(queryVector, c.embedding)
  }))
  .sort((a, b) => b.biEncoderScore - a.biEncoderScore)
  .slice(0, 5); // keep top 5

// Stage 2: full cross-encoder only on survivors
const stage2Ranked = await rerank(query, stage1Ranked);
Expected impact: Reduces cross-encoder calls from 8-12 to 4-5 consistently, not just when RRF gaps are large. Combined with token pruning this brings P95 from ~10s to ~3-4s.

Layer 3: Parallelization (Underutilized on Your 128-Core Machine)
Your current pipeline processes reranker pairs sequentially. You have 128 cores. This is a significant missed opportunity.
3A: Parallel Pair Processing
The /v1/rerank endpoint presumably runs on the same CPU-bound server. If the reranker service can handle concurrent requests without serializing internally:
javascript// Current: sequential
for (const candidate of candidates) {
  scores.push(await reranker.score(query, candidate.content));
}

// Better: parallel batches
const PARALLEL_BATCH = 3; // tune based on reranker service thread pool
const batches = chunk(candidates, PARALLEL_BATCH);
const scores = [];
for (const batch of batches) {
  const batchScores = await Promise.all(
    batch.map(c => reranker.score(query, c.content))
  );
  scores.push(...batchScores);
}
```

**Caveat:** This only helps if your reranker service is multi-threaded. If it serializes requests internally (common with naive inference servers), this won't help and may hurt. Verify with a quick benchmark — two simultaneous requests vs one. If wall time doesn't increase proportionally, parallelism is available.

### 3B: Overlap Reranking with Result Streaming

For user-facing latency specifically, you can start returning the top result as soon as the first few reranker pairs complete, streaming results to the client while remaining pairs are still being scored. This doesn't reduce total rerank time but dramatically improves **perceived** latency:
```
User sees result 1 at t=1.2s (after first pair)
User sees result 2 at t=2.4s
...
vs
User sees all results at t=10s (current)
This is an architectural change (requires streaming response support) but very high impact on UX.

Layer 4: Intelligent Caching
4A: Query-Level Result Caching
Identical or near-identical queries should not re-run the reranker. This is obvious but often not implemented:
javascriptconst cacheKey = `rerank:${md5(query)}:${md5(candidateIds.sort().join(','))}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);
TTL of 1-4 hours. In a developer search context, the same queries recur frequently (people re-searching while debugging).
4B: Per-Document Score Caching
More granular: cache the reranker score for a specific (query_hash, document_hash) pair. This matters when the same document appears across multiple queries with similar phrasing:
javascript// Cache individual pair scores
const pairKey = `pair:${queryHash}:${docHash}`;
const score = await redis.get(pairKey) ?? await reranker.score(query, doc);
await redis.setex(pairKey, 3600, score);
For a developer search tool, this is surprisingly effective. "How does X work" and "explain X" will retrieve many of the same top documents, and their reranker scores against semantically similar queries cluster tightly.
4C: Query Normalization Before Caching
Before computing the cache key, normalize the query — lowercase, strip punctuation, deduplicate tokens. "Spring @Transactional rollback" and "spring transactional rollback?" should hit the same cache:
javascriptfunction normalizeQuery(q) {
  return q.toLowerCase().replace(/[^\w\s]/g, '').trim().split(/\s+/).sort().join(' ');
}

Layer 5: Better Token Budgeting (Improving P1-4)
The current plan sets flat character budgets (1680/1200/900). This is a blunt instrument. Token cost is what actually matters, and character count is an imperfect proxy because code is denser than prose.
5A: Token-Aware Budgeting
Count tokens, not characters. Most tokenizers are fast enough to run client-side:
javascript// Rough token estimate: code averages ~3.5 chars/token (denser than prose)
function estimateTokens(text) {
  return Math.ceil(text.length / 3.5);
}

const RERANK_TOKEN_BUDGET = 420; // leave room for query tokens in 512 context

function pruneForReranker(content, budget = RERANK_TOKEN_BUDGET) {
  const structuralPrefix = extractStructuralPrefix(content); // file path, context header
  const prefixTokens = estimateTokens(structuralPrefix);
  const remainingTokens = budget - prefixTokens;
  const remainingChars = remainingTokens * 3.5;
  return structuralPrefix + content.slice(structuralPrefix.length, structuralPrefix.length + remainingChars);
}
```

### 5B: Content-Type Aware Pruning

Different content types have different information density profiles:
```
Java class file:     First 60% contains the most diagnostic content (class declaration, field annotations, method signatures)
JavaScript module:   First 50% is often imports — middle 40% is higher signal
Confluence doc:      First paragraph (abstract/summary) >> rest
Jira ticket:         Title + first 3 lines >> comments
Instead of taking the first N characters uniformly, extract the highest-signal section by content type:
javascriptfunction extractHighSignalContent(candidate, tokenBudget) {
  switch (candidate.sourceType) {
    case 'code':
      // Skip import blocks, take from first class/function declaration
      return extractFromFirstDeclaration(candidate.content, tokenBudget);
    case 'confluence':
      // Take title + first paragraph + any code blocks
      return extractTitleAndAbstract(candidate.content, tokenBudget);
    case 'jira':
      // Title + description only, skip comments
      return extractJiraCore(candidate.content, tokenBudget);
    default:
      return candidate.content.slice(0, tokenBudget * 3.5);
  }
}
```

---

## Layer 6: Model-Level Improvements

This is longer-term, but worth having a view on.

### 6A: Quantized Model Deployment

`bge-reranker-v2-m3` at FP32 on CPU is your current baseline. The same model at INT8 quantization runs 2-3x faster with <1% quality degradation on most retrieval benchmarks. If you control the inference server:
```
FP32: 0.8-1.2s per pair
INT8: 0.3-0.5s per pair  ← same model, just quantized
This is a one-time infrastructure change that makes all four of your P1 optimizations proportionally more impactful.
6B: Consider a Smaller Dedicated Model
bge-reranker-v2-m3 is a multilingual model (hence the m3). If your codebase is English-only, you're paying for multilingual capability you don't use. bge-reranker-base is English-only, smaller, and runs ~40% faster with comparable English retrieval quality.
6C: GPU Offload (You Said Not Viable — But Revisit)
You noted GPU offload isn't viable currently. Worth flagging: a single A10G (24GB VRAM, ~$1.50/hr on cloud) running the reranker would bring per-pair latency to ~15-30ms — effectively eliminating the reranker as a latency concern entirely. If the deployment constraint is cost rather than architecture, the math may favour a small dedicated GPU node for just the reranker service.

Revised Priority Order
Combining the current plan's optimizations with the above, here's the priority order by impact-to-effort ratio:
PriorityOptimizationLatency ImpactEffort1Cascaded reranking (bi-encoder stage 1)-50-60% rerank timeMedium2INT8 quantization of bge-reranker-v2-m3-50-60% per-pair timeLow (infra)3Token-aware pruning (P1-4 improved)-20-30% per-pair timeLow4Pre-rerank dedup (P1-2, current plan)-10-15% candidatesLow5Score-ratio gating (P1-1, current plan)-25-40% candidatesLow6Query/pair result caching-80-100% (cache hits)Medium7Dominant-winner short-circuit (P1-3)-100% (rare)Low8Parallel pair processing-30-50% wall timeMedium9Source-aware candidate budgetQuality + latencyMedium



