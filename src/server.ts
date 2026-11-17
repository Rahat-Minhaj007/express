import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool } from "pg";
const app: Application = express();
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
const PORT = 5001;

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_hKqUu3fciw1X@ep-odd-wave-ao45vs1p-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=false&channel_binding=require",
});

const initDB = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            age INT,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            );
            `);
  } catch (error) {
    console.log(error);
  }
};
initDB();

// root route
app.get("/", (req: Request, res: Response) => {
  //   res.send("Hello World!");
  res.status(200).json({
    success: true,
    message: "This is root route",
    author: "Rahat",
  });
});

// post user
app.post("/api/v1/users", async (req: Request, res: Response) => {
  try {
    const { name, email, password, age } = req.body;

    const queryText = `  INSERT INTO users (name, email, password, age) VALUES ($1,$2,$3,$4) RETURNING *`;
    const values = [name, email, password, age];
    const result = await pool.query(queryText, values);

    console.log(result);
    res.status(201).json({
      success: true,
      message: "user created successfully!",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error?.message,
    });
  }
});

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
      email =COALESCE($2, email),
      password = COALESCE($3, password),
      is_active = COALESCE($4, is_active),
      age = COALESCE($5, age)
      WHERE id = $6 
      RETURNING *
    `;
    const values = [name, email, password, is_active, age, id];
    const result = await pool.query(queryText, values);
    res.status(201).json({
      success: true,
      message: "users data updated!",
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
app.delete("/api/v1/users/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const queryText = "DELETE FROM users WHERE id = $1";
    const values = [id];
    const result = await pool.query(queryText, values);
    res.status(201).json({
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

// listening port
app.listen(PORT, () => {
  console.log(`This server is running on http://localhost:${PORT}/`);
});
