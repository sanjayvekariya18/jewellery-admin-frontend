import React, { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import { Breadcrumb, Container } from "../../../../components";
import { pageRoutes } from "../../../../constants/routesList";
import { API } from "../../../../services";
import { apiConfig, appConfig } from "./../../../../config";
import _ from "lodash";
import PaginationTable, {
  usePaginationTable,
} from "../../../../components/UI/Pagination/PaginationTable";
import PermissionMasterDetails from "./PermissionMasterDetails";

const PermissionsMaster = () => {
  const [open, setOpen] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);

  /* Pagination code */
  const COLUMNS = [{ title: "Permission Group" }, { title: "Permission Name" }];
  const { state, setState, changeState, ...otherTableActionProps } =
    usePaginationTable({

    });

  const paginate = (clear = false, isNewFilter = false) => {
    changeState("loader", true);
    let clearStates = {

      ...appConfig.default_pagination_state,
    };

    let filter = {
      page: state.page,
      rowsPerPage: state.rowsPerPage,

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
      });
  };
  useEffect(() => {
    paginate();
  }, [state.page, state.rowsPerPage]);

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
            { name: "Masters", path: pageRoutes.master.user.user },
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
