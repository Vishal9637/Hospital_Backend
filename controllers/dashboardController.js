const db = require("../config/db");

exports.getDashboardStats = (req, res) => {
  const stats = {};

  db.query("SELECT COUNT(*) AS totalPatients FROM patients", (err, result) => {
    if (err) return res.status(500).json(err);
    stats.patients = result[0].totalPatients;

    db.query("SELECT COUNT(*) AS totalDoctors FROM doctors", (err, result) => {
      if (err) return res.status(500).json(err);
      stats.doctors = result[0].totalDoctors;

      db.query("SELECT COUNT(*) AS totalRooms FROM rooms", (err, result) => {
        if (err) return res.status(500).json(err);
        stats.rooms = result[0].totalRooms;

        db.query("SELECT SUM(total_amount) AS revenue FROM billing", (err, result) => {
          if (err) return res.status(500).json(err);

          stats.revenue = result[0].revenue || 0;

          res.json(stats);
        });
      });
    });
  });
};