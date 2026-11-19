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


// get users
app.get("/api/v1/users", async (req: Request, res: Response) => {
  try {
    const queryText = `SELECT * FROM users`;
    const result = await pool.query(queryText);

    console.log(result.rows);
    res.status(200).json({
      success: true,
      message: "users data retrieved!",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
});

// get single user
app.get("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const queryText = "SELECT * FROM users WHERE id = $1";
    const values = [id];
    const result = await pool.query(queryText, values);
    res.status(200).json({
      success: true,
      message: "users data retrieved!",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
});

// get single user
app.put("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, email, password, is_active, age } = req.body;
    const queryText = `
      UPDATE users 
      SET name =COALESCE($1, name),
      password = COALESCE($2, password),
      age = COALESCE($4, age),
      is_active = COALESCE($3, is_active),
      updated_at = NOW()
      WHERE id = $5 
      RETURNING *
    `;
    const values = [
      name ?? null,
      password ?? null,
      is_active ?? null,
      age ?? null,
      id,
    ];
    const result = await pool.query(queryText, values);

    // Handle case where user ID does not exist
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "users data updated!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
});

// delete single user
app.delete("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const queryText = "DELETE FROM users WHERE id = $1";
    const values = [id];
    const result = await pool.query(queryText, values);
    // Handle case where user ID does not exist
    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }
    res.status(200).json({
      success: true,
      message: "users data deleted!",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
});

export default app;
