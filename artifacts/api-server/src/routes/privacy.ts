import { Router } from "express";
import { randomBytes } from "node:crypto";
import { pool } from "@workspace/db";
import { browserSession, hash, rateLimit } from "../lib/security";

const router = Router();
router.post("/proof", browserSession, rateLimit("privacy-proof", 5, 900), async (_req, res) => {
  const code = randomBytes(24).toString("hex");
  // Only the hash is persisted; this code proves a browser session, not a civil identity.
  await pool.query("DELETE FROM markito_privacy_proofs WHERE expires_at <= now()");
  await pool.query(
    "INSERT INTO markito_privacy_proofs VALUES ($1,$2,now()+interval '15 minutes')",
    [hash(code), res.locals.ownerHash],
  );
  res.status(201).json({ code, expiresInMinutes: 15 });
});
export default router;
