import app from "./app";
import config from "./config";
import { initDB } from "./db";

const main = async () => {
  initDB();
  // listening port
  app.listen(config.port, () => {
    console.log(`This server is running on http://localhost:${config.port}/`);
  });
};

main();
