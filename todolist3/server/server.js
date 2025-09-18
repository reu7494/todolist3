const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./db");

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

async function validateLogin(userName, password) {
  const query = "SELECT * FROM signup WHERE userName = ? AND password = ?";
  return new Promise((resolve, reject) => {
    db.query(query, [userName, password], (err, rows) => {
      if (err) reject(err);
      else resolve(rows.length > 0);
    });
  });
}

//회원가입
app.post("/api/SignUp/post", (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) {
    return res.status(400).send("유저명과 비밀번호가 필요합니다.");
  }

  const query = "INSERT INTO signup (userName, password) VALUES (?,?);";
  db.execute(query, [userName, password], (err, result) => {
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
  db.execute("DELETE FROM signup WHERE userName=?", [userName], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.sendStatus(200);
  });
});

app.post("/api/Login/post", async (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) {
    return res.status(400).send("유저명과 비밀번호가 필요합니다.");
  }

  const isValid = await validateLogin(userName, password);

  if (isValid) {
    return res.status(200).json({
      success: true,
      message: "로그인 성공",
      user: {
        userName,
      },
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "로그인 실패",
    });
  }
});

//유저명 중복체크
app.post("/api/SignUp/checkUserName", (req, res) => {
  const checkName = req.body.userName;
  const query = "select userName from signup where userName=?";
  db.execute(query, [checkName], (err, rows, result) => {
    if (rows.length > 0) {
      res.send(true);
    } else {
      res.send(false);
    }
  });
});

//회원탈퇴 시 유저 가입정보 확인
app.post("/api/SignOut/check", async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).send("유저명과 비밀번호가 필요합니다.");
  }

  try {
    const isValid = await validateLogin(userName, password);
    if (isValid) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (error) {
    res.status(500).send("서버 오류");
  }
});

//리스트 항목 저장
app.post("/api/post", (req, res) => {
  const { title, usename, content } = req.body;
  const query = "INSERT INTO list (title, usename, content) VALUES (?,?,?);";
  db.execute(query, [title, usename, content], (err, result) => {
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
  db.execute("SELECT * FROM list", (err, results) => {
    if (err) return res.status(500).send("데이터 조회 실패");
    return res.status(200).json(results);
  });
});

//유저 정보 가져옴
app.get("/api/userName/get", (req, res) => {
  db.execute("SELECT userName FROM signup", (err, results) => {
    if (err) return res.status(500).send("데이터 조회 실패");
    return res.status(200).json(results);
  });
});

//id별 리스트 삭제
app.delete("/api/delete/:id", (req, res) => {
  const { id } = req.params;
  db.execute("DELETE FROM list WHERE id=?", [id], (err) => {
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
  db.execute(query, [id], (err, results) => {
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
