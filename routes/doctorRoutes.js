const express = require("express");
const router = express.Router();
const controller = require("../controllers/doctorController");

router.get("/", controller.getDoctors);
router.post("/", controller.addDoctor);
router.put("/:id", controller.updateDoctor);
router.delete("/:id", controller.deleteDoctor);

module.exports = router;