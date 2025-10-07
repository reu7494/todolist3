import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../api/axios";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";

// MUI 테이블 스타일링
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export function Home({ user, setUser, lists, setLists }) {
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "info",
  });
  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get("http://localhost:4000/api/get");
        setLists(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    getData();
  }, [setLists]);

  function goToLists() {
    navigate("/lists");
  }

  function goLogin() {
    navigate("/login");
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setUser({
      userName: "",
      isLoggedIn: false,
    });
    setAlert({
      show: true,
      message: "로그아웃 성공!",
      severity: "success",
    });
  }

  function goSignup() {
    navigate("/signup");
  }

  function goSignout() {
    navigate("/signout");
  }

  async function ListDelete(listId) {
    try {
      await api.delete(`http://localhost:4000/api/delete/${listId}`);
      let todolist = lists.filter((list) => list.id !== listId);
      setLists(todolist);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <Stack spacing={3} direction="column">
        <Stack spacing={2} direction="row">
          {!user.isLoggedIn ? (
            <>
              <Button variant="contained" onClick={goLogin}>
                로그인
              </Button>
              <Button variant="outlined" onClick={goSignup}>
                회원가입
              </Button>
            </>
          ) : (
            <>
              <Button variant="contained" onClick={goToLists}>
                글쓰기
              </Button>
              <Button variant="outlined" onClick={logout}>
                로그아웃
              </Button>
              <Button variant="outlined" onClick={goSignout}>
                회원탈퇴
              </Button>
            </>
          )}
        </Stack>

        <div className="outer">
          {alert.show && (
            <Alert
              severity={alert.severity}
              sx={{ mb: 2 }}
              onClose={() => setAlert({ ...alert, show: false })}
            >
              {alert.message}
            </Alert>
          )}
          <h2>일반게시판</h2>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="게시판 테이블">
              <TableHead>
                <TableRow>
                  <StyledTableCell>제목</StyledTableCell>
                  <StyledTableCell>작성자</StyledTableCell>
                  <StyledTableCell>작성일</StyledTableCell>
                  <StyledTableCell>조회수</StyledTableCell>
                  <StyledTableCell>관리</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lists &&
                  lists.map((list) => (
                    <StyledTableRow key={list.id}>
                      <StyledTableCell>
                        <Link to={`/lists/${list.id}`}>{list.title}</Link>
                      </StyledTableCell>
                      <StyledTableCell>{list.usename}</StyledTableCell>
                      <StyledTableCell>
                        {list.created_at.substring(0, 10)}
                      </StyledTableCell>
                      <StyledTableCell>{list.views || 0}</StyledTableCell>
                      <StyledTableCell>
                        {user.userName === list.usename ? (
                          <Button
                            variant="contained"
                            size="small"
                            color="error"
                            onClick={() => ListDelete(list.id)}
                          >
                            삭제
                          </Button>
                        ) : (
                          ""
                        )}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Stack>
    </div>
  );
}
