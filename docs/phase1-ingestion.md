# Phase 1: Ingestion Pipeline

> **Navigation:** [← Foundation](./phase1-foundation.md) · [Search & MCP →](./phase1-search-and-mcp.md) · [Overview](./OVERVIEW.md)

---

## 7. INGESTION PIPELINE

### 7.1 Sync Handler (Webhook Events)

```typescript
// src/ingestion/sync_handler.ts
import { getDB } from '../lib/db.js';
import { getAIPool, getParserPool } from '../lib/worker_pool.js';

const LANG_MAP: Record<string, string> = {
  js: 'javascript', jsx: 'javascript', mjs: 'javascript',
  ts: 'typescript', tsx: 'typescript', mts: 'typescript',
  py: 'python',
  go: 'go',
  java: 'java',
  cpp: 'cpp', cc: 'cpp', cxx: 'cpp', h: 'cpp', hpp: 'cpp',
  c: 'cpp',  // C files use the C++ grammar (superset)
};

// Files that should still be indexed even without a grammar
const TEXT_EXTENSIONS = new Set([
  'rs', 'rb', 'php', 'swift', 'kt', 'scala', 'r', 'sql', 'sh', 'bash',
  'yml', 'yaml', 'toml', 'json', 'xml', 'html', 'css', 'scss', 'md',
]);

function detectLanguage(filePath: string): string | null {
  const ext = filePath.split('.').pop()?.toLowerCase() ?? '';
  // Known grammar → return language name
  if (LANG_MAP[ext]) return LANG_MAP[ext];
  // Text file without grammar → return ext as language (fallback chunker will handle)
  if (TEXT_EXTENSIONS.has(ext)) return ext;
  // Binary or unknown → skip
  return null;
}

export async function ingestFile(
  repoSlug: string, filePath: string, content: string, commitHash: string
): Promise<void> {
  const db = getDB();
  const ai = getAIPool();
  const parser = getParserPool();

  const language = detectLanguage(filePath);
  if (!language) return;

  // 1. Parse + CAST chunk
  const { chunks } = await parser.execute({
    type: 'parse', code: content, language, maxChunkSize: 500
  });
  if (!chunks.length) return;

  // 2. Generate embeddings in batches (backpressure — avoids overwhelming the 4-worker pool)
  const EMBED_BATCH = 4; // Matches worker pool size
  const embeddings: any[] = [];
  for (let i = 0; i < chunks.length; i += EMBED_BATCH) {
    const batch = chunks.slice(i, i + EMBED_BATCH);
    const results = await Promise.all(
      batch.map((c: any) => ai.execute({ type: 'embed', text: c.content }))
    );
    embeddings.push(...results);
  }

  // 3. Atomic database update
  db.transaction(() => {
    // Upsert file
    const file = db.prepare(`
      INSERT INTO files (repo_slug, file_path, commit_hash, language, updated_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(repo_slug, file_path) DO UPDATE SET
        commit_hash = excluded.commit_hash, updated_at = excluded.updated_at
      RETURNING id
    `).get(repoSlug, filePath, commitHash, language, Date.now()) as any;

    // Delete old chunks (cascades to vec_chunks via trigger, FTS via trigger)
    db.prepare('DELETE FROM chunks WHERE file_id = ?').run(file.id);

    // Insert new chunks + vectors
    const chunkStmt = db.prepare(`
      INSERT INTO chunks (file_id, chunk_index, start_line, end_line, content, context_header, ast_type)
      VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING id
    `);
    const vecStmt = db.prepare(`INSERT INTO vec_chunks (chunk_id, embedding) VALUES (?, ?)`);

    for (let i = 0; i < chunks.length; i++) {
      const c = chunks[i];
      const row = chunkStmt.get(file.id, i, c.start_line, c.end_line, c.content, c.context_header, c.ast_type) as any;
      vecStmt.run(row.id, Buffer.from(embeddings[i].embedding.buffer));
    }
  });

  console.log(`✓ Ingested ${chunks.length} chunks: ${filePath}`);
}

export function extractImports(repoSlug: string, filePath: string, content: string): void {
  const db = getDB();
  const ext = filePath.split('.').pop()?.toLowerCase() ?? '';

  // Language-specific import patterns
  const patterns: RegExp[] = [];

  // JS/TS: import ... from '...', require('...')
  if (['js', 'jsx', 'ts', 'tsx', 'mjs', 'mts'].includes(ext)) {
    patterns.push(/(?:import\s+.*?from\s+['"](.+?)['"]|require\s*\(\s*['"](.+?)['"]\s*\))/g);
  }
  // Python: import x, from x import y
  else if (ext === 'py') {
    patterns.push(/^\s*import\s+([\w.]+)/gm);
    patterns.push(/^\s*from\s+([\w.]+)\s+import/gm);
  }
  // Go: import "x" or import (\n"x"\n)
  else if (ext === 'go') {
    patterns.push(/import\s+"([^"]+)"/g);
    patterns.push(/^\s+"([^"]+)"/gm); // inside import block
  }
  // Java: import x.y.z;
  else if (ext === 'java') {
    patterns.push(/^\s*import\s+(?:static\s+)?([\w.]+);/gm);
  }

  const stmt = db.prepare(`INSERT OR IGNORE INTO file_imports (repo_slug, source_file, target_file) VALUES (?, ?, ?)`);

  for (const regex of patterns) {
    let match;
    while ((match = regex.exec(content)) !== null) {
      const target = match[1] || match[2];
      if (target) {
        stmt.run(repoSlug, filePath, target);
      }
    }
  }
}
```

### 7.2 Git Helper (Clone / Pull)

```typescript
// src/lib/git.ts
import simpleGit, { SimpleGit } from 'simple-git';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const REPOS_DIR = process.env.REPOS_DIR || './repos';

/** Ensure repos directory exists */
export function getReposDir(): string {
  if (!existsSync(REPOS_DIR)) mkdirSync(REPOS_DIR, { recursive: true });
  return REPOS_DIR;
}

/** Get local path for a repo slug (e.g. "workspace/my-repo" → "./repos/workspace/my-repo") */
export function repoPath(slug: string): string {
  return join(getReposDir(), slug);
}

/** Clone or pull a Bitbucket repo. Returns the local path. */
export async function cloneOrPull(slug: string): Promise<string> {
  const localPath = repoPath(slug);
  const cloneUrl = `https://x-token-auth:${process.env.BITBUCKET_AUTH_TOKEN}@bitbucket.org/${slug}.git`;

  if (existsSync(join(localPath, '.git'))) {
    // Already cloned → pull latest
    const git: SimpleGit = simpleGit(localPath);
    await git.pull();
    console.log(`✓ Pulled latest: ${slug}`);
  } else {
    // Fresh clone
    mkdirSync(localPath, { recursive: true });
    await simpleGit().clone(cloneUrl, localPath);
    console.log(`✓ Cloned: ${slug}`);
  }

  return localPath;
}

