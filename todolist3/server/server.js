const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./db");

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.post("/api/post", (req, res) => {
  const { title, usename, countent } = req.body;
  const query = "INSERT INTO list (title, usename, countent) VALUES (?,?,?);";
  db.query(query, [title, usename, countent], (err, result) => {
    if (err) {
      console.error("데이터 삽입 오류:", err);
      return res.status(500).send("데이터 삽입 중 오류 발생");
    } else {
      return res.status(201).send("데이터 삽입 성공");
    }
  });
});

app.get("/api/get", (req, res) => {
  db.query("SELECT * FROM list", (err, results) => {
    if (err) return res.status(500).send("데이터 조회 실패");
    return res.status(200).json(results);
  });
});

app.delete("/api/delete/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM list WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.sendStatus(200);
  });
});
// app.get("/api/get/byId/:id", (req, res) => {
//   const { id } = req.params;
//   if (!id) {
//     return res.status(400).send("id를 찾을 수 없습니다.");
//   }

//   const query = "SELECT * FROM list WHERE id = ?";
//   db.query(query, [id], (err, results) => {
//     if (err) {
//       console.error("데이터 조회 오류:", err);
//       return res.status(500).send("데이터 조회 중 오류 발생");
//     } else {
//       return res.status(200).json(results[0]);
//     }
//   });
// });

// app.get("/api/get/byContent/:countent", (req, res) => {
//   const { id } = req.params;
//   if (!id) {
//     return res.status(400).send("countent 찾을 수 없습니다.");
//   }

//   const query = "SELECT * FROM list WHERE countent = ?";
//   db.query(query, [id], (err, results) => {
//     if (err) {
//       console.error("데이터 조회 오류:", err);
//       return res.status(500).send("데이터 조회 중 오류 발생");
//     } else if (results.length === 0) {
//       return res.status(404).send("해당 게시글을 찾을 수 없습니다.");
//     } else {
//       return res.status(200).json(results[0]);
//     }
//   });
// });

app.listen(PORT, () => {
  console.log(`서버 작동:http://localhost:${PORT}/`);
});
