require("dotenv").config();
import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import redisClient from "./redisClient";
import { PhaseExecutor } from "./runner/PhaseExecutor";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.post(
  "/execute/:workflowId",
  async (req: Request, res: Response): Promise<any> => {
    const { workflowId } = req.params;
    console.log("hi there");
    try {
      const environment = await redisClient.get(`env:${workflowId}`);
      if (!environment) {
        return res.status(404).json({
          success: false,
          error: "Environment not found in Redis",
        });
      }

      let parsedEnv: any;
      try {
        parsedEnv = JSON.parse(JSON.parse(environment));
      } catch (err) {
        return res.status(400).json({
          success: false,
          error: "Invalid JSON in environment",
        });
      }

      const result = await PhaseExecutor.run(parsedEnv);
      await redisClient.set(
        `env:${workflowId}`,
        JSON.stringify(JSON.stringify(result))
      );

      return res.status(200).json({
        success: true,
      });
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        error: err?.message || "Internal Server Error",
      });
    }
  }
);

app.listen(process.env.PORT || 4000, () => {
  console.log(`Server running at ${process.env.PORT}`);
});
