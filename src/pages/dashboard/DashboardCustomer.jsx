import React, { Fragment, useCallback, useEffect, useMemo } from "react";
import PaginationTable, {
  usePaginationTable,
} from "../../components/UI/Pagination/DashboardPaginationTable";
import { API, HELPER } from "../../services";
import { apiConfig, appConfig } from "../../config";
import error400cover from "../../assets/no-data-found-page.png";
import { Box, Card, Grid, TablePagination } from "@mui/material";

const CustomerDashboard = () => {
  const { state, setState, getInitialStates, changeState } = usePaginationTable(
    {}
  );

  // Function to fetch and paginate customer data
  const paginate = (clear = false, isNewFilter = false) => {
    changeState("loader", true);
    let clearStates = {
      ...appConfig.default_pagination_state,
    };

    let newFilterState = { ...appConfig.default_pagination_state };

    // Fetch customer data from an API
    API.get(apiConfig.customer, {
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

  // Use useEffect to fetch data when page or rowsPerPage change
  useEffect(() => {
    paginate();
  }, [state.page, state.rowsPerPage]);

  // Function to render each customer card
  const renderCustomerCard = (item, id) => (
    <Fragment key={id}>
      <Card className="project-card" style={{ padding: "16px 40px 16px 20px" }}>
        <Grid container alignItems="center">
          <Grid item md={3} xs={7}>
            <Box display="flex" alignItems="center">
              <span>{item.firstName + " " + item.lastName}</span>
            </Box>
          </Grid>
          <Grid item md={4} xs={4}>
            <span>{item.email}</span>
          </Grid>
          <Grid item md={2} xs={4}>
            <span>{item.telephone}</span>
          </Grid>
          <Grid item md={2} xs={4}>
            <span>{item.country}</span>
          </Grid>
          <Grid item md={1} xs={4}>
            <span>{item.pincode}</span>
          </Grid>
        </Grid>
      </Card>
      <Box py={1} />
    </Fragment>
  );

  const TableHeader = () => (
    <Card
      className="project-card"
      style={{
        marginBottom: "10px",
        border: "1px solid #6b6b6b26",
        padding: "15px 40px 15px 20px",
      }}
    >
      <Grid container alignItems="center">
        <Grid item md={3} xs={7}>
          <span className="dashboard-customer-span">Name</span>
        </Grid>
        <Grid item md={4} xs={4}>
          <span className="dashboard-customer-span">Email</span>
        </Grid>
        <Grid item md={2} xs={4}>
          <span className="dashboard-customer-span">Phone</span>
        </Grid>
        <Grid item md={2} xs={4}>
          <span className="dashboard-customer-span">Country</span>
        </Grid>
        <Grid item md={1} xs={4}>
          <span className="dashboard-customer-span">Pincode</span>
        </Grid>
      </Grid>
    </Card>
  );

  const changeActivePage = useCallback(
    (value) => {
      changeState("page", value);
    },
    [changeState]
  );

  // Map the data to rows using useMemo
  const rows = useMemo(() => {
    return state.data.map((item, id) => renderCustomerCard(item, id));
  }, [state.data]);

  const renderContent = () => {
    return state.data.length === 0 ? (
      <Box textAlign="center" mt={4}>
        <img src={error400cover} width="350px" />
      </Box>
    ) : (
      <>
        <TableHeader />
        {rows}
        <TablePagination
          component="div"
          count={state.total_items || 0}
          page={state.page}
          labelRowsPerPage={false}
          rowsPerPage={state.rowsPerPage}
          rowsPerPageOptions={[]}
          onPageChange={(_, pageNumber) => changeActivePage(pageNumber)}
        />
      </>
    );
  };
  return (
    <>
      <div>{renderContent()}</div>
    </>
  );
};

export default CustomerDashboard;
