const db = require("../config/db");

// GET ALL DOCTORS
exports.getDoctors = (req, res) => {
  db.query("SELECT * FROM doctors", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// ADD DOCTOR
exports.addDoctor = (req, res) => {
  const { name, specialization, phone, email, fees } = req.body;

  const sql = `
    INSERT INTO doctors (name, specialization, phone, email, fees)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [name, specialization, phone, email, fees], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Doctor added successfully" });
  });
};

// UPDATE DOCTOR
exports.updateDoctor = (req, res) => {
  const { id } = req.params;
  const { name, specialization, phone, email, fees } = req.body;

  const sql = `
    UPDATE doctors 
    SET name=?, specialization=?, phone=?, email=?, fees=? 
    WHERE doctor_id=?
  `;

  db.query(sql, [name, specialization, phone, email, fees, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Doctor updated successfully" });
  });
};

// DELETE DOCTOR
exports.deleteDoctor = (req, res) => {
  db.query(
    "DELETE FROM doctors WHERE doctor_id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Doctor deleted" });
    }
  );
};