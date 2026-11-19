import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { pool } from "./db";
import { userRoute } from "./modules/users/user.route";
const app: Application = express();
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));

// root route
app.get("/", (req: Request, res: Response) => {
  //   res.send("Hello World!");
  res.status(200).json({
    success: true,
    message: "This is root route",
    author: "Rahat",
  });
});
app.use("/api/v1/users", userRoute);

export default app;
