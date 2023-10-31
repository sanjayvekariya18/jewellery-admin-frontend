import React, { useEffect, useMemo, useState } from "react";
import { Box, Icon, Tooltip } from "@mui/material";
import { Breadcrumb, Container, StyledAddButton } from "../../../../components";
import { pageRoutes } from "../../../../constants/routesList";
import { API } from "../../../../services";
import { apiConfig, appConfig } from "./../../../../config";
import _ from "lodash";

import PaginationTable, {
  usePaginationTable,
} from "../../../../components/UI/Pagination/PaginationTable";
import PermissionMasterDetails from "./PermissionMasterDetails";

const PermissionsMaster = () => {
  const [openSearch, setOpenSearch] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);

  /* Pagination code */
  const COLUMNS = [{ title: "Permission Group" }, { title: "Permission Name" }];
  const { state, setState, changeState, ...otherTableActionProps } =
    usePaginationTable({
      searchTxt: "",
      isActive: "",
      order: "",
      orderby: "",
    });

  const paginate = (clear = false, isNewFilter = false) => {
    changeState("loader", true);
    let clearStates = {
      searchTxt: "",
      isActive: "",
      ...appConfig.default_pagination_state,
    };

    let filter = {
      page: state.page,
      searchTxt: state.searchTxt,
      isActive: state.isActive,
      rowsPerPage: state.rowsPerPage,
      order: state.order,
      orderBy: state.orderby,
    };

    let newFilterState = { ...appConfig.default_pagination_state };

    if (clear) {
      filter = _.merge(filter, clearStates);
    } else if (isNewFilter) {
      filter = _.merge(filter, newFilterState);
    }

    // ----------Get Blog Api------------
    API.get(apiConfig.permission, filter)
      .then((res) => {
        setState({
          ...state,
          total_items: res.count,
          data: res.rows,
          ...(clear && clearStates),
          ...(isNewFilter && newFilterState),
          loader: false,
        });
      })
      .catch(() => {
        setState({
          ...state,
          ...(clear && clearStates),
          ...(isNewFilter && newFilterState),
          loader: false,
        });
      })
      .finally(() => {
        if (openSearch == true) {
          setOpenSearch(false);
        }
      });
  };
  useEffect(() => {
    paginate();
  }, []);

  const togglePopup = () => {
    if (open) {
      setSelectedUserData(null);
    }
    setOpen(!open);
  };

  const rows = useMemo(() => {
    return state.data.map((item) => {
      return {
        item: item,
        columns: [
          <div className="span-permision">
            <span>{item.permissionGroup}</span>
          </div>,
          <div className="span-permision">
            <span className="span-permision">{item.permissionName} </span>
          </div>,
        ],
      };
    });
  }, [state.data]);
  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: "Masters", path: pageRoutes.master.user.permissions },
            { name: "User", path: pageRoutes.master.user.permissions },
            { name: "Permissions" },
          ]}
        />
      </Box>
      <PaginationTable
        header={COLUMNS}
        rows={rows}
        totalItems={state.total_items}
        perPage={state.rowsPerPage}
        activePage={state.page}
        checkboxColumn={false}
        selectedRows={state.selectedRows}
        enableOrder={true}
        isLoader={state.loader}
        {...otherTableActionProps}
        orderBy={state.orderby}
        order={state.order}
      ></PaginationTable>
      {/* <Tooltip title="Create" placement="top">
        <StyledAddButton
          color="secondary"
          aria-label="Add"
          className="button"
          onClick={togglePopup}
        >
          <Icon>add</Icon>
        </StyledAddButton>
      </Tooltip> */}
      <PermissionMasterDetails
        open={open}
        togglePopup={() => {
          togglePopup();
          paginate();
        }}
        userData={selectedUserData}
      />
    </Container>
  );
};

export default PermissionsMaster;
