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
import dayjs from "dayjs";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import { ResponsiveAppBar } from ".//ResponsiveAppBar";
import { Profile } from "./Profile";

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

//새로 useState 만든 후 프로필 설정 클릭 시 유저명 읽어오지를 못함
//Profile.js:20 Uncaught TypeError: Cannot read properties of undefined (reading 'userName')

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export function Home({ user, setUser, lists, setLists, click, setClick }) {
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

  function formatDate(dateString) {
    if (!dateString) return "날짜 없음";
    try {
      return dayjs(dateString).format("YYYY-MM-DD");
    } catch (error) {
      return "날짜 오류";
    }
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
        <ResponsiveAppBar
          user={user}
          setUser={setUser}
          click={click}
          setClick={setClick}
        />
        {!click ? (
          <div>
            <Stack
              spacing={2}
              direction="row"
              sx={{ justifyContent: "flex-end" }}
            >
              {!user.isLoggedIn ? (
                ""
              ) : (
                <>
                  <Button
                    variant="contained"
                    onClick={goToLists}
                    startIcon={<BorderColorOutlinedIcon />}
                  >
                    글쓰기
                  </Button>
                </>
              )}
            </Stack>

            <div className="outer">
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
                    {lists.map((list) => (
                      <StyledTableRow key={list.id}>
                        <StyledTableCell>
                          <Link to={`/lists/${list.id}`}>{list.title}</Link>
                        </StyledTableCell>
                        <StyledTableCell>{list.usename}</StyledTableCell>
                        <StyledTableCell>
                          {formatDate(list.created_at)}
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
          </div>
        ) : (
          <Profile />
        )}
      </Stack>
    </div>
  );
}
