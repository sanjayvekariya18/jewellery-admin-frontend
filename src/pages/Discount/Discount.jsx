import React, { useEffect, useMemo, useState } from "react";
import { Box, Icon, IconButton } from "@mui/material";
import { Breadcrumb, Container } from "../../components";
import error400cover from "../../assets/no-data-found-page.png";
import PaginationTable, {
  usePaginationTable,
} from "../../components/UI/Pagination/PaginationTable";
import { API } from "../../services";
import { apiConfig, appConfig } from "../../config";
import DiscountDetails from "./DiscountDetails";
import { pageRoutes } from "../../constants/routesList";
import _ from "lodash";
const Discount = () => {
  const [open, setOpen] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [loading, setLoading] = useState();

  // columns define
  const COLUMNS = [
    { title: "High Size" },
    { title: "Low Size" },
    { title: "Natural" },
    { title: "Lab Grown" },
    { title: "Action", classNameWidth: "thead-second-width-action-index" },
  ];

  const { state, setState, changeState, ...otherTableActionProps } =
    usePaginationTable({
      isActive: "",
      order: "",
      orderby: "",
    });

  // paginate code define
  const paginate = (clear = false, isNewFilter = false) => {
    changeState("loader", true);
    let clearStates = {
      isActive: "",
      ...appConfig.default_pagination_state,
    };

    let filter = {
      page: state.page,
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
    setLoading(true);
    API.get(apiConfig.diamondDiscount)
      .then((res) => {
        setLoading(false);
        setState({
          ...state,
          total_items: res.count,
          data: res,
          ...(clear && clearStates),
          ...(isNewFilter && newFilterState),
          loader: false,
        });
      })
      .catch(() => {
        setLoading(false);
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

  const rows = useMemo(() => {
    return state.data.map((item) => {
      return {
        item: item,
        columns: [
          <span>{item.highSize}</span>,
          <span>{item.lowSize}</span>,
          <span>{item.discount}</span>,
          <span>{item.labDiscount}</span>,
          <div>
            <IconButton onClick={(e) => handleEdit(item)}>
              <Icon color="primary">create</Icon>
            </IconButton>
          </div>,
        ],
      };
    });
  }, [state.data]);
  /* Pagination code */

  const togglePopup = () => {
    if (open) {
      setSelectedUserData(null);
    }
    setOpen(!open);
  };

  // handleEdit define in a edit data
  const handleEdit = (data) => {
    setSelectedUserData(data);
    setOpen(true);
  };

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: "Masters", path: pageRoutes.master.user.user },
            { name: "Discount" },
          ]}
        />
      </Box>
      {/* PaginationTable code define */}
      <PaginationTable
        header={COLUMNS}
        rows={rows}
        totalItems={state.total_items || 0}
        perPage={state.rowsPerPage}
        activePage={state.page}
        checkboxColumn={false}
        selectedRows={state.selectedRows}
        enableOrder={true}
        isLoader={loading}
        emptyTableImg={<img src={error400cover} width="350px" />}
        {...otherTableActionProps}
        orderBy={state.orderby}
        order={state.order}
        footerVisibility={false}
      ></PaginationTable>

      {/* DiscountDetails model open */}
      <DiscountDetails
        open={open}
        togglePopup={() => {
          togglePopup();
          // paginate();
        }}
        userData={selectedUserData}
        callBack={() => paginate(true)}
      />
    </Container>
  );
};

export default Discount;
