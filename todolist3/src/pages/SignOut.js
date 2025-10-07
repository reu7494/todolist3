import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import Alert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";

export function SignOut({ user, setUser }) {
  const [userName, setuserName] = useState("");
  const [password, setPassword] = useState("");
  const [text, enableButton] = useState(false);
  const navigate = useNavigate();

  function GoBack() {
    navigate("/");
  }

  async function handleDelete() {
    try {
      await axios.delete(`http://localhost:4000/api/SignOut/${userName}`);

      setUser({ id: null, userName: "", isLoggedIn: false });

      alert("회원탈퇴가 완료되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("회원탈퇴 오류:", error);
      alert("회원탈퇴 중 오류가 발생했습니다.");
    }
  }

  async function checkButton() {
    if (!userName.trim() || !password.trim()) {
      alert("모든 필드를 입력해주세요");
      return;
    }
    const response = await axios.post(
      "http://localhost:4000/api/SignOut/check",
      { userName, password }
    );
    if (response.data) {
      alert("회원정보 일치");
      enableButton(!text);
    } else {
      alert("회원정보가 다릅니다.");
      enableButton(!text);
    }
  }
  return (
    <div>
      <h2>회원탈퇴</h2>
      <input
        type="text"
        value={userName}
        placeholder="유저명을 입력하시오"
        onChange={(e) => setuserName(e.target.value)}
      />
      <input
        type="text"
        value={password}
        placeholder="비밀번호를 입력하시오"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={checkButton}>확인</button>
      <button disabled={!text} onClick={handleDelete}>
        회원탈퇴
      </button>
      <Button fullWidth variant="text" onClick={GoBack} sx={{ mt: 1 }}>
        취소
      </Button>
    </div>
  );
}
