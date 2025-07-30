const express = require("express");
const app = express();
const db = require("./db");

const PORT = process.env.PORT || 4000;

app.post("/api/post", (req, res) => {
  const { title, usename, dow } = req.body;
  const query =
    "INSERT INTO todolist_table (id, title, usename, created_at, dow) VALUES (?,?,?,?,?);";
  db.query(query, [title, usename, dow], (err, result) => {
    if (err) {
      console.error("데이터 삽입 오류:", err);
      res.status(500).send("데이터 삽입 중 오류 발생");
    } else {
      res.status(201).send("데이터 삽입 성공");
    }
  });
});

app.get("/api/get", (req, res) => {
  const query = "SELECT * FROM todolist_table";

  db.query(query, (err, results) => {
    if (err) {
      console.error("데이터 조회 오류:", err);
      res.status(500).send("데이터 조회 중 오류 발생");
    } else {
      res.status(200).json(results);
    }
  });
});

app.get("/api/get/:id", (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send("id를 찾을 수 없습니다.");
  }

  const query = "SELECT * FROM todolist_table WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("데이터 조회 오류:", err);
      res.status(500).send("데이터 조회 중 오류 발생");
    } else {
      res.status(200).json(results[0]);
    }
  });
});

app.get("/api/get/:dow", (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send("dow를 찾을 수 없습니다.");
  }

  const query = "SELECT * FROM todolist_table WHERE dow = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("데이터 조회 오류:", err);
      res.status(500).send("데이터 조회 중 오류 발생");
    } else if (results.length === 0) {
      res.status(404).send("해당 게시글을 찾을 수 없습니다.");
    } else {
      res.status(200).json(results[0]);
    }
  });
});

app.listen(PORT, () => {
  console.log(`서버 작동:http://localhost:${PORT}/`);
});
