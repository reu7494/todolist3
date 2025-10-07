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

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  height: "calc(100vh - 100px)",
  minHeight: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
  },
}));

export function Login({ user, setUser }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [userNameError, setUserNameError] = useState(false);
  const [userNameErrorMessage, setUserNameErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "info",
  });

  const navigate = useNavigate();

  function GoSignup() {
    navigate("/signup");
  }

  function GoBack() {
    navigate("/");
  }

  const validateInputs = () => {
    let isValid = true;

    if (!userName || userName.trim() === "") {
      setUserNameError(true);
      setUserNameErrorMessage("사용자명을 입력해주세요.");
      isValid = false;
    } else {
      setUserNameError(false);
      setUserNameErrorMessage("");
    }

    if (!password || password.trim() === "") {
      setPasswordError(true);
      setPasswordErrorMessage("비밀번호를 입력해주세요.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateInputs()) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/api/Login/post",
        {
          userName,
          password,
        }
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userName", response.data.userName);
        setUser({ userName: response.data.userName, isLoggedIn: true });

        setAlert({
          show: true,
          message: "로그인 성공!",
          severity: "success",
        });

        setUserName("");
        setPassword("");

        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        // success가 false인 경우
        setAlert({
          show: true,
          message:
            response.data.message ||
            "로그인 실패 - 사용자명 또는 비밀번호를 확인해주세요.",
          severity: "error",
        });
      }
    } catch (error) {
      setAlert({
        show: true,
        message: "로그인 실패 - 사용자명 또는 비밀번호를 확인해주세요.",
        severity: "error",
      });
      console.error(error);
    }
  };

  return (
    <>
      <CssBaseline enableColorScheme />
      <SignInContainer direction="column" justifyContent="space-between">
        <Card variant="outlined">
          <Typography
            component="h1"
            variant="h4"
            sx={{
              width: "100%",
              fontSize: "clamp(2rem, 10vw, 2.15rem)",
              textAlign: "center",
              mb: 2,
            }}
          >
            로그인
          </Typography>

          {alert.show && (
            <Alert
              severity={alert.severity}
              sx={{ mb: 2 }}
              onClose={() => setAlert({ ...alert, show: false })}
            >
              {alert.message}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="userName">사용자명</FormLabel>
              <TextField
                error={userNameError}
                helperText={userNameErrorMessage}
                id="userName"
                type="text"
                name="userName"
                placeholder="사용자명을 입력하세요"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                autoComplete="username"
                autoFocus
                required
                fullWidth
                variant="outlined"
                color={userNameError ? "error" : "primary"}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="password">비밀번호</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                name="password"
                placeholder="••••••"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                fullWidth
                variant="outlined"
                color={passwordError ? "error" : "primary"}
              />
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 1, mb: 2 }}
            >
              로그인
            </Button>
          </Box>

          <Divider>또는</Divider>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <Button fullWidth variant="outlined" onClick={GoSignup}>
              회원가입
            </Button>

            <Button fullWidth variant="text" onClick={GoBack} sx={{ mt: 1 }}>
              취소
            </Button>

            <Typography sx={{ textAlign: "center", mt: 2 }}>
              계정이 없으신가요?{" "}
              <Link
                component="button"
                type="button"
                onClick={GoSignup}
                variant="body2"
                sx={{ alignSelf: "center" }}
              >
                회원가입
              </Link>
            </Typography>
          </Box>
        </Card>
      </SignInContainer>
    </>
  );
}
