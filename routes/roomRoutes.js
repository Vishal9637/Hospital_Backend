const express = require("express");
const router = express.Router();
const controller = require("../controllers/roomController");

router.get("/", controller.getRooms);
router.post("/", controller.addRoom);
router.put("/:id", controller.updateRoom);

router.post("/assign", controller.assignRoom);
router.get("/assigned", controller.getAssignedRooms);

router.put("/checkout/:id", controller.checkoutRoom);
router.delete("/:id", controller.deleteAssignment);
router.delete("/room/:id", controller.deleteRoom);

module.exports = router;