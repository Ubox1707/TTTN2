import express from "express"
import { protectRoute } from "../middleware/protectRoute.js"
import { deleteNotifications, getNotifications } from "../controllers/Notification.js"

const router = express.Router()

router.get("/", protectRoute, getNotifications)

router.delete("/", protectRoute, deleteNotifications)



export default router;