import {
  Box,
  Grid,
  MenuItem,
  styled,
  Select,
  Card,
  IconButton,
  Icon,
} from "@mui/material";
import { Fragment } from "react";
import StatCards from "./shared/StatCards";
import { Breadcrumb } from "../../components";
import GemstoneDashboard from "./DashboardGemstone";
import DiamondDashboard from "./DashboardDiamond";
import CategoryDashboard from "./DashboardCategory";
import CustomerDashboard from "./DashboardCustomer";
import RowCards from "./shared/RowCards";
import TopSellingTable from "./shared/TopSellingTable";
import RevenueChart from "./Charts/RevenueCharts";
import DoughnutChart from "./shared/Doughnut";
import { useTheme } from "@emotion/react";
import DeliveryStatusChart from "./Charts/DeliverdStatusCharts";
import ProfitChart from "./Charts/ProfitCharts";
import PendingShippment from "./PendingShipment";
import DateRangePicker from "../../components/UI/DatePicker";
import { useNavigate } from "react-router-dom";
import { pageRoutes } from "../../constants/routesList";
import ProductDashboard from "./DashboardProduct";

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
  const { palette } = useTheme();
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
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginBottom: "25px",
              }}
            >
              {/* <div style={{ width: "40%" }}> */}
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
                  {/* <RowCards /> */}
                  <CustomerDashboard />
                </Grid>
              </div>
              {/* <CustomerDashboard /> */}
              {/* </div> */}
              {/* <div style={{ width: "60%" }}> */}
              <TopSellingTable />
              {/* <SalesChart /> */}
              {/* </div> */}
              {/* <ProductDashboard /> */}
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "59% 39.50%",
                gap: "20px",
              }}
            >
              {/* <CategoryDashboard /> */}
              <RevenueChart />
              <DeliveryStatusChart />
              {/* <Card sx={{ px: 3, py: 2, mb: 3 }}>
                <Title style={{ marginRight: "30px" }}>Total Orders</Title>
                <SubTitle>Last 30 days</SubTitle>

                <DoughnutChart
                  height="300px"
                  color={[
                    palette.primary.dark,
                    palette.primary.main,
                    palette.primary.light,
                  ]}
                />
              </Card> */}

              {/* <ColoredDiamondDashboard /> */}
              {/* <CategoryDashboard /> */}
            </div>
            <div>
              <PendingShippment />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "70%",
                gap: "20px",
              }}
            >
              {/* <Card sx={{ px: 3, py: 2, mb: 3 }}>
                <Title style={{ marginRight: "30px" }}>
                  Top Traffic Source
                </Title>
                <DoughnutChart
                  height="300px"
                  color={[
                    palette.primary.dark,
                    palette.primary.main,
                    palette.primary.light,
                  ]}
                />
              </Card> */}
              <ProfitChart />
              {/* <DiamondDashboard /> */}
            </div>
          </Grid>

          {/* <Grid item lg={4} md={4} sm={12} xs={12}>
            <Card sx={{ px: 3, py: 2, mb: 3 }}>
              <Title>Traffic Sources</Title>
              <SubTitle>Last 30 days</SubTitle>

              <DoughnutChart
                height="300px"
                color={[
                  palette.primary.dark,
                  palette.primary.main,
                  palette.primary.light,
                ]}
              />
            </Card>

            <UpgradeCard />
            <Campaigns />
          </Grid> */}
        </Grid>
      </ContentBox>
    </Fragment>
  );
};

export default Analytics;
