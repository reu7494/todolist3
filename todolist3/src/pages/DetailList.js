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
import SaveAsIcon from "@mui/icons-material/SaveAs";

export function DetailList() {
  const [data, setData] = useState("");
  const [changeList, setChangeList] = useState([]);
  const [changeValue, setChangeValue] = useState("수정");
  const [changeBoolean, setChangeBoolean] = useState(true);
  const { id } = useParams();

  const BASE_URL = process.env.REACT_APP_API_URL;

  const navigate = useNavigate();

  function goBack() {
    navigate("/");
  }

  useEffect(() => {
    async function getDetailLists() {
      try {
        const response = await axios.get(`${BASE_URL}/api/get/${id}`);
        setData(response.data);
        setChangeList(response.data.content);

        await axios.patch(`${BASE_URL}/api/view/${id}`);
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
      }
    }

    getDetailLists();
  }, [id, BASE_URL]);

  async function changeNewListButotn() {
    if (changeBoolean === true) {
      setChangeBoolean(false);
      setChangeValue("저장");
    } else {
      try {
        const token = localStorage.getItem("token");
        await api.patch(
          `/DetailList/changeList/${id}`,
          { newContent: changeList },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setData((prev) => ({
          ...prev,
          content: changeList,
        }));

        setChangeBoolean(true);
        setChangeValue("수정");
      } catch (error) {
        console.error(error);
      }
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
            <Button
              variant="contained"
              startIcon={<SaveAsIcon />}
              onClick={changeNewListButotn}
            >
              {changeValue}
            </Button>
          </Stack>

          <Divider sx={{ my: 2 }} />

          {/* 내용 */}
          <Box sx={{ mt: 3, mb: 4 }}>
            {changeBoolean ? (
              <Typography
                variant="body1"
                sx={{ whiteSpace: "pre-wrap", lineHeight: 1.8 }}
              >
                {data.content}
              </Typography>
            ) : (
              <TextField
                variant="outlined"
                fullWidth
                multiline
                rows={6}
                value={changeList}
                onChange={(e) => setChangeList(e.target.value)}
              />
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* 버튼 */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              startIcon={<ArrowBack />}
              onClick={goBack}
            >
              목록으로 돌아가기
            </Button>
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
