import React, { useEffect, useMemo } from "react";
import PaginationTable, {
  usePaginationTable,
} from "../../components/UI/Pagination/DashboardPaginationTable";
import { API, HELPER } from "../../services";
import { apiConfig, appConfig } from "../../config";
import error400cover from "../../assets/no-data-found-page.png";
import {
  Box,
  Card,
  styled,
  Select,
  MenuItem,
} from "@mui/material";

const ProductDashboard = () => {
  const COLUMNS = [
    { title: "Stock No", classNameWidth: "thead-second-width-stock-no" },
    { title: "Product Name", classNameWidth: "common-width-apply-th" },
    { title: "SubCategory", classNameWidth: "thead-second-width-stock-no" },
    { title: "Profit", classNameWidth: "thead-second-width-action-index" },
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
    API.get(apiConfig.product, {
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
          HELPER.toaster.error(err)
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
  }, [state.page, state.rowsPerPage, paginate]);

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
          <span>{item.productName}</span>,
          <span>{item.subCategoryName}</span>,
          <span>{item.profit}</span>,
        ],
      };
    });
  }, [state.data]);

  return (
    <>
      <Card style={{ padding: "20px 15px 10px 15px" }} sx={{ mb: 3 }}>
        <CardHeader>
          <div>
            <Title>Top Selling Products</Title>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* <IconButton style={{ padding: "0px" }}>
              <Icon style={{ fontSize: "25px", color: "#207fd6" }}>
                open_in_new
              </Icon>
            </IconButton> */}
            <Box className="breadcrumb" style={{ paddingLeft: "20px" }}>
              <Select size="small" defaultValue="this_month">
                <MenuItem value="this_month">This Month</MenuItem>
                <MenuItem value="last_month">Last Month</MenuItem>
              </Select>
            </Box>
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

export default ProductDashboard;
