require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./db");

const PORT = process.env.PORT || 4000;
const SECRET_KEY = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

function verifyToken(req, res, next) {
  // 헤더에서 토큰 추출
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "토큰이 제공되지 않았습니다",
    });
  }
  // "Bearer TOKEN" 형식에서 토큰만 추출
  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "토큰 형식이 올바르지 않습니다",
    });
  }
  try {
    // 토큰 검증
    const decoded = jwt.verify(token, SECRET_KEY);
    // req.user에 사용자 정보 저장
    req.user = decoded;
    // 다음 미들웨어로 이동
    next();
  } catch (error) {
    console.error("토큰 검증 실패:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "토큰이 만료되었습니다. 다시 로그인하세요",
      });
    }
    return res.status(401).json({
      success: false,
      message: "유효하지 않은 토큰입니다",
    });
  }
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
app.delete("/api/SignOut/:userName", verifyToken, (req, res) => {
  const { userName } = req.user.username;
  db.execute("DELETE FROM signup WHERE userName=?", [userName], (err) => {
    if (err) return res.status(500).json({ success: false });
    res.json({ success: true, message: "회원탈퇴가 완료되었습니다" });
  });
});

//로그인
app.post("/api/Login/post", (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) {
    return res
      .status(400)
      .json({ success: false, message: "유저명과 비밀번호가 필요합니다." });
  }

  const query = "SELECT * FROM signup WHERE userName = ? AND password = ?";
  db.execute(query, [userName, password], (err, result) => {
    if (err) {
      console.error("DB 오류:", err);
      return res.status(500).json({ success: false, message: "서버 오류" });
    }

    if (result.length === 0) {
      return res.status(401).json({
        success: false,
        message: "아이디 또는 비밀번호가 틀립니다",
      });
    }

    const user = result[0];

    const token = jwt.sign(
      {
        userId: user.id,
        userName: user.userName,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.json({
      success: true,
      token: token,
      userName: user.userName,
      message: "로그인 성공",
    });
  });
});

//비밀번호 변경

app.patch("/api/ChangePassword", verifyToken, (req, res) => {
  const { oldPassword, newPassword, userName } = req.body;
  const query =
    "UPDATE signup SET password = ? WHERE password = ? AND userName = ?";
  db.execute(query, [newPassword, oldPassword, userName], (err, result) => {
    if (result.length > 0) {
      res.send(true);
    } else {
      res.send(false);
    }
  });
});

//유저명 중복체크
app.post("/api/SignUp/checkUserName", (req, res) => {
  const checkName = req.body.userName;
  const query = "SELECT userName FROM signup WHERE userName=?";
  db.execute(query, [checkName], (err, rows, result) => {
    if (rows.length > 0) {
      res.send(true);
    } else {
      res.send(false);
    }
  });
});

//회원탈퇴 시 유저 가입정보 확인
app.post("/api/SignOut/check", verifyToken, (req, res) => {
  const { userName } = req.user.userName;
  const { password } = req.body;

  if (!userName || !password) {
    return res.status(400).send("유저명과 비밀번호가 필요합니다.");
  }

  try {
    const query = "SELECT * FROM signup WHERE userName = ? AND password = ?";
    db.execute(query, [userName, password], (err, rows) => {
      if (rows.length > 0) {
        res.send(true);
      } else {
        res.send(false);
      }
    });
  } catch (error) {
    res.status(500).send("서버 오류");
  }
});

//리스트 항목 저장
app.post("/api/post", verifyToken, (req, res) => {
  const { title, content, created_at } = req.body;
  const usename = req.user.userName; // 토큰에서 사용자명 가져오기
  const query =
    "INSERT INTO list (title, usename, content,created_at) VALUES (?,?,?,?);";
  db.execute(query, [title, usename, content, created_at], (err, result) => {
    if (err) {
      console.error("데이터 삽입 오류:", err);
      return res.status(500).send("데이터 삽입 중 오류 발생");
    } else {
      res.send({ success: true, message: "게시글이 작성되었습니다" });
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
app.delete("/api/delete/:id", verifyToken, (req, res) => {
  const { id } = req.params;
  const username = req.user.userName;

  //게시글 작성자 확인
  db.execute("SELECT usename FROM list WHERE id = ?", [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "서버 오류",
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "게시글을 찾을 수 없습니다",
      });
    }

    // 작성자와 로그인 사용자가 일치하는지 확인
    if (results[0].usename !== username) {
      return res.status(403).json({
        success: false,
        message: "삭제 권한이 없습니다",
      });
    }

    // 삭제 실행
    db.execute("DELETE FROM list WHERE id = ?", [id], (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: "삭제 실패",
        });
      }

      res.json({
        success: true,
        message: "게시글이 삭제되었습니다",
      });
    });
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

app.patch("/api/view/:id", (req, res) => {
  const { id } = req.params;

  db.execute(
    "UPDATE list SET views = views + 1 WHERE id = ?",
    //? (물음표) - SQL 플레이스홀더
    //의미: SQL 쿼리에서 "여기에 값을 넣어줘"라는 표시
    [id],
    (err, results) => {
      // err: 에러 정보
      // results: 성공했을 때 결과 데이터
      if (err) {
        return res.status(500).json({ error: "조회수 증가 실패" });
      }
      res.json({ message: "조회수 증가 완료" });
    }
  );
});

// 콜백 패턴 (db.execute(query, params, callback)) → async 불필요
// Promise 패턴 (await db.execute(query, params)) → async 필요
// res.json => 1.객체는 json 문자열로 변환 2.Content-Type 헤더가 세팅되지 않았을 경우 res 객체에 Content-Type로 세팅 3.res.send(body) 실행
// ㄴ> res.json(object) - res.send(string)
// res.send => 1.body 타입 체크 2.객체일 경우 res.json 호출 3.문자열 변환 후 res.send 호출
// ㄴ> res.send(object) - res.json(object) - res.send(string)

app.listen(PORT, () => {
  console.log(`서버 작동:http://localhost:${PORT}/`);
});
