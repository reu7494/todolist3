import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Paper,
  Alert,
  Divider,
} from "@mui/material";
import { Delete, ArrowBack, CheckCircle } from "@mui/icons-material";

export function SignOut({ user, setUser }) {
  const [userName, setuserName] = useState("");
  const [password, setPassword] = useState("");
  const [text, enableButton] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("info");

  const navigate = useNavigate();

  function GoBack() {
    navigate("/");
  }

  async function handleDelete() {
    try {
      await axios.delete(`http://localhost:4000/api/SignOut/${userName}`);

      setUser({ userName: "", isLoggedIn: false });

      setAlertMessage("회원탈퇴가 완료되었습니다.");
      setAlertType("success");
      setShowAlert(true);

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      console.error("회원탈퇴 오류:", error);
      setAlertMessage("회원탈퇴 중 오류가 발생했습니다.");
      setAlertType("error");
      setShowAlert(true);
    }
  }

  async function checkButton() {
    if (!userName.trim() || !password.trim()) {
      setAlertMessage("모든 필드를 입력해주세요");
      setAlertType("warning");
      setShowAlert(true);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/SignOut/check",
        { userName, password }
      );

      if (response.data) {
        setAlertMessage(
          "회원정보가 일치합니다. 회원탈퇴 버튼이 활성화되었습니다."
        );
        setAlertType("success");
        setShowAlert(true);
        enableButton(true);
      } else {
        setAlertMessage("회원정보가 일치하지 않습니다.");
        setAlertType("error");
        setShowAlert(true);
        enableButton(false);
      }
    } catch (error) {
      setAlertMessage("확인 중 오류가 발생했습니다.");
      setAlertType("error");
      setShowAlert(true);
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "top",
        minHeight: "60vh",
        backgroundColor: "#ffffff",
        padding: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          maxWidth: 450,
          width: "100%",
        }}
      >
        <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
          회원탈퇴
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          회원탈퇴를 진행하시려면 계정 정보를 입력해주세요.
        </Typography>

        {showAlert && (
          <Alert
            severity={alertType}
            sx={{ mb: 2 }}
            onClose={() => setShowAlert(false)}
          >
            {alertMessage}
          </Alert>
        )}

        <Stack spacing={2}>
          {/* 유저명 입력 */}
          <TextField
            label="유저명"
            variant="outlined"
            fullWidth
            value={userName}
            onChange={(e) => setuserName(e.target.value)}
            placeholder="유저명을 입력하세요"
          />

          {/* 비밀번호 입력 */}
          <TextField
            label="비밀번호"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
          />

          {/* 확인 버튼 */}
          <Button
            variant="outlined"
            fullWidth
            startIcon={<CheckCircle />}
            onClick={checkButton}
            sx={{ mt: 1 }}
          >
            정보 확인
          </Button>

          <Divider sx={{ my: 1 }} />

          {/* 회원탈퇴 버튼 */}
          <Button
            variant="contained"
            color="error"
            fullWidth
            startIcon={<Delete />}
            disabled={!text}
            onClick={handleDelete}
          >
            회원탈퇴
          </Button>

          {/* 취소 버튼 */}
          <Button
            variant="text"
            fullWidth
            startIcon={<ArrowBack />}
            onClick={GoBack}
          >
            취소
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
