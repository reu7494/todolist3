import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { identicon } from "@dicebear/collection";
import { createAvatar } from "@dicebear/core";
import { SignOut } from "./SignOut";
import Sheet from "@mui/joy/Sheet";

//프로필 만들기

export function Profile({ user, setUser }) {
  const [avatar, setAvatar] = useState("");
  const [value, setValue] = React.useState("1");

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

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
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
            <Box sx={{ fontWeight: 500, padding: 2 }}>프로필 이미지</Box>
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
            <Box sx={{ fontWeight: 500, padding: 2 }}>닉네임</Box>
            <input
              type="text"
              disabled={true}
              value={user.userName}
              style={{ padding: "8px", width: "200px", borderRadius: "10px" }}
            />
          </Box>
        </TabPanel>
        <TabPanel value="2">
          <SignOut />
        </TabPanel>
      </TabContext>
    </Box>
  );
}
