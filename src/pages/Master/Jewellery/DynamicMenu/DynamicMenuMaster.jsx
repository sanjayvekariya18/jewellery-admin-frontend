import React, { useState, useEffect, useCallback } from "react";
import { API, HELPER } from "../../../../services";
import { apiConfig } from "../../../../config";
import _ from "lodash";
import { Breadcrumb, Container } from "../../../../components";
import { Box, Button, Icon, IconButton, Slider, Tooltip } from "@mui/material";
import error400cover from "../../../../assets/no-data-found-page.png";
import DynamicMenuAccordion from "./DynamicMenuAccordion";
import ThemeSwitch from "../../../../components/UI/ThemeSwitch";
import LinkUpModal from "./LinkUpModal";

const DynamicMenuMaster = () => {
  const [menus, setMenus] = useState([]);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState();
  const [linkModal, setLinkModal] = useState(false)
  const [selectedMenuItemId, setSelectedMenuItemId] = useState(null);


  /* ==================================== new Code ====================================  */

  const toggle = useCallback(() => {
    setModal(false);
  }, [modal]);
  const linkToggle = useCallback(() => {
    setLinkModal(false);
  }, [linkModal]);


  const prepareDynamicMenusTree = (oldMenus) => {
    const findChildrens = (parentId) => {
      let childs = oldMenus.filter((e) => e.parent_id == parentId);
      let newMyArray = [];
      if (childs.length > 0) {
        childs.forEach((item) => {
          newMyArray.push({
            ...item,
            childs: findChildrens(item.menu_id),
          });
        });
      }

      return _.sortBy(newMyArray, [
        function (o) {
          return o.position;
        },
      ]);
    };

    let newMenus = [];

    oldMenus
      .filter((e) => e.parent_id == null)
      .forEach((item) => {
        newMenus.push({
          ...item,
          childs: findChildrens(item.menu_id),
        });
      });

    return _.sortBy(newMenus, [
      function (o) {
        return o.position;
      },
    ]);
  };

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

  const hiddenVisibleDiamond = (Id) => {
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
                        hiddenVisibleDiamond(menuItem.id);
                      }}
                    />
                 <Button 

                  style={{ marginLeft: "10px" }}
                  variant="contained"
                  onClick={() => {
                    setSelectedMenuItemId(menuItem.url);
                    setLinkModal(true);
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
      {linkModal && (<LinkUpModal modal={linkModal} setModal={setLinkModal} toggle={linkToggle} menuId={selectedMenuItemId} callBack={loadMenus} />)}
      {/* {modal && (
          <AddDynamicMenuModal
            modal={modal}
            toggle={toggle}s
            setModal={setModal}
            callBack={loadMenus}
          />
        )} */}
    </div>
  );
};

export default DynamicMenuMaster;
