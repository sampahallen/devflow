import dotenv from "dotenv";
import { createApp } from "./app.js";
import { connectDatabase } from "./config/database.js";

dotenv.config();

const port = Number(process.env.PORT) || 4000;
const app = createApp();

function startServer() {
  const server = app.listen(port, () => {
    console.log(`DevFlow API listening on http://127.0.0.1:${port}`);
  });

  server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
      console.error(
        `\nPort ${port} is already in use. Another backend instance is probably still running.\n` +
        `Stop it with: npm run free-port --workspace backend\n` +
        `Or run: taskkill /F /IM node.exe   (Windows, stops all Node processes)\n`
      );
      process.exit(1);
    }

    console.error("Failed to start DevFlow API", error);
    process.exit(1);
  });
}

connectDatabase()
  .then(startServer)
  .catch((error) => {
    console.error("Failed to start DevFlow API", error);
    process.exit(1);
  });
