import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { pool } from "./db";
import { userRoute } from "./modules/users/user.route";
import { profileRoute } from "./modules/profile/profile.route";
const app: Application = express();
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

// user module
app.use("/api/v1/users", userRoute);
app.use("/api/v1/profiles", profileRoute);
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
