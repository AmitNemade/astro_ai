import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { connectToDB } from "./config/dbConfig.js";
import userRouter from "./src/routes/userRoutes.js";
import personRouter from "./src/routes/personRoutes.js";

dotenv.config({ path: `.env.${process.env.NODE_ENV ?? 'development'}` })
const app = express();

app.use(express.json());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// Add Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/person", personRouter);
app.use("/", (req, res)=>{
  res.status(200).send(`<h1>AstroAI backend working successfully in ${process.env.NODE_ENV} environment</h1>`)
});

const port = process.env.PORT || 4000;
connectToDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on ${port}`);
    });
  })
  .catch((e) => console.log(e));
