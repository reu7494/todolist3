import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { createAvatar } from "@dicebear/core";
import { identicon } from "@dicebear/collection";

const pages = [""];
const settings = ["사용자 페이지", "로그아웃"];

export function ResponsiveAppBar({ user, setUser }) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [avatar, setAvatar] = useState("");

  const userProfile = user.id;

  useEffect(() => {
    const avatarDataUri = createAvatar(identicon, {
      seed: userProfile || "default",
      size: 28,
    }).toDataUri();

    setAvatar(avatarDataUri);
  }, [userProfile]);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const navigate = useNavigate();

  function goHome() {
    navigate("/");
  }

  function goLogin() {
    navigate("/login");
  }

  async function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setUser({
      userName: "",
      isLoggedIn: false,
    });
  }

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <FormatListBulletedIcon
            sx={{
              display: "flex",
              mr: 1,
              cursor: "pointer",
              "&:hover": {
                opacity: 0.7,
              },
            }}
            onClick={goHome}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            일반게시판
          </Typography>

          <Box sx={{ flexGrow: 1, display: "flex" }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            {!user.isLoggedIn ? (
              <Button variant="contained" onClick={goLogin}>
                로그인
              </Button>
            ) : (
              <div>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    {avatar && <img src={avatar} alt="Profile Avatar" />}
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting}
                      onClick={() => {
                        handleCloseUserMenu();
                        if (setting === "사용자 페이지") navigate("/profile");
                        else if (setting === "로그아웃") {
                          logout();
                          navigate("/");
                        }
                      }}
                    >
                      <Typography sx={{ textAlign: "center" }}>
                        {setting}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </div>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
