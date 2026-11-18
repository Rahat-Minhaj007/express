import dotenv from "dotenv";
import path from "path";
dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const config = {
  port: process.env.PORT,
  connection_string: process.env.DATABASE_URL ,
};

if (!config.connection_string) {
  throw new Error("DATABASE_URL is missing in .env");
}

export default config;
