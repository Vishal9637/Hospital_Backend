const db = require("../config/db");

// ✅ GET ROOMS
exports.getRooms = (req, res) => {
  db.query("SELECT * FROM rooms", (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};

// ✅ ADD ROOM (WITH FEES)
exports.addRoom = (req, res) => {
  const { room_number, room_type, fees } = req.body;

  const sql = `
    INSERT INTO rooms (room_number, room_type, fees, status)
    VALUES (?, ?, ?, 'Available')
  `;

  db.query(sql, [room_number, room_type, fees], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Room added successfully" });
  });
};

// ✅ UPDATE ROOM
exports.updateRoom = (req, res) => {
  const { id } = req.params;
  const { room_number, room_type, fees } = req.body;

  db.query(
    "UPDATE rooms SET room_number=?, room_type=?, fees=? WHERE room_id=?",
    [room_number, room_type, fees, id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Room updated successfully" });
    }
  );
};

// ✅ ASSIGN ROOM
exports.assignRoom = (req, res) => {
  const { patient_id, room_id } = req.body;

  db.query(
    "SELECT * FROM patient_rooms WHERE patient_id=? AND checkout_date IS NULL",
    [patient_id],
    (err, result) => {
      if (err) return res.status(500).json(err);

      if (result.length > 0) {
        return res.json({ message: "Patient already has a room!" });
      }

      db.query(
        "INSERT INTO patient_rooms (patient_id, room_id) VALUES (?, ?)",
        [patient_id, room_id],
        (err) => {
          if (err) return res.status(500).json(err);
          res.json({ message: "Room assigned successfully" });
        }
      );
    }
  );
};

// DELETE ROOM
exports.deleteRoom = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM rooms WHERE room_id=?", [id], (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Room deleted successfully" });
  });
};

// ✅ CHECKOUT
exports.checkoutRoom = (req, res) => {
  db.query(
    "UPDATE patient_rooms SET checkout_date = NOW() WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Checked out successfully" });
    }
  );
};

// ✅ DELETE
exports.deleteAssignment = (req, res) => {
  db.query(
    "DELETE FROM patient_rooms WHERE id=?",
    [req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json({ message: "Deleted successfully" });
    }
  );
};

// ✅ GET ASSIGNED WITH BILLING
exports.getAssignedRooms = (req, res) => {
  const sql = `
    SELECT 
      pr.id,
      p.patient_id,
      p.name AS patient_name,
      r.room_number,
      r.room_type,
      r.fees,
      pr.checkin_date,
      pr.checkout_date,

      DATEDIFF(
        IFNULL(pr.checkout_date, NOW()),
        pr.checkin_date
      ) AS total_days,

      (
        DATEDIFF(IFNULL(pr.checkout_date, NOW()), pr.checkin_date) * r.fees
      ) AS total_amount

    FROM patient_rooms pr
    JOIN patients p ON pr.patient_id = p.patient_id
    JOIN rooms r ON pr.room_id = r.room_id
  `;

  db.query(sql, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json(result);
  });
};