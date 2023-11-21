import React, { useEffect, useState } from "react";
import {
  Box,
  Icon,
  IconButton,
  TableBody,
  TableHead,
  TableRow,
  Link,
  Card,
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
  const [loading, setLoading] = useState();

  
  const getMetalPriceData = async () => {
    setLoading(true);
    try {
      const res = await API.get(apiConfig.metalPrice);
      setState(res);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
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
    <Card style={{ margin: "40px 30px 0px 30px" }}>
      <Container>
        <Box>
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
          <div style={{ marginTop: "0px", marginLeft: "5px" }}>
            {state && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr auto",
                  gap: "6px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "flex-start",
                    border: "1px solid #3736363b",
                  }}
                >
                  <div style={{ marginRight: "10px" }}>
                    <h3
                      style={{
                        fontSize: "17px",
                        fontWeight: "500",
                        color: "#373636de",
                        padding: "9px 0px 9px 8px",
                        margin: 0,
                        maxWidth: "140px",
                      }}
                    >
                      Gold Price :
                    </h3>
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: "400",
                      }}
                    >
                      {state.gold_price}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "flex-start",
                    border: "1px solid #3736363b",
                  }}
                >
                  <div style={{ marginRight: "10px" }}>
                    <h3
                      style={{
                        fontSize: "17px",
                        fontWeight: "500",
                        color: "#373636de",
                        padding: "9px 0px 9px 8px",
                        margin: 0,
                        maxWidth: "140px",
                      }}
                    >
                      Platinum Price :
                    </h3>
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: "400",
                      }}
                    >
                      {state.platinum_price}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "flex-start",
                    border: "1px solid #3736363b",
                  }}
                >
                  <div style={{ marginRight: "10px" }}>
                    <h3
                      style={{
                        fontSize: "17px",
                        fontWeight: "500",
                        color: "#373636de",
                        padding: "9px 0px 9px 8px",
                        margin: 0,
                        maxWidth: "140px",
                      }}
                    >
                      Silver Price :
                    </h3>
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: "400",
                      }}
                    >
                      {state.silver_price}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingLeft: "10px",
                    border: "1px solid #3736363b",
                  }}
                >
                  <div onClick={(e) => handleEdit(state)}>
                    <IconButton>
                      <Icon color="primary">edit</Icon>
                    </IconButton>
                  </div>
                </div>
              </div>
            )}
            {/* <TableCell className="list-inline hstack gap-2 mb-0">
            <Link
              to="#"
              className="text-primary d-inline-block edit-item-btn"
              onClick={(e) => handleEdit(state)}
            >
              <IconButton>
                <Icon color="primary">edit</Icon>
              </IconButton>
            </Link>
          </TableCell> */}
          </div>
        </Box>

        {/* <Box width="100%" overflow="auto">
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
      </Box> */}
        <MetalPriceMasterDetails
          open={open}
          togglePopup={() => {
            togglePopup();
            getMetalPriceData();
          }}
          userData={selectedUserData}
        />
      </Container>
    </Card>
  );
};

export default MetalPriceMaster;
