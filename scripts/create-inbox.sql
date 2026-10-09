-- Execute no editor SQL da base de dados antes de usar a caixa de entrada.
CREATE TABLE IF NOT EXISTS "ContactReply" (
  "id" TEXT PRIMARY KEY,
  "submissionId" TEXT NOT NULL REFERENCES "ContactSubmission"("id") ON DELETE CASCADE,
  "message" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'a enviar',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "ContactReply_submissionId_idx" ON "ContactReply"("submissionId");
