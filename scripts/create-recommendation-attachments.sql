-- Execute no editor SQL da mesma base de dados antes de publicar.
CREATE TABLE IF NOT EXISTS "ContactAttachment" (
  "id" TEXT PRIMARY KEY,
  "submissionId" TEXT NOT NULL REFERENCES "ContactSubmission"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "mime" TEXT NOT NULL,
  "size" INTEGER NOT NULL,
  "data" BYTEA NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "ContactAttachment_submissionId_idx" ON "ContactAttachment"("submissionId");
