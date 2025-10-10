import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Box, Button, TextField, Typography, Stack } from "@mui/material";

export function Lists({ user, setUser, setLists }) {
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    severity: "info",
  });

  const navigate = useNavigate();

  function GotoHome() {
    navigate("/");
  }

  async function ListsInput() {
    if (title.trim() === "" || contents.trim() === "") return; // 공백 입력 안됨

    try {
      const respones = await api.post("http://localhost:4000/api/post", {
        title: title,
        usename: user.userName,
        content: contents,
      }); //전달값에 undefined있음

      setLists((prev) => [...prev, respones]); // 기존 목록에 추가
      setTitle("");
      setContents(""); //입력 초기화
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Box sx={{ maxWidth: 800, margin: "0 auto", padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        작성
      </Typography>

      <Stack spacing={3}>
        {/* 제목 */}
        <TextField
          label="제목"
          variant="outlined"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* 글내용 */}
        <TextField
          label="글내용"
          variant="outlined"
          fullWidth
          multiline
          rows={6}
          value={contents}
          onChange={(e) => setContents(e.target.value)}
        />

        {/* 버튼 */}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={GotoHome}>
            취소
          </Button>
          <Button variant="contained" onClick={ListsInput}>
            게시하기
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
