import React from "react";
import ReactApexChart from "react-apexcharts";
import {
  Box,
  Card,
  Icon,
  IconButton,
  styled,
  Select,
  MenuItem,
} from "@mui/material";

const RevenueChart = () => {
  const options = {
    chart: {
      type: "line",
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    },
    yaxis: {
      title: {
        text: "Revenue (USD)",
      },
    },
  };

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

  const series = [
    {
      name: "Revenue",
      data: [
        1200, 1400, 1300, 1500, 1600, 1800, 1900, 2000, 2200, 2300, 2400, 2500,
      ],
    },
  ];

  return (
    <div>
      <Card style={{ padding: "20px 15px 10px 15px" }} sx={{ mb: 3 }}>
        <CardHeader>
          <div>
            <Title>Sales Order Summery</Title>
          </div>
        </CardHeader>
        <ReactApexChart
          options={options}
          series={series}
          type="line"
          height={350}
        />
      </Card>
    </div>
  );
};

export default RevenueChart;
