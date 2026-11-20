import express, {
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import { pool } from "./db";
import { userRoute } from "./modules/users/user.route";
import { profileRoute } from "./modules/profile/profile.route";
import { authRoute } from "./modules/auth/auth.route";
import loggerMiddleware from "./middleware/logger";

const app: Application = express();
// Without this, req.ip will be the proxy's IP, not the user's.
app.set("trust proxy", true);
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

// user module
app.use("/api/v1/users", userRoute);
app.use("/api/v1/profiles", profileRoute);
app.use("/api/v1/auth", authRoute);
// root route
app.get("/", (req: Request, res: Response) => {
  //   res.send("Hello World!");
  res.status(200).json({
    success: true,
    message: "This is root route",
    author: "Rahat",
  });
});

export default app;
