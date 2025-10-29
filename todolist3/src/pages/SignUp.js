import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Stack,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Person, Lock, Visibility, VisibilityOff } from "@mui/icons-material";

export function SignUp() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [messageType, setMessageType] = useState("info");
  const BASE_URL = process.env.REACT_APP_API_URL;

  const navigate = useNavigate();

  const nameRegEx = /^[a-z][a-z0-9-_]{2,20}$/;
  const passwordRegEx = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,20}$/;

  function GoBack() {
    navigate("/");
  }

  async function UserSignUp(e) {
    e.preventDefault();
    setMessage("");

    if (!userName.trim() || !password.trim() || !confirmPassword.trim()) {
      setMessage("모든 필드를 입력해주세요.");
      setMessageType("error");
      return;
    }

    // 유저명 형식 체크
    if (!nameRegEx.test(userName)) {
      setMessage("유저명 형식을 확인하세요.");
      setMessageType("error");
      return;
    }

    // 비밀번호 형식 체크
    if (!passwordRegEx.test(password)) {
      setMessage("비밀번호 형식을 확인하세요.");
      setMessageType("error");
      return;
    }

    // 비밀번호 확인 체크
    if (password !== confirmPassword) {
      setMessage("비밀번호가 일치하지 않습니다.");
      setMessageType("error");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/SignUp/post`, {
        userName: userName,
        password: password,
      });
      setMessage("회원가입 성공!");
      setMessageType("success");

      setUserName("");
      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      setMessage("회원가입 실패 - 오류가 발생했습니다.");
      setMessageType("error");
    }
  }

  async function checkButton() {
    if (!userName.trim()) {
      setMessage("유저명을 입력해주세요.");
      setMessageType("error");
      return;
    }

    try {
      const response = await axios.post(
        `${BASE_URL}/api/SignUp/checkUserName`,
        { userName }
      );
      if (response.data) {
        setMessage("이미 사용 중인 유저명입니다.");
        setMessageType("error");
      } else {
        setMessage("사용 가능한 유저명입니다.");
        setMessageType("success");
      }
    } catch (error) {
      setMessage("중복 확인 중 오류가 발생했습니다.");
      setMessageType("error");
    }
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            align="center"
            sx={{ mb: 3, fontWeight: "bold", color: "primary.main" }}
          >
            회원가입
          </Typography>

          {message && (
            <Alert
              severity={messageType}
              sx={{ mb: 3 }}
              onClose={() => setMessage("")}
            >
              {message}
            </Alert>
          )}

          <Box component="form" onSubmit={UserSignUp}>
            <Stack spacing={3}>
              {/* 유저명 입력 */}
              <Box>
                <TextField
                  fullWidth
                  label="유저명"
                  value={userName}
                  placeholder="영어 소문자 및 숫자를 조합하시오"
                  onChange={(e) => setUserName(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                  helperText="영어 소문자로 시작, 3-21자 (소문자, 숫자, -, _ 사용가능)"
                />
                <Button
                  variant="outlined"
                  onClick={checkButton}
                  sx={{ mt: 1 }}
                  size="small"
                >
                  중복 확인
                </Button>
              </Box>

              {/* 비밀번호 입력 */}
              <TextField
                fullWidth
                label="비밀번호"
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="영문 및 숫자를 8자 이상 사용하시오"
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                helperText="영문, 숫자 포함 8-20자"
              />

              {/* 비밀번호 확인 */}
              <TextField
                fullWidth
                label="비밀번호 확인"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                placeholder="비밀번호 확인"
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* 버튼들 */}
              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{ py: 1.5 }}
                >
                  회원가입
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  size="large"
                  onClick={GoBack}
                  sx={{ py: 1.5 }}
                >
                  취소
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
