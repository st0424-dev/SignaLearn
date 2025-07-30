import express from "express";

import emailRouter from "./email.js";
import questionsRouter from "./questions.js";
import uploadRouter from "./upload.js";

const router = express.Router();

router.use("/upload", uploadRouter);
router.use("/ques", questionsRouter);
router.use("/email", emailRouter);
router.get("/ping", (req, res) => {
  res.json({
    info: "Server is running, ping received",
    ip: req.ip,
    host: req.host,
  });
});

export default router;
