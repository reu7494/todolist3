import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import api from "../api/axios";
import {
  Box,
  Button,
  Typography,
  Paper,
  Divider,
  Stack,
  Chip,
  TextField,
} from "@mui/material";
import {
  ArrowBack,
  Visibility,
  Person,
  CalendarToday,
} from "@mui/icons-material";

export function DetailList() {
  const [data, setData] = useState("");
  const [changeList, setChangeList] = useState([]);
  const [changeButton, setChangeButton] = useState(false);
  const { id } = useParams();

  const navigate = useNavigate();

  function goBack() {
    navigate("/");
  }

  useEffect(() => {
    async function getDetailLists() {
      try {
        const response = await axios.get(`http://localhost:4000/api/get/${id}`);
        setData(response.data);

        await axios.patch(`http://localhost:4000/api/view/${id}`);
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
      }
    }

    getDetailLists();
  }, [id]);

  async function changeNewListButotn() {
    try {
      await api.post("http://localhost:4000/api/post", {});
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Box sx={{ maxWidth: 900, margin: "0 auto", padding: 3 }}>
      {data ? (
        <Paper elevation={3} sx={{ padding: 4 }}>
          {/* 제목 */}
          <Typography variant="h4" gutterBottom fontWeight="bold">
            {data.title}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* 메타 정보 */}
          <Stack direction="row" spacing={2} sx={{ mb: 3 }} flexWrap="wrap">
            <Chip
              icon={<Person />}
              label={`작성자: ${data.usename}`}
              variant="outlined"
            />
            <Chip
              icon={<CalendarToday />}
              label={`작성일: ${data.created_at.substring(0, 10)}`}
              variant="outlined"
            />
            <Chip
              icon={<Visibility />}
              label={`조회수: ${data.views}`}
              variant="outlined"
            />
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* 내용 */}
          <Box sx={{ mt: 3, mb: 4 }}>
            {changeList ? (
              <Typography
                variant="body1"
                sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}
              >
                {data.content}
              </Typography>
            ) : (
              <TextField
                variant="body1"
                fullWidth
                multiline
                rows={6}
                value={data.content}
                onChange={(e) => setChangeList(e.target.value)}
              />
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* 버튼 */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            {changeButton ? (
              <Button
                variant="contained"
                startIcon={<ArrowBack />}
                onClick={goBack}
              >
                목록으로 돌아가기
              </Button>
            ) : (
              <Button
                variant="contained"
                startIcon={<ArrowBack />}
                onClick={changeNewListButotn}
              >
                수정
              </Button>
            )}
          </Box>
        </Paper>
      ) : (
        <Paper elevation={3} sx={{ padding: 4, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            해당 게시글을 찾을 수 없습니다.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={goBack}
            sx={{ mt: 2 }}
          >
            목록으로 돌아가기
          </Button>
        </Paper>
      )}
    </Box>
  );
}
