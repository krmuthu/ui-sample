combining sqlite-vec for dense vectors and FTS5 for lexical search, merged via Reciprocal Rank Fusion (RRF) with a constant of 60—is already an excellent core part of your existing pipeline. Your current setup is successfully following enterprise best practices for the initial retrieval stage, as RRF effectively homogenizes search scores from multiple methods to create a highly reliable combined ranking.

The reason it was highlighted in the improvement plan is to address a specific limitation in the reranking phase of your current implementation.

In your existing AI Worker setup, the reranking task currently embeds the query and documents separately and scores them via cosine similarity, which is a bi-encoder approach. The architectural optimization suggests upgrading this final step to use a true Cross-Encoder.

While bi-encoders are fast and great for initial retrieval, a cross-encoder performs full-attention processing over the concatenated input pair of the user query and the code chunk simultaneously. This forces the neural network to meticulously evaluate the precise structural interactions between the question and the code snippet. Research demonstrates that utilizing a bi-encoder for the initial hybrid retrieval and a cross-encoder for the final reranking significantly outperforms single-stage searches, increasing accuracy by an average of 33.1% across major retrieval benchmarks.

Because cross-encoding is computationally expensive, the ideal implementation scales efficiently by applying it exclusively to the top candidates (e.g., the top 100 hits) returned by your already-existing hybrid search.
