# Phase 2: Webhook Server (Deferred)

> **Navigation:** [← Search & MCP](./phase1-search-and-mcp.md) · [Deployment →](./deployment.md) · [Overview](./OVERVIEW.md)

---

## 9. WEBHOOK SERVER (Phase 2 — Deferred)

> [!NOTE]
> The webhook server is planned for **Phase 2**. For now, re-run `npm run bootstrap` to sync changes.
> When implemented, it will auto-pull repos and re-index only changed files on Bitbucket push events.

<details>
<summary>Phase 2: Full webhook implementation (click to expand)</summary>

```typescript
// src/server/webhook_server.ts
import 'dotenv/config';
import express from 'express';
import crypto from 'crypto';
import { ingestFile, extractImports } from '../ingestion/sync_handler.js';
import { deleteFile } from '../ingestion/cleanup.js';
// NOTE: git.ts is dynamically imported in handlePush to avoid circular deps
import { getDB } from '../lib/db.js';

const app = express();

// Capture raw body for HMAC
app.use(express.json({ verify: (req: any, _res, buf) => { req.rawBody = buf; } }));

// HMAC-SHA256 verification
function verifySignature(req: any, res: any, next: any) {
  const sig = req.headers['x-hub-signature'];
  const secret = process.env.WEBHOOK_SECRET;
  if (!sig || !secret) return res.status(401).json({ error: 'Unauthorized' });

  const digest = 'sha256=' + crypto.createHmac('sha256', secret).update(req.rawBody).digest('hex');
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(digest)))
      return res.status(403).json({ error: 'Invalid signature' });
  } catch { return res.status(403).json({ error: 'Invalid signature' }); }
  next();
}

app.post('/webhook/bitbucket', verifySignature, async (req, res) => {
  res.status(200).json({ status: 'queued' }); // Respond immediately

  setImmediate(async () => {
    try {
      const event = req.headers['x-event-key'] as string;
      if (event === 'repo:push') await handlePush(req.body);
      else if (event?.startsWith('pullrequest:')) await handlePR(req.body);
    } catch (err: any) {
      console.error('Webhook error:', err.message);
    }
  });
});

async function handlePush(payload: any) {
  const slug = payload.repository.full_name;

  for (const change of payload.push.changes) {
    if (!change.new || !change.old) continue;

    // 1. Pull latest into local clone
    const { cloneOrPull, getChangedFiles, repoPath } = await import('../lib/git.js');
    await cloneOrPull(slug);

    // 2. Get changed files via local git diff
    const changedFiles = await getChangedFiles(
      slug, change.old.target.hash, change.new.target.hash
    );

    // 3. Process each changed file from local filesystem
    const { readFileSync } = await import('fs');
    const { join } = await import('path');
    const localPath = repoPath(slug);

    for (const file of changedFiles) {
      if (file.status === 'deleted') {
        deleteFile(slug, file.path);
      } else {
        try {
          const content = readFileSync(join(localPath, file.path), 'utf-8');
          await ingestFile(slug, file.path, content, change.new.target.hash);
          extractImports(slug, file.path, content);
        } catch (err: any) {
          console.error(`  ✗ ${file.path}: ${err.message}`);
        }
      }
    }
  }
}

async function handlePR(payload: any) {
  const db = getDB();
  const pr = payload.pullrequest;
  db.prepare(`
    INSERT INTO pull_requests (repo_slug, pr_number, title, description, author, state, created_at, updated_at, source_branch, dest_branch)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(repo_slug, pr_number) DO UPDATE SET title=excluded.title, state=excluded.state, updated_at=excluded.updated_at
  `).run(
    payload.repository.full_name, pr.id, pr.title, pr.description ?? '',
    pr.author?.display_name ?? '', pr.state,
    new Date(pr.created_on).getTime(), new Date(pr.updated_on).getTime(),
    pr.source?.branch?.name ?? '', pr.destination?.branch?.name ?? ''
  );
}

app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: Date.now() }));
app.listen(Number(process.env.PORT) || 3000, () => console.log(`✓ Webhook server on port ${process.env.PORT || 3000}`));
```

</details>
