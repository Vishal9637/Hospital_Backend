const db = require("../config/db");

// ✅ GET BILLING DATA (AUTO FETCH FEES)
exports.getBillingData = (req, res) => {
  const sql = `
    SELECT 
      p.patient_id,
      p.name,

      -- doctor fee
      IFNULL(d.fees, 0) AS doctor_fee,

      -- room fee (calculated)
      IFNULL(
        (DATEDIFF(IFNULL(pr.checkout_date, NOW()), pr.checkin_date) * r.fees),
        0
      ) AS room_fee

    FROM patients p

    LEFT JOIN patient_doctor pd ON p.patient_id = pd.patient_id
    LEFT JOIN doctors d ON pd.doctor_id = d.doctor_id

    LEFT JOIN patient_rooms pr ON p.patient_id = pr.patient_id
    LEFT JOIN rooms r ON pr.room_id = r.room_id
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// ✅ CREATE BILL
exports.createBill = (req, res) => {
  const {
    patient_id,
    doctor_fee,
    room_fee,
    medicine_fee,
    payment_status,
  } = req.body;

  const total_amount =
    Number(doctor_fee) + Number(room_fee) + Number(medicine_fee);

  const sql = `
    INSERT INTO billing 
    (patient_id, doctor_fee, room_fee, medicine_fee, total_amount, payment_status)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [patient_id, doctor_fee, room_fee, medicine_fee, total_amount, payment_status],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Bill created" });
    }
  );
};

// ✅ GET ALL BILLS
exports.getBills = (req, res) => {
  const sql = `
    SELECT b.*, p.name 
    FROM billing b
    JOIN patients p ON b.patient_id = p.patient_id
  `;

  db.query(sql, (err, result) => {
    res.json(result);
  });
};

// ✅ UPDATE BILL
exports.updateBill = (req, res) => {
  const { id } = req.params;
  const { medicine_fee, payment_status } = req.body;

  db.query(
    "SELECT doctor_fee, room_fee FROM billing WHERE bill_id=?",
    [id],
    (err, result) => {
      const doctor_fee = result[0].doctor_fee;
      const room_fee = result[0].room_fee;

      const total =
        Number(doctor_fee) + Number(room_fee) + Number(medicine_fee);

      db.query(
        "UPDATE billing SET medicine_fee=?, total_amount=?, payment_status=? WHERE bill_id=?",
        [medicine_fee, total, payment_status, id],
        () => {
          res.json({ message: "Updated" });
        }
      );
    }
  );
};

// ✅ DELETE BILL
exports.deleteBill = (req, res) => {
  db.query(
    "DELETE FROM billing WHERE bill_id=?",
    [req.params.id],
    () => {
      res.json({ message: "Deleted" });
    }
  );
};