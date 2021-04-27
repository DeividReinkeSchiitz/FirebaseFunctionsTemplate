import * as express from "express";
import userController from "./controllers/alarmsController";

// eslint-disable-next-line new-cap
const router = express.Router();

router.post("/alarms/show", userController.show);
router.post("/alarms/create", userController.create);
router.delete("/alarms", userController.delete);
router.put("/alarms/:id", userController.update);

export default router;
