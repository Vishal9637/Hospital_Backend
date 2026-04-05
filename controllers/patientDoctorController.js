const db = require("../config/db");

// GET
exports.getAssignments = (req, res) => {
  const sql = `
    SELECT pd.id,
           p.patient_id,
           p.name AS patient_name,
           d.doctor_id,
           d.name AS doctor_name,
           d.specialization,
           pd.assigned_date
    FROM patient_doctor pd
    JOIN patients p ON pd.patient_id = p.patient_id
    JOIN doctors d ON pd.doctor_id = d.doctor_id
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// ADD
exports.assignDoctor = (req, res) => {
  const { patient_id, doctor_id } = req.body;

  db.query(
    "INSERT INTO patient_doctor (patient_id, doctor_id, assigned_date) VALUES (?, ?, CURDATE())",
    [patient_id, doctor_id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Doctor assigned" });
    }
  );
};

// UPDATE
exports.updateAssignment = (req, res) => {
  const { id } = req.params;
  const { patient_id, doctor_id } = req.body;

  db.query(
    "UPDATE patient_doctor SET patient_id=?, doctor_id=? WHERE id=?",
    [patient_id, doctor_id, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Updated" });
    }
  );
};

// DELETE
exports.deleteAssignment = (req, res) => {
  db.query(
    "DELETE FROM patient_doctor WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Deleted" });
    }
  );
};