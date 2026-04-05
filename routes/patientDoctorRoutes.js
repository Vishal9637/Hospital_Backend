const express = require("express");
const router = express.Router();
const controller = require("../controllers/patientDoctorController");

router.get("/", controller.getAssignments);
router.post("/", controller.assignDoctor);
router.put("/:id", controller.updateAssignment);
router.delete("/:id", controller.deleteAssignment);

module.exports = router;