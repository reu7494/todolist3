import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function SignOut({ user, setUser }) {
  const [userName, setuserName] = useState("");
  const [password, setPassword] = useState("");
  const [text, enableButton] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    alert(
      `Your state values: \n 
       text: ${text} \n 
       You can replace this alert with your process`
    );
  }

  function handleUser(e) {
    setuserName(e.target.value);
    enableButton(!text);
  }

  function handlePassword(e) {
    setPassword(e.target.value);
    enableButton(!text);
  }

  async function handleDelete() {
    try {
      await axios.delete(`http://localhost:4000/api/SignOut/${user.userName}`);

      setUser({ id: null, userName: "", isLoggedIn: false });

      alert("회원탈퇴가 완료되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("회원탈퇴 오류:", error);
      alert("회원탈퇴 중 오류가 발생했습니다.");
    }
  }

  async function checkButton() {
    const response = await axios.post(
      "http://localhost:4000/api/SignOut/check",
      { userName, password }
    );
    if (response.data) {
      alert("입력한 정보가 다릅니다.");
    } else {
      alert("입력 확인");
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <h2>회원탈퇴</h2>
        <input
          type="text"
          value={userName}
          placeholder="유저명을 입력하시오"
          onChange={handleUser}
        />
        <input
          type="text"
          value={password}
          placeholder="비밀번호를 입력하시오"
          onChange={handlePassword}
        />
        <button onClick={checkButton}>확인</button>
        <button type="submit" disabled={!text} onClick={handleDelete}>
          회원탈퇴
        </button>
      </div>
    </form>
  );
}
