import { memo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Avatar,
  Hidden,
  Icon,
  IconButton,
  MenuItem,
  useMediaQuery,
  Box,
  styled,
  useTheme,
} from "@mui/material";

import { MatxMenu, MatxSearchBox } from "../../../components";
import { themeShadows } from "../../../components/MatxTheme/themeColors";
import { NotificationProvider } from "../../../contexts/NotificationContext";
import useAuth from "../../../hooks/useAuth";
import useSettings from "../../../hooks/useSettings";
import { topBarHeight } from "../../../utils/constant";

import { Span } from "../../Typography";
import NotificationBar from "../../NotificationBar/NotificationBar";
import ShoppingCart from "../../ShoppingCart";
import ChangePassword from "../../../pages/Master/User/User/ChangePassword";
import { navigations } from "../../../navigations";
import { Select } from "react-select-virtualized";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

const TopbarRoot = styled("div")({
  top: 0,
  zIndex: 96,
  height: topBarHeight,
  boxShadow: themeShadows[8],
  transition: "all 0.3s ease",
});

const TopbarContainer = styled(Box)(({ theme }) => ({
  padding: "8px",
  paddingLeft: 18,
  paddingRight: 20,
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: theme.palette.primary.main,
  [theme.breakpoints.down("sm")]: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  [theme.breakpoints.down("xs")]: {
    paddingLeft: 14,
    paddingRight: 16,
  },
}));

const UserMenu = styled(Box)({
  padding: 4,
  display: "flex",
  borderRadius: 24,
  cursor: "pointer",
  alignItems: "center",
  "& span": { margin: "0 8px" },
});

const StyledItem = styled(MenuItem)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  minWidth: 185,
  "& a": {
    width: "100%",
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
  },
  "& span": { marginRight: "10px", color: theme.palette.text.primary },
}));

const IconBox = styled("div")(({ theme }) => ({
  display: "inherit",
  [theme.breakpoints.down("md")]: { display: "none !important" },
}));

const Layout1Topbar = () => {
  const theme = useTheme();
  const [selectedData, setselectedData] = useState(null);
  const navigate = useNavigate();
  const { settings, updateSettings } = useSettings();
  const { logout } = useAuth();
  const isMdScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [openTable, setOpenTable] = useState(false);
  const updateSidebarMode = (sidebarSettings) => {
    updateSettings({
      layout1Settings: { leftSidebar: { ...sidebarSettings } },
    });
  };

  const handleSidebarToggle = () => {
    let { layout1Settings } = settings;
    let mode;
    if (isMdScreen) {
      mode = layout1Settings.leftSidebar.mode === "close" ? "mobile" : "close";
    } else {
      mode = layout1Settings.leftSidebar.mode === "full" ? "close" : "full";
    }
    updateSidebarMode({ mode });
  };

  const togglePopupTable = () => {
    setOpenTable(!openTable);
  };

  // -------- Search Bar --------------------

  const _sortOptions = navigations.reduce((options, item) => {
    if (item.children && Array.isArray(item.children)) {
      options.push(
        ...item.children.map((subItem) => ({
          label: subItem.name,
          value: subItem.path,
        }))
      );
    }
    return options;
  }, []);

  // -----------handleSearchInputChange-----------
  const handleSearchInputChange = (selectedOption) => {
    if (selectedOption) {
      setselectedData(selectedOption.value);
      navigate(selectedOption.value);
    }
  };

  return (
    <TopbarRoot>
      <TopbarContainer>
        <Box display="flex">
          <StyledIconButton onClick={handleSidebarToggle}>
            <Icon>menu</Icon>
          </StyledIconButton>
          <div
            style={{ width: "340px", position: "relative", marginLeft: "20px" }}
            className="main-search-bar-select"
          >
            <span
              style={{
                fontSize: "22px",
                position: "absolute",
                right: "8px",
                top: "7px",
                zIndex: "99",
                color: "gray",
              }}
            >
              <Icon>search</Icon>
            </span>
            <Select
              placeholder="Search..."
              options={_sortOptions}
              value={_sortOptions.find(
                (option) => option.value === selectedData
              )}
              onChange={handleSearchInputChange}
              className="search-moal-header"
            ></Select>
          </div>
          {/* <IconBox>
            <StyledIconButton>
              <Icon>mail_outline</Icon>
            </StyledIconButton>

            <StyledIconButton>
              <Icon>web_asset</Icon>
            </StyledIconButton>

            <StyledIconButton>
              <Icon>star_outline</Icon>
            </StyledIconButton>
          </IconBox> */}
        </Box>

        <Box display="flex" alignItems="center">
          {/* <MatxSearchBox /> */}

          <NotificationProvider>
            <NotificationBar />
          </NotificationProvider>

          {/* <ShoppingCart /> */}

          <MatxMenu
            menuButton={
              <UserMenu>
                <Hidden xsDown>
                  {/* <Span>
                    Hi <strong>{`${user.firstName} ${user.lastName}`}</strong>
                  </Span> */}
                </Hidden>
                <Avatar
                  src="./assets/images/face-6.jpg"
                  sx={{ cursor: "pointer" }}
                />
              </UserMenu>
            }
          >
            {/* <StyledItem>
              <Link to="/">
                <Icon> home </Icon>
                <Span> Home </Span>
              </Link>
            </StyledItem> */}

            {/* <StyledItem>
              <Link to="/page-layouts/user-profile">
                <Icon> person </Icon>
                <Span> Profile </Span>
              </Link>
            </StyledItem> */}

            {/* <StyledItem>
              <Icon> settings </Icon>
              <Span> Settings </Span>
            </StyledItem> */}
            <StyledItem onClick={togglePopupTable}>
              <Icon> lock </Icon>
              <Span> Change Password </Span>
            </StyledItem>

            <StyledItem onClick={logout}>
              <Icon> power_settings_new </Icon>
              <Span> Logout </Span>
            </StyledItem>
          </MatxMenu>
        </Box>
      </TopbarContainer>

      <ChangePassword
        open={openTable}
        togglePopup={() => {
          togglePopupTable();
        }}
      />
    </TopbarRoot>
  );
};

export default memo(Layout1Topbar);
