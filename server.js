const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/patients", require("./routes/patientRoutes"));
app.use("/api/doctors", require("./routes/doctorRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/billing", require("./routes/billingRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));

app.use("/api/patient-doctor", require("./routes/patientDoctorRoutes"));

app.use("/api/billing", require("./routes/billingRoutes"));

app.listen(5000, () => {
  console.log("Server running on port 5000 🚀");
});