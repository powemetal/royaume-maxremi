import { Router, type Request, type Response } from "express";
import axios from "axios";

const routeurHealthCheck = Router();

routeurHealthCheck.get("/", async (req: Request, res: Response) => {
  const healthCheckDnd = async () => {
    try {
      await axios.get("https://www.dnd5eapi.co/api/2014/monsters/goblin");
      return { status: "up" };
    } catch {
      return { status: "down" };
    }
  };

  const dndStatus = await healthCheckDnd();

  res.json({
    dndApi: dndStatus,
    timestamp: new Date().toISOString(),
  });
});

export default routeurHealthCheck;
