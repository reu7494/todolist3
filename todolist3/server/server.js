const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./db");

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

//회원가입
app.post("/api/SignUp/post", (req, res) => {
  const { userName, userPW } = req.body;
  const query = "INSERT INTO signup (userName, password) VALUES (?,?,?);";
  db.query(query, [userName, userPW], (err, result) => {
    if (err) {
      console.error("회원가입 오류:", err);
      return res.status(500).send("회원가입 중 오류 발생");
    } else {
      return res.status(201).send("회원가입 성공");
    }
  });
});

//회원탈퇴
app.delete("/api/SignOut/:userName", (req, res) => {
  const { userName } = req.params;
  db.query("DELETE FROM signup WHERE userName=?", [userName], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.sendStatus(200);
  });
});

//로그인
app.post("/api/Login/post", (req, res) => {
  const { userName, userPW } = req.body;

  if (!userName || !userPW) {
    return res.status(400).send("유저명과 비밀번호가 필요합니다.");
  }
  const query = "select * from signup where userName = ? AND password = ?";
  db.query(query, [userName, userPW], (err, result) => {
    if (err) {
      console.error("로그인 오류:", err);
      return res.status(500).send("로그인 중 오류 발생");
    }
    console.log("Db 조회 경과:", result);

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        message: "로그인 성공",
        user: {
          userName: userName,
          password: userPW,
        },
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "로그인 실패",
      });
    }
  });
});

//유저명 중복체크
app.post("/api/SignUp/checkUserName", (req, res) => {
  const checkName = req.body.userName;
  const query = "select userName from signup where userName=(?)";
  db.query(query, [checkName], (err, rows, result) => {
    if (rows === undefined) {
      res.send(true);
    } else {
      res.send(false);
    }
  });
});

//리스트 항목 저장
app.post("/api/post", (req, res) => {
  const { title, usename, content } = req.body;
  const query = "INSERT INTO list (title, usename, content) VALUES (?,?,?);";
  db.query(query, [title, usename, content], (err, result) => {
    if (err) {
      console.error("데이터 삽입 오류:", err);
      return res.status(500).send("데이터 삽입 중 오류 발생");
    } else {
      return res.status(201).send("데이터 삽입 성공");
    }
  });
});

//리스트 가져옴
app.get("/api/get", (req, res) => {
  db.query("SELECT * FROM list", (err, results) => {
    if (err) return res.status(500).send("데이터 조회 실패");
    return res.status(200).json(results);
  });
});

//유저 정보 가져옴
app.get("/api/userName/get", (req, res) => {
  db.query("SELECT userName FROM signup", (err, results) => {
    if (err) return res.status(500).send("데이터 조회 실패");
    return res.status(200).json(results);
  });
});

//id별 리스트 삭제
app.delete("/api/delete/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM list WHERE id=?", [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.sendStatus(200);
  });
});

//id 별 리스트 세부내용 가져옴
app.get("/api/get/:id", (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).send("content 찾을 수 없습니다.");
  }

  const query = "SELECT * FROM list WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error("데이터 조회 오류:", err);
      return res.status(500).send("데이터 조회 중 오류 발생");
    } else if (results.length === 0) {
      return res.status(404).send("해당 게시글을 찾을 수 없습니다.");
    } else {
      return res.status(200).json(results[0]);
    }
  });
});

app.listen(PORT, () => {
  console.log(`서버 작동:http://localhost:${PORT}/`);
});
