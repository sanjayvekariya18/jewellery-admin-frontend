import React, { useEffect, useMemo, useState } from "react";
import error400cover from "../../assets/no-data-found-page.png";
import PaginationTable, {
  usePaginationTable,
} from "../../components/UI/Pagination/PaginationTable";
import { API, HELPER } from "../../services";
import { apiConfig } from "../../config";
import _ from "lodash";
import { useParams } from "react-router-dom";
import { Breadcrumb, Container } from "../../components";
import { Box, IconButton, Icon } from "@mui/material";
import { pageRoutes } from "../../constants/routesList";
import { useNavigate } from "react-router-dom/dist";

const FindProductVariant = () => {
  const { productId } = useParams();
  const { state, setState, changeState, ...otherTableActionProps } =
    usePaginationTable();
  const navigate = useNavigate();

  let filter = {
    page: state.page,
    isActive: state.isActive,
    rowsPerPage: state.rowsPerPage,
  };

  const paginate = (clear = false, isNewFilter = false) => {
    changeState("loader", true);
  };
  useEffect(() => {
    API.get(apiConfig.findProduct.replace(":productId", productId), filter)
      .then((res) => {
        setState({
          ...state,
          total_items: res.count,
          data: res.rows,
          loader: false,
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
      });
  }, []);

  const COLUMNS = [
    { title: "Index" },
    { title: "Title", classNameWidth: "common-width-apply-th" },
    { title: "Total Carat" },
    { title: "Metal Weight" },
    { title: "Metal Price" },
    { title: "Making Price" },
    { title: "Diamond Price" },
    { title: "Total Price" },
    { title: "Action" },
  ];

  const rows = useMemo(() => {
    return state.data.map((item, i) => {
      return {
        item: item,
        columns: [
          <span>{i + 1}</span>,
          <div className="common-width-three-dot-text span-permision">
            <span>{item.title}</span>
          </div>,
          <span>{item.totalCarat}</span>,
          <span>{item.makingPrice}</span>,
          <span>{item.metalWeight}</span>,
          <span>{item.metalPrice}</span>,
          <span>{item.diamondPrice}</span>,
          <span>{item.totalPrice}</span>,
          <div>
            <IconButton onClick={(e) => handleButtonClick(item.id)}>
              <Icon color="error">remove_red_eye</Icon>
            </IconButton>
          </div>,
        ],
      };
    });
  }, [state.data]);

  useEffect(() => {
    paginate();
  }, []);

  const handleButtonClick = (id) => {
    navigate(`${pageRoutes.productVariantId}/${id}`);
  };
  return (
    <div>
      <Container>
        <Box
          className="breadcrumb"
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Breadcrumb
            routeSegments={[
              { name: "Masters", path: pageRoutes.diamond },
              { name: "Product", path: pageRoutes.product },
              { name: "Product Variant" },
            ]}
          />
        </Box>
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
      </Container>
    </div>
  );
};

export default FindProductVariant;