/** Get list of changed files between two commits */
export async function getChangedFiles(
  slug: string, oldHash: string, newHash: string
): Promise<Array<{ path: string; status: 'added' | 'modified' | 'deleted' }>> {
  const git: SimpleGit = simpleGit(repoPath(slug));
  await git.pull(); // Ensure we have the latest

  const diff = await git.diffSummary([`${oldHash}..${newHash}`]);
  return diff.files.map(f => ({
    path: f.file,
    status: f.binary ? 'modified' : // binary files are always "modified"
            (f as any).status === 'deleted' ? 'deleted' :
            (f as any).status === 'added' ? 'added' : 'modified',
  }));
}

/** Get current HEAD commit hash */
export async function getHeadHash(slug: string): Promise<string> {
  const git: SimpleGit = simpleGit(repoPath(slug));
  return (await git.revparse(['HEAD'])).trim();
}
```

### 7.3 Bootstrap CLI (Clone + Index)

```typescript
// src/ingestion/bootstrap.ts
import 'dotenv/config';
import { getDB } from '../lib/db.js';
import { cloneOrPull, repoPath, getHeadHash } from '../lib/git.js';
import { ingestFile, extractImports } from './sync_handler.js';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative, extname } from 'path';
import pLimit from 'p-limit';

const BITBUCKET_API = 'https://api.bitbucket.org/2.0';

// Concurrency limit — matches AI worker pool size
const INGEST_CONCURRENCY = 4;

const SUPPORTED_EXTS = new Set([
  '.js', '.jsx', '.ts', '.tsx', '.mjs', '.mts',
  '.py', '.go', '.java', '.cpp', '.cc', '.cxx', '.c', '.h', '.hpp',
  '.rs', '.rb', '.php', '.swift', '.kt', '.scala',
  '.sql', '.sh', '.bash', '.yml', '.yaml', '.toml', '.json', '.md',
]);

// Directories to skip during walk
const SKIP_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', '__pycache__',
  '.next', 'vendor', 'target', '.venv', 'venv',
]);

