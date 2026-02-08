const { app } = require("./app");
const { env } = require("./config/env");
const { connectDb } = require("./config/db");

async function start() {
  env.require("JWT_SECRET");
  env.require("MONGO_URI");

  console.log("Connecting to MongoDB...");
  await connectDb(env.mongoUri);
  console.log("Connected to MongoDB");

  app.listen(env.port, () => {
    console.log(`Server listening on http://localhost:${env.port}`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
