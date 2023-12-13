import React, { useState, useEffect, useCallback } from "react";
import { API, HELPER } from "../../../../services";
import { apiConfig } from "../../../../config";
import _ from "lodash";
import { Breadcrumb, Container } from "../../../../components";
import { Box, Button } from "@mui/material";
import ThemeSwitch from "../../../../components/UI/ThemeSwitch";
import LinkUpModal from "./LinkUpModal";

const DynamicMenuMaster = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState();
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [open, setOpen] = useState(false);
  const [linkModal, setLinkModal] = useState(false)
  const [selectedMenuItemId, setSelectedMenuItemId] = useState(null);


  /* ==================================== new Code ====================================  */


  // const linkToggle = useCallback(() => {
  //   setLinkModal(false);
  // }, [linkModal]);


  const togglePopup = () => {
    if (open) {
      setSelectedUserData(null);
    }
    setOpen(!open);
  };
  // dynamicMenuList                                                      
  const loadMenus = () => {
    API.get(apiConfig.dynamicMenuList)
      .then((res) => {
        setMenus(res);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    loadMenus();
  }, []);

  // hiddenVisibleMenu visibility on or off
  const hiddenVisibleMenu = (Id) => {
    API.put(apiConfig.visibility_menu.replace(":id", Id)).then((res) => {
      HELPER.toaster.success(res.message);
      setLoading(false);
      loadMenus();
    });
  };

  document.title = "Dynamic Menu Page List ";

  return (
    <div className="page-content">
      <Container>
        <Box
          className="breadcrumb"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Breadcrumb
            routeSegments={[
              // { name: "Masters", path: pageRoutes.master.user.user },
              { name: "Dynamic Menu" }]}
          />
        </Box>
        <Box>
          <div>
            {menus.map((menuItem, index) => {
              return (
                <div key={index} className="menu" >
                  <h3>{menuItem.name}</h3>
                  <div>
                    <ThemeSwitch
                      checked={menuItem.isVisible}
                      color="warning"
                      onChange={() => {
                        hiddenVisibleMenu(menuItem.id);
                      }}
                    />
                    <Button

                      style={{ marginLeft: "10px" }}
                      variant="contained"
                      onClick={() => {
                        togglePopup();
                        setSelectedMenuItemId(menuItem.url);
                      }}
                    >
                      Link Up
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </Box>
      </Container>
      {/* Link up model ni model open */}
      {open &&
        (<LinkUpModal
          open={open}
          setModal={setLinkModal}
          // toggle={linkToggle}
          togglePopup={() => {
            togglePopup();
            // paginate();
          }}
          userData={selectedUserData}
          menuId={selectedMenuItemId}
          // callBack={loadMenus} 
          />
        )}
    </div>
  );
};

export default DynamicMenuMaster;
