import express from "express";
import nodemailer from "nodemailer";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";

import { env } from "../env.js";

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: false, // upgrade later with STARTTLS
  tls: { rejectUnauthorized: false },
});

router.post<object, { success: boolean }>("/", validateRequest({
  body: z.object({
    to: z.string().email(),
    subject: z.string(),
    text: z.string(),
  }),
}), async (req, res) => {
  let success: boolean;
  try {
    await transporter.sendMail({
      from: "acme@example.com",
      to: req.body.to,
      subject: req.body.subject,
      html: req.body.text,
    });
    success = true;
  }
  catch (err) {
    console.error(err);
    success = false;
  }

  res.json({ success });
});

export default router;
