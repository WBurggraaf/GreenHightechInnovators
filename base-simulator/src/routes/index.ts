import express from "express";
import ExampleController from "../controllers/exampleController";
import MondayAtGreenLogisticsTheExampleLtdController from "../controllers/mondayAtGreenLogisticsTheExampleLtdController";

const router = express.Router();

// Route to controller. This also takes the object that was sent and sends it as JSON to the client
router.post("/exampleController", async (_req, res) => {
  const controller = new ExampleController();
  controller.request = _req;
  const response = await controller.getMessage();
  return res.json(response);
});

router.get("/mondayAtGreenLogisticsTheExampleLtd/simulate", async (_req, res) => {
  const controller = new MondayAtGreenLogisticsTheExampleLtdController();
  controller.request = _req;
  const response = await controller.simulate();
  return res.json(response);
});

export default router;