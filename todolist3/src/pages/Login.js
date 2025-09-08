import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [userName, setUserName] = useState("");
  const [userPW, setUserPW] = useState("");

  const navigate = useNavigate();

  function GoSignup() {
    navigate("/signup");
  }

  function GoBack() {
    navigate("/");
  }

  async function UserLogin() {
    if (userName.trim() === "" || userPW.trim() === "") return;

    try {
      await axios.post("http://localhost:4000/api/Login/post", {
        userName,
        userPW,
      });
      alert("로그인 성공");
      setUserName("");
      setUserPW("");
      navigate("/");
    } catch (error) {
      alert("로그인 실패");
      console.error(error);
    }
  }
  return (
    <div>
      <h2>로그인</h2>
      <input
        type="text"
        value={userName}
        placeholder="유저명"
        onChange={(e) => setUserName(e.target.value)}
      />
      <input
        type="password"
        value={userPW}
        placeholder="비밀번호"
        onChange={(e) => setUserPW(e.target.value)}
      />
      <button onClick={UserLogin}>로그인</button>
      <button onClick={GoSignup}>회원가입</button>
      <button onClick={GoBack}>취소</button>
    </div>
  );
}
