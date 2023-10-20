import React, { useEffect, useState } from "react";
import {
  Box,
  Icon,
  IconButton,
  TableBody,
  TableHead,
  TableRow,
  Link,
  TableCell,
  TableSortLabel,
} from "@mui/material";
import { Breadcrumb, Container, StyledTable } from "../../../../components";
import { pageRoutes } from "../../../../constants/routesList";
import { API } from "../../../../services";
import { apiConfig } from "./../../../../config";
import MetalPriceMasterDetails from "./MetalPriceMasterDetails";

const MetalPriceMaster = () => {
  const [open, setOpen] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [state, setState] = useState([]);

  const getMetalPriceData = async () => {
    try {
      const res = await API.get(apiConfig.metalPrice);
      setState(res);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getMetalPriceData();
  }, []);

  const togglePopup = () => {
    if (open) {
      setSelectedUserData(null);
    }
    setOpen(!open);
  };

  const handleEdit = (data) => {
    setSelectedUserData(data);
    setOpen(true);
  };

  return (
    <Container>
      <Box
        className="breadcrumb"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Breadcrumb
          routeSegments={[
            { name: "Masters", path: pageRoutes.master.user.user },
            { name: "Metal Price" },
          ]}
        />
      </Box>
      <Box width="100%" overflow="auto">
        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "65vw",
                }}
              >
                <TableSortLabel scope="col">Gold Price</TableSortLabel>
                <TableSortLabel scope="col">Platinum Price</TableSortLabel>
                <TableSortLabel scope="col">Silver Price</TableSortLabel>
                <TableSortLabel scope="col">Action</TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{state.gold_price}</TableCell>
              <TableCell>{state.platinum_price}</TableCell>
              <TableCell>{state.silver_price}</TableCell>
              <TableCell className="list-inline hstack gap-2 mb-0">
                <Link
                  to="#"
                  className="text-primary d-inline-block edit-item-btn"
                  onClick={(e) => handleEdit(state)}
                >
                  <IconButton>
                    <Icon color="primary">edit</Icon>
                  </IconButton>
                </Link>
              </TableCell>
            </TableRow>
          </TableBody>
        </StyledTable>
      </Box>
      <MetalPriceMasterDetails
        open={open}
        togglePopup={() => {
          togglePopup();
          getMetalPriceData();
        }}
        userData={selectedUserData}
      />
    </Container>
  );
};

export default MetalPriceMaster;
