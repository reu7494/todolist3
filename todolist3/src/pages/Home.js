import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import api from "../api/axios";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
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
  const navigate = useNavigate();
  const BASE_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    async function getData() {
      try {
        const response = await axios.get(`${BASE_URL}/api/get`);
        setLists(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    getData();
  }, [setLists, BASE_URL]);

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
      await api.delete(`${BASE_URL}/api/delete/${listId}`);
      let todolist = lists.filter((list) => list.id !== listId);
      setLists(todolist);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <Stack spacing={3} direction="column">
        <div>
          <div>
            <Stack
              direction="row"
              sx={{
                p: 2,
                m: 2,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box sx={{ fontSize: 24, fontWeight: "bold" }}>게시판</Box>
              {user.isLoggedIn && (
                <Button
                  variant="contained"
                  onClick={goToLists}
                  startIcon={<BorderColorOutlinedIcon />}
                >
                  글쓰기
                </Button>
              )}
            </Stack>
          </div>
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
                      <StyledTableCell>{list.username}</StyledTableCell>
                      <StyledTableCell>
                        {formatDate(list.created_at)}
                      </StyledTableCell>
                      <StyledTableCell>{list.views || 0}</StyledTableCell>
                      <StyledTableCell>
                        {user.userName === list.username ? (
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
      </Stack>
    </div>
  );
}