/** Fetch repo metadata from Bitbucket API (description, language, branch) */
async function fetchRepoMeta(slug: string): Promise<{ description: string; language: string; url: string; defaultBranch: string }> {
  try {
    const res = await fetch(`${BITBUCKET_API}/repositories/${slug}`, {
      headers: {
        Authorization: `Bearer ${process.env.BITBUCKET_AUTH_TOKEN}`,
        Accept: 'application/json'
      }
    });
    if (!res.ok) throw new Error(`${res.status}`);
    const repo = await res.json() as any;
    return {
      description: repo.description ?? '',
      language: repo.language ?? '',
      url: repo.links?.html?.href ?? '',
      defaultBranch: repo.mainbranch?.name ?? 'main',
    };
  } catch {
    console.warn(`  ⚠ Could not fetch metadata for ${slug}, using defaults`);
    return { description: '', language: '', url: '', defaultBranch: 'main' };
  }
}

/** Detect tech stack by scanning manifest files in repo root */
function detectTechStack(repoDir: string): string {
  const stack: string[] = [];

  // Node.js ecosystem
  if (existsSync(join(repoDir, 'package.json'))) {
    try {
      const pkg = JSON.parse(readFileSync(join(repoDir, 'package.json'), 'utf-8'));
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
      stack.push('Node.js');
      if (allDeps['typescript']) stack.push('TypeScript');
      if (allDeps['react']) stack.push('React');
      if (allDeps['next']) stack.push('Next.js');
      if (allDeps['vue']) stack.push('Vue');
      if (allDeps['angular']) stack.push('Angular');
      if (allDeps['express']) stack.push('Express');
      if (allDeps['fastify']) stack.push('Fastify');
      if (allDeps['nestjs'] || allDeps['@nestjs/core']) stack.push('NestJS');
    } catch { /* ignore parse errors */ }
  }

  // Python
  if (existsSync(join(repoDir, 'requirements.txt')) ||
      existsSync(join(repoDir, 'pyproject.toml')) ||
      existsSync(join(repoDir, 'Pipfile'))) {
    stack.push('Python');
  }

  // Other languages
  if (existsSync(join(repoDir, 'go.mod'))) stack.push('Go');
  if (existsSync(join(repoDir, 'pom.xml'))) stack.push('Java/Maven');
  if (existsSync(join(repoDir, 'build.gradle'))) stack.push('Java/Gradle');
  if (existsSync(join(repoDir, 'Cargo.toml'))) stack.push('Rust');
  if (existsSync(join(repoDir, 'Gemfile'))) stack.push('Ruby');

  // Infrastructure
  if (existsSync(join(repoDir, 'Dockerfile'))) stack.push('Docker');
  if (existsSync(join(repoDir, 'docker-compose.yml')) ||
      existsSync(join(repoDir, 'docker-compose.yaml'))) stack.push('Docker Compose');

  return stack.join(', ');
}

/** Classify project type based on manifest signals */
function detectProjectType(repoDir: string): string {
  const hasPkg = existsSync(join(repoDir, 'package.json'));

  if (hasPkg) {
    try {
      const pkg = JSON.parse(readFileSync(join(repoDir, 'package.json'), 'utf-8'));
      const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

      // Micro Frontend signals: React/Vue/Angular + webpack module federation or single-spa
      const feSignals = ['react', 'vue', 'angular', '@angular/core'].some(d => allDeps[d]);
      const mfeSignals = allDeps['@module-federation/enhanced'] ||
                         allDeps['single-spa'] || allDeps['webpack-module-federation'];
      if (feSignals && mfeSignals) return 'micro-frontend';

      // Library signals: has "main" or "exports" field, no server/start scripts
      if ((pkg.main || pkg.exports || pkg.module) && !allDeps['express'] && !allDeps['fastify'] && !allDeps['@nestjs/core']) {
        return 'library';
      }

      // Microservice signals: server framework + Dockerfile
      const serverFramework = allDeps['express'] || allDeps['fastify'] || allDeps['@nestjs/core'] || allDeps['hapi'];
      if (serverFramework && existsSync(join(repoDir, 'Dockerfile'))) return 'microservice';
      if (serverFramework) return 'microservice';

      // Frontend app (not micro-frontend)
      if (feSignals) return 'micro-frontend';
    } catch { /* ignore */ }
  }

  // Go/Java/Python with Dockerfile → likely microservice
  if (existsSync(join(repoDir, 'Dockerfile'))) {
    if (existsSync(join(repoDir, 'go.mod')) ||
        existsSync(join(repoDir, 'pom.xml')) ||
        existsSync(join(repoDir, 'requirements.txt'))) {
      return 'microservice';
    }
  }

  return 'unknown';
}

