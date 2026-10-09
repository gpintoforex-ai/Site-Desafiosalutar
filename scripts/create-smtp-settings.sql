-- Execute once in the Neon SQL Editor before deploying the admin page.
-- Existing contact messages are preserved.
CREATE TABLE IF NOT EXISTS "SmtpSettings" (
  "id" TEXT NOT NULL DEFAULT 'default',
  "host" TEXT NOT NULL DEFAULT 'smtp.gmail.com',
  "port" INTEGER NOT NULL DEFAULT 465,
  "username" TEXT NOT NULL,
  "passwordCiphertext" TEXT NOT NULL,
  "recipient" TEXT NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "SmtpSettings_pkey" PRIMARY KEY ("id")
);
