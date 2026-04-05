const db = require("../config/db");

// GET ALL
exports.getPatients = (req, res) => {
  db.query("SELECT * FROM patients", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// ADD (AUTO DATE)
exports.addPatient = (req, res) => {
  const { name, age, gender, phone, address, disease } = req.body;

  const sql = `
    INSERT INTO patients 
    (name, age, gender, phone, address, disease, admission_date)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;

  db.query(sql, [name, age, gender, phone, address, disease], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Patient added" });
  });
};

// UPDATE
exports.updatePatient = (req, res) => {
  const { id } = req.params;
  const { name, age, gender, phone, address, disease } = req.body;

  const sql = `
    UPDATE patients 
    SET name=?, age=?, gender=?, phone=?, address=?, disease=? 
    WHERE patient_id=?
  `;

  db.query(sql, [name, age, gender, phone, address, disease, id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Updated successfully" });
  });
};

// DELETE
exports.deletePatient = (req, res) => {
  db.query("DELETE FROM patients WHERE patient_id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Deleted" });
  });
};