import React, { useEffect, useMemo, useState } from "react";

import {
  Box,
  Card,
  Grid,
  Icon,
  IconButton,
  styled,
  Tooltip,
} from "@mui/material";
import { Small } from "../../../components/Typography";
import { API, HELPER } from "../../../services";
import { apiConfig, appConfig } from "../../../config";

const StyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "24px !important",
  background: theme.palette.background.paper,
  [theme.breakpoints.down("sm")]: { padding: "16px !important" },
}));

const ContentBox = styled(Box)(({ theme }) => ({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  "& small": { color: theme.palette.text.secondary },
  "& .icon": {
    opacity: 0.6,
    fontSize: "44px",
    color: theme.palette.primary.main,
  },
}));

const Heading = styled("h6")(({ theme }) => ({
  margin: 0,
  marginTop: "4px",
  fontSize: "14px",
  fontWeight: "500",
  color: theme.palette.primary.main,
}));

const StatCards = () => {
  const [totalCustomer, setTotalCustomer] = useState(0);
  const [totalProduct, setTotalProduct] = useState(0);
  const [totalCategory, setTotalCategory] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  // const [totalDiamond, setTotalDiamond] = useState(0);

  //  Total Customer Count APi
  useEffect(() => {
    API.get(apiConfig.dashboardCustomer)
      .then((res) => {
        setTotalCustomer(res);
      })
      .catch((err) => {
        HELPER.toaster.error(err)
      });
  }, []);
  useEffect(() => {
    API.get(apiConfig.dashboardProduct)
      .then((res) => {
        setTotalProduct(res);
      })
      .catch((err) => {
        HELPER.toaster.error(err)
      });
  }, []);
  useEffect(() => {
    API.get(apiConfig.dashboardCategory)
      .then((res) => {
        setTotalCategory(res);
      })
      .catch((err) => {
        HELPER.toaster.error(err)
      });
  }, []);
  useEffect(() => {
    API.get(apiConfig.dashboardOrder)
      .then((res) => {
        setTotalOrder(res);
      })
      .catch((err) => {
        HELPER.toaster.error(err)
      });
  }, []);
  // useEffect(() => {
  //   API.get(apiConfig.diamonds, {
  //     page: 0,
  //     rowsPerPage: 1,
  //   })
  //     .then((res) => {
  //       setTotalDiamond(res.count);
  //     })
  //     .catch((err) => {
  //       HELPER.toaster.error(err)
  //     });
  // }, []);

  const cardList = [
    { name: "Total Customer", amount: totalCustomer, icon: "group" },
    { name: "Total Products", amount: totalProduct, icon: "shopping_cart" },
    { name: "Total Category", amount: totalCategory, icon: "category" },
    { name: "Total Orders", amount: totalOrder, icon: "shopping_cart" },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: "24px" }}>
      {cardList.map((item, index) => (
        <Grid item xs={12} md={3} key={index}>
          <StyledCard elevation={6} className="main-context-box">
            <ContentBox>
              <Icon className="icon">{item.icon}</Icon>
              <Box ml="15px">
                <Small fontSize="18px">{item.name}</Small>
                <Heading style={{ fontSize: "18px" }}>{item.amount}</Heading>
              </Box>
            </ContentBox>
            {/* <Tooltip title="View Details" placement="top">
              <IconButton>
                <Icon>arrow_right_alt</Icon>
              </IconButton>
            </Tooltip> */}
          </StyledCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default StatCards;
