const express = require("express");
const router = express.Router();
const controller = require("../controllers/billingController");

router.get("/data", controller.getBillingData);
router.post("/", controller.createBill);
router.get("/", controller.getBills);
router.put("/:id", controller.updateBill);
router.delete("/:id", controller.deleteBill);

module.exports = router;