import app from "./app.mjs";
import config from "./config/config.mjs";
import pool from "./db/connect.mjs";

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💣 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

const port = config.port;

const server = app.listen(port, () => {
  console.log(`Running on port ${port}... `);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💣 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});
