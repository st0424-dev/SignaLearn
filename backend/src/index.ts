import app from "./app.js";
import { connectToMongodb } from "./data/mongo.js";
import { env } from "./env.js";

const port = env.PORT;
const server = app.listen(port, async () => {
  console.log("Trying to connect to Mongodb 🔁");
  if (await connectToMongodb()) {
    console.log("Mongodb database is connected ✅");
  }
  else {
    throw new Error("Mongodb database is not connected ❌");
  }

  /* eslint-disable no-console */
  console.log(`Listening: http://localhost:${port}`);
  /* eslint-enable no-console */
});

server.on("error", (err) => {
  if ("code" in err && err.code === "EADDRINUSE") {
    console.error(`Port ${env.PORT} is already in use. Please choose another port or stop the process using it.`);
  }
  else {
    console.error("Failed to start server:", err);
  }
  process.exit(1);
});
