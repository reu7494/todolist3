import * as React from "react";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useState, useEffect } from "react";
import { identicon } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { SignOut } from "./SignOut";
import Sheet from "@mui/joy/Sheet";
import { Box, Button } from "@mui/material";
import SaveAsIcon from "@mui/icons-material/SaveAs";
import api from "../api/axios";

export function Profile({ user, setUser }) {
  const [avatar, setAvatar] = useState("");
  const [value, setValue] = React.useState("1");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("확인");
  const BASE_URL = process.env.REACT_APP_API_URL;

  const userProfile = user.userName;

  useEffect(() => {
    const avatarDataUri = createAvatar(identicon, {
      seed: userProfile || "default",
      size: 150,
    }).toDataUri();

    setAvatar(avatarDataUri);
  }, [userProfile]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  async function ChangePassword() {
    try {
      const token = localStorage.getItem("token");
      const response = await api.patch(
        `${BASE_URL}/api/ChangePassword`,
        {
          userName: userProfile,
          oldPassword: oldPassword,
          newPassword: newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data) {
        setMessage("실패");
        setOldPassword("");
        setNewPassword("");
      } else {
        setMessage("성공");
      }
    } catch (error) {
      console.error("에러 응답:", error.response?.data);
      setMessage("서버 연결 실패");
    }
  }

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ p: 2, m: 2, fontSize: 24, fontWeight: "bold" }}>설정</Box>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="프로필" value="1" />
            <Tab label="계정" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <Box
            sx={{
              display: "flex",
              alignItems: "top",
              gap: 2,
              marginBottom: 2,
            }}
          >
            <Box sx={{ fontWeight: 500, padding: 2 }}>프로필 이미지:</Box>
            {avatar && (
              <Sheet color="neutral" variant="soft">
                <img
                  src={avatar}
                  alt="Profile Avatar"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Sheet>
            )}
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", padding: "8px" }}>
            <Box sx={{ fontWeight: 500, padding: 2 }}>닉네임:</Box>
            <input
              type="text"
              disabled={true}
              value={user.userName}
              style={{ padding: "8px", width: "200px", borderRadius: "10px" }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "8px",
              gap: 1,
            }}
          >
            <Box sx={{ fontWeight: 500, padding: 2 }}>비밀번호 변경:</Box>
            <input
              label="비밀번호"
              type="password"
              style={{ padding: "8px", width: "200px", borderRadius: "10px" }}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="기존 비밀번호를 입력하세요"
            />

            <input
              label="비밀번호"
              type="password"
              style={{ padding: "8px", width: "200px", borderRadius: "10px" }}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="변경할 비밀번호를 입력하세요"
            />
            <Button
              variant="outlined"
              startIcon={<SaveAsIcon />}
              disabled={!oldPassword || !newPassword}
              onClick={ChangePassword}
            >
              {message}
            </Button>
          </Box>
        </TabPanel>
        <TabPanel value="2">
          <SignOut user={user} setUser={setUser} />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
