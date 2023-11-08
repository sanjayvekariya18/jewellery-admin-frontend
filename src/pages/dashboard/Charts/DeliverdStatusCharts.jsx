import React from "react";
import ReactApexChart from "react-apexcharts";
import { Box, Card, styled } from "@mui/material";

const DeliveryStatusChart = () => {
  const options = {
    chart: {
      type: "bar",
    },
    xaxis: {
      categories: ["Delivered", "In Transit", "Pending", "Cancelled"],
    },
    yaxis: {
      title: {
        text: "Number of Orders",
      },
    },
  };

  const series = [
    {
      name: "Delivery Status",
      data: [350, 100, 50, 20],
    },
  ];

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

  return (
    <div>
      <Card style={{ padding: "20px 15px 10px 15px" }} sx={{ mb: 3 }}>
        <CardHeader>
          <div>
            <Title>Delivery Status</Title>
          </div>
        </CardHeader>
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={350}
        />
      </Card>
    </div>
  );
};

export default DeliveryStatusChart;
