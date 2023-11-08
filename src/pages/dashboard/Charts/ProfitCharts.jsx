import React from "react";
import ReactApexChart from "react-apexcharts";
import { Box, Card, styled } from "@mui/material";

const ProfitChart = () => {
  const options = {
    chart: {
      id: "profit-chart",
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 350,
        },
      },
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
        text: "Profit (USD)",
      },
    },
    stroke: {
      curve: "smooth",
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      borderColor: "#e7e7e7",
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
    colors: ["#4caf50"],
  };

  const series = [
    {
      name: "Profit",
      data: [
        1200, 1400, 1300, 1500, 1600, 1800, 1900, 2000, 2200, 2300, 2400, 2500,
      ],
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
            <Title>Profit</Title>
          </div>
        </CardHeader>
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={350}
        />
      </Card>
    </div>
  );
};

export default ProfitChart;
