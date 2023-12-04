import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Icon,
  IconButton,
  MenuItem,
  useMediaQuery,
  Box,
  styled,
  useTheme,
} from "@mui/material";

import { MatxMenu } from "../../../components";
import { themeShadows } from "../../../components/MatxTheme/themeColors";
import useAuth from "../../../hooks/useAuth";
import useSettings from "../../../hooks/useSettings";
import { topBarHeight } from "../../../utils/constant";

import { Span } from "../../Typography";
import { navigations } from "../../../navigations";
import { Select } from "react-select-virtualized";
import ChangePassword from "../../../pages/Master/User/User/ChangePassword";
import { HELPER } from "../../../services";
import NotificationBar from "../../NotificationBar/NotificationBar";

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
  const { user, logout } = useAuth();
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

  const handleLogout = () => {
    logout();
    // window.localStorage.removeItem(appConfig.localStorage.token);
  };

  // -------- Search Bar --------------------

  const filterOptions = (options) => {
    return options.filter(
      (option) => option.label !== undefined && option.value !== undefined
    );
  };
  const flattenNavigations = (navigations) => {
    const flattenedOptions = [];

    navigations.forEach((option) => {
      flattenedOptions.push({
        label: option.name,
        value: option.path,
      });

      if (option.children) {
        option.children.forEach((child) => {
          flattenedOptions.push({
            label: child.name,
            value: child.path,
          });
        });
      }
    });

    return flattenedOptions;
  };

  const _sortOptions1 = flattenNavigations(navigations);
  const _filteredSortOptions = filterOptions(_sortOptions1);

  // -----------handleSearchInputChange-----------
  const handleSearchInputChange = (selectedOption) => {
    if (selectedOption) {
      setselectedData(selectedOption.value);
      navigate(selectedOption.value);
    }
  };

  return (
    <>
      <TopbarRoot>
        <TopbarContainer style={{ marginRight: "10px" }}>
          <Box display="flex">
            <StyledIconButton onClick={handleSidebarToggle}>
              <Icon>menu</Icon>
            </StyledIconButton>
            <div
              style={{
                width: "340px",
                position: "relative",
                marginLeft: "20px",
              }}
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
                options={_filteredSortOptions}
                value={_filteredSortOptions.find(
                  (option) => option.value === selectedData
                )}
                onChange={handleSearchInputChange}
                className="search-moal-header"
              ></Select>
            </div>
          </Box>

          <Box display="flex" alignItems="center">
            {/* <NotificationProvider> */}
            <NotificationBar />
          {/* </NotificationProvider> */}
            <MatxMenu
              menuButton={
                <div
                  className="main-active-button-menu"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <UserMenu>
                    <Avatar
                      src={
                        user && user.image
                          ? HELPER.getImageUrl(user.image)
                          : "./assets/images/face-6.jpg"
                      }
                      sx={{ cursor: "pointer", width: "40px", height: "40px" }}
                    />
                  </UserMenu>
                  <div className="user-info user-name-div">
                    {user && user.firstName && user.lastName && (
                      <span className="first-name-span">{`${user.firstName} ${user.lastName}`}</span>
                    )}
                    {user && user.userRole && (
                      <span className="user-role-span">{user.userRole}</span>
                    )}
                  </div>
                </div>
              }
            >
              <StyledItem onClick={togglePopupTable}>
                <Icon> lock </Icon>
                <Span> Change Password </Span>
              </StyledItem>

              <StyledItem onClick={handleLogout}>
                <Icon> power_settings_new </Icon>
                <Span> Logout </Span>
              </StyledItem>
            </MatxMenu>
          </Box>
        </TopbarContainer>
      </TopbarRoot>

      {openTable && (
        <ChangePassword open={openTable} togglePopup={togglePopupTable} />
      )}
    </>
  );
};

export default memo(Layout1Topbar);