/** Parse package.json dependencies and populate the dependencies table */
function parseDependencies(repoDir: string, repoSlug: string): void {
  const pkgPath = join(repoDir, 'package.json');
  if (!existsSync(pkgPath)) return;

  try {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
    const db = getDB();
    const stmt = db.prepare(`
      INSERT INTO dependencies (repo_slug, library_name, version, is_dev_dependency)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(repo_slug, library_name) DO UPDATE SET version = excluded.version
    `);

    for (const [name, version] of Object.entries(pkg.dependencies ?? {})) {
      stmt.run(repoSlug, name, version as string, 0);
    }
    for (const [name, version] of Object.entries(pkg.devDependencies ?? {})) {
      stmt.run(repoSlug, name, version as string, 1);
    }
    console.log(`  ✓ Parsed dependencies from package.json`);
  } catch { /* ignore parse errors */ }
}

async function bootstrap() {
  // 1. Read repo whitelist from env
  const repoList = process.env.BITBUCKET_REPOS;
  if (!repoList) {
    console.error('ERROR: BITBUCKET_REPOS not set. Example: workspace/repo-a,workspace/repo-b');
    process.exit(1);
  }
  const slugs = repoList.split(',').map(s => s.trim()).filter(Boolean);
  console.log(`Bootstrapping ${slugs.length} repos: ${slugs.join(', ')}\n`);

  for (const slug of slugs) {
    console.log(`\n══ ${slug} ══`);

    // 2. Clone or pull repo locally
    const localPath = await cloneOrPull(slug);
    const commitHash = await getHeadHash(slug);

    // 3. Detect tech stack & project type from local files
    const techStack = detectTechStack(localPath);
    const projectType = detectProjectType(localPath);
    console.log(`  Tech: ${techStack || 'unknown'} | Type: ${projectType}`);

    // 4. Fetch API metadata & register project in DB
    const meta = await fetchRepoMeta(slug);
    const db = getDB();
    db.prepare(`
      INSERT INTO projects (repo_slug, description, primary_language, tech_stack, project_type, repo_url, default_branch, last_synced_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
      ON CONFLICT(repo_slug) DO UPDATE SET
        tech_stack = excluded.tech_stack,
        project_type = excluded.project_type,
        default_branch = excluded.default_branch,
        last_synced_at = datetime('now')
    `).run(slug, meta.description, meta.language, techStack, projectType, meta.url, meta.defaultBranch);

    // 5. Parse dependencies (package.json → dependencies table)
    parseDependencies(localPath, slug);

    // 6. Collect files then ingest in batches with event loop yielding
    const files = collectFiles(localPath, localPath);
    const BATCH_SIZE = 10;
    let indexed = 0;
    let failed = 0;

    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE);
      const limit = pLimit(INGEST_CONCURRENCY);

      await Promise.all(
        batch.map(({ fullPath, filePath }) =>
          limit(async () => {
            try {
              const content = readFileSync(fullPath, 'utf-8');
              await ingestFile(slug, filePath, content, commitHash);
              extractImports(slug, filePath, content);
              indexed++;
            } catch (err: any) {
              console.error(`  ✗ ${filePath}: ${err.message}`);
              failed++;
            }
          })
        )
      );

      // Yield to event loop between batches — keeps MCP server responsive
      await new Promise(resolve => setImmediate(resolve));
    }

    console.log(`  ✓ Indexed ${indexed} files${failed ? ` (✗ ${failed} failed)` : ''}`);
  }

  console.log('\n✓ Bootstrap complete');
  process.exit(0);
}

/** Recursively collect file paths (no I/O besides stat) */
function collectFiles(
  rootDir: string, dir: string
): Array<{ fullPath: string; filePath: string }> {
  const results: Array<{ fullPath: string; filePath: string }> = [];
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      if (SKIP_DIRS.has(entry)) continue;
      results.push(...collectFiles(rootDir, fullPath));
    } else if (stat.isFile()) {
      const ext = extname(entry).toLowerCase();
      if (!SUPPORTED_EXTS.has(ext)) continue;
      results.push({ fullPath, filePath: relative(rootDir, fullPath) });
    }
  }

  return results;
}

bootstrap().catch(console.error);
```

### 7.4 Cleanup

```typescript
// src/ingestion/cleanup.ts
import { getDB } from '../lib/db.js';

export function deleteFile(repoSlug: string, filePath: string): void {
  const db = getDB();
  // Cascading: files → chunks → (trigger) vec_chunks + fts_chunks
  db.prepare('DELETE FROM files WHERE repo_slug = ? AND file_path = ?')
    .run(repoSlug, filePath);
}
```
