import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function Login({ setUser }) {
  const [userName, setUserName] = useState("");
  const [userPW, setUserPW] = useState("");
  const [error, setError] = useState(null);

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
      const response = await axios.post(
        "http://localhost:4000/api/Login/post",
        {
          userName: userName,
          userPW: userPW,
        }
      );
      const data = await response.json();
      if (!response.ok) {
        setError(data.message || "로그인 실패");
      } else {
        const { userName, userPW } = data.user;
        localStorage.setItem("userName", JSON.stringify(userName));
        localStorage.setItem("userPW", JSON.stringify(userPW));
        setUser({ userName, userPW });
        setUserName("");
        setUserPW("");
        navigate("/");
      }
    } catch (error) {
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
      {error && <p>{error}</p>}
      <button onClick={UserLogin}>로그인</button>
      <button onClick={GoSignup}>회원가입</button>
      <button onClick={GoBack}>취소</button>
    </div>
  );
}
