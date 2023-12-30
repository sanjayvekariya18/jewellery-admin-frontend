import {
  Box,
  Grid,
  styled,
  IconButton,
  Icon,
} from "@mui/material";
import { Fragment } from "react";
import StatCards from "./shared/StatCards";
import { Breadcrumb } from "../../components";
import CustomerDashboard from "./DashboardCustomer";
import TopSellingTable from "./shared/TopSellingTable";
import RevenueChart from "./Charts/RevenueCharts";
import DeliveryStatusChart from "./Charts/DeliverdStatusCharts";
import ProfitChart from "./Charts/ProfitCharts";
import PendingShippment from "./PendingShipment";
import DateRangePicker from "../../components/UI/DatePicker";
import { useNavigate } from "react-router-dom";
import { pageRoutes } from "../../constants/routesList";

const ContentBox = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
}));

const H4 = styled("h4")(({ theme }) => ({
  fontSize: "1.1rem",
  fontWeight: "500",
  marginBottom: "0",
  marginTop: "0",
  textTransform: "capitalize",
  color: theme.palette.text.secondary,
}));

const handleDateRangeChange = (selectedDates) => {
  // Handle the selected date range in your parent component
  // console.log("Selected Date Range:", selectedDates);
};

const Analytics = () => {
  const navigate = useNavigate();

  const handleOnClick = () => {
    navigate(pageRoutes.customer);
  };

  return (
    <Fragment>
      <ContentBox className="analytics">
        <Box
          className="breadcrumb"
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0px  0px 15px 0px",
          }}
        >
          <Breadcrumb routeSegments={[{ name: "Dashboard" }]} />
          <div style={{ width: "350px" }}>
            <DateRangePicker
              placeholder="Select Date Range"
              onChange={handleDateRangeChange}
            />
          </div>
        </Box>
        <Grid container spacing={3}>
          <Grid item lg={12} md={8} sm={12} xs={12}>
            <StatCards />

            <div
            className="grid_top_customer"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginBottom: "25px",
              }}
            >
              <div>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "18px",
                      padding: "5px 5px 0 0",
                    }}
                  >
                    <div>
                      <H4>Top Customer</H4>
                    </div>
                    <div>
                      <IconButton
                        style={{ padding: "0", margin: "0" }}
                        onClick={() => handleOnClick()}
                      >
                        <Icon style={{ padding: "0", margin: "0" }}>
                          open_in_new
                        </Icon>
                      </IconButton>
                    </div>
                  </div>
                  <CustomerDashboard />
                </Grid>
              </div>
              <TopSellingTable />
              
            </div>

            <div
            className="chart-container"
              style={{
                display: "grid",
                gridTemplateColumns: "59% 39.50%",
                gap: "20px",
              }}
            >
              <RevenueChart />
              <DeliveryStatusChart />
            
            </div>
            <div>
              <PendingShippment />
            </div>
            <div
            className="profit_chart"
              style={{
                display: "grid",
                gridTemplateColumns: "70%",
                gap: "20px",
              }}
            >
            
              <ProfitChart />
            </div>
          </Grid>
        </Grid>
      </ContentBox>
    </Fragment>
  );
};

export default Analytics;
