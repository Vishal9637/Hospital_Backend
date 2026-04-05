const express = require("express");
const router = express.Router();
const controller = require("../controllers/patientController");

router.get("/", controller.getPatients);
router.post("/", controller.addPatient);
router.put("/:id", controller.updatePatient);
router.delete("/:id", controller.deletePatient);

module.exports = router;