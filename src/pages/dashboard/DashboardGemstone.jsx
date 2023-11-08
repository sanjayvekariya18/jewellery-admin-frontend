import React, { useEffect, useMemo } from "react";
import PaginationTable, {
  usePaginationTable,
} from "../../components/UI/Pagination/DashboardPaginationTable";
import { API, HELPER } from "../../services";
import { apiConfig, appConfig } from "../../config";
import error400cover from "../../assets/no-data-found-page.png";
import { Box, Card, Icon, IconButton, styled } from "@mui/material";

const GemstoneDashboard = () => {
  const COLUMNS = [
    { title: "Stock No", classNameWidth: "thead-second-width-stone" },
    { title: "Title", classNameWidth: "thead-second-width-title" },
    { title: "Price", classNameWidth: "thead-second-width-address" },
  ];

  const {
    state,
    setState,
    getInitialStates,
    changeState,
    ...otherTableActionProps
  } = usePaginationTable({});

  const paginate = (clear = false, isNewFilter = false) => {
    changeState("loader", true);
    let clearStates = {
      ...appConfig.default_pagination_state,
    };

    let newFilterState = { ...appConfig.default_pagination_state };

    // ----------Get Gemstone Api------------
    API.get(apiConfig.gemstone, {
      page: state.page,
      rowsPerPage: state.rowsPerPage,
    })
      .then((res) => {
        setState({
          ...(clear
            ? { ...getInitialStates() }
            : {
                ...state,
                ...(clear && clearStates),
                ...(isNewFilter && newFilterState),
                loader: false,
              }),
          total_items: res.count,
          data: res.rows,
        });
      })
      .catch((err) => {
        if (
          err.status === 400 ||
          err.status === 401 ||
          err.status === 409 ||
          err.status === 403
        ) {
          HELPER.toaster.error(err.errors.message);
        } else {
          console.error(err);
        }
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

  const CardHeader = styled(Box)(() => ({
    display: "flex",
    paddingLeft: "5px",
    paddingRight: "0px",
    marginBottom: "18px",
    alignItems: "center",
    justifyContent: "space-between",
  }));
  const Title = styled("span")(() => ({
    fontSize: "18px",
    fontWeight: "500",
    textTransform: "capitalize",
  }));

  // ----------Get Gemstone List Api-------------
  const rows = useMemo(() => {
    return state.data.map((item) => {
      return {
        item: item,
        columns: [
          <div className="span-permision">
            <span>{item.stockId}</span>
          </div>,
          <div className="common-thead-second-width-title">
            <span style={{ fontWeight: 500 }}>{item.title}</span>
          </div>,
          <span>{item.price}</span>,
        ],
      };
    });
  }, [state.data]);

  return (
    <>
      <Card style={{ padding: "20px 15px 10px 15px" }} sx={{ mb: 3 }}>
        <CardHeader>
          <div>
            <Title>Recent Gemstones</Title>
          </div>
          <div>
            <IconButton style={{ padding: "0px" }}>
              <Icon style={{ fontSize: "25px", color: "#207fd6" }}>
                open_in_new
              </Icon>
            </IconButton>
          </div>
        </CardHeader>
        <div>
          <PaginationTable
            header={COLUMNS}
            rows={rows}
            totalItems={state.total_items || 0}
            perPage={state.rowsPerPage}
            activePage={state.page}
            checkboxColumn={false}
            selectedRows={state.selectedRows}
            enableOrder={true}
            isLoader={state.loader}
            emptyTableImg={<img src={error400cover} width="400px" />}
            {...otherTableActionProps}
            orderBy={state.orderby}
            order={state.order}
          ></PaginationTable>
        </div>
      </Card>
    </>
  );
};

export default GemstoneDashboard;
