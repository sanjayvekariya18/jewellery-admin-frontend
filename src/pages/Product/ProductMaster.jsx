import React, {  useMemo, useState } from "react";
import { Box, Button, Icon, IconButton } from "@mui/material";
import error400cover from "../../assets/no-data-found-page.png";
import _ from "lodash";
import { API, HELPER } from "../../services";
import { apiConfig, appConfig } from "../../config";
import PaginationTable, {
  usePaginationTable,
} from "../../components/UI/Pagination/PaginationTable";
import useDidMountEffect from "../../hooks/useDidMountEffect";
import { Breadcrumb, Container } from "../../components";
import { pageRoutes } from "../../constants/routesList";
import ProductBulkMasterDetails from "./ProductBulkMasterDetails";
import { useNavigate } from "react-router-dom";

const ProductMaster = () => {
  const [bulkOpen, setBulkOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const navigate = useNavigate();

  // ----Pagination code------
  const COLUMNS = [
    { title: "Stock No" },
    { title: "Product Name", classNameWidth: "common-width-apply-th " },
    { title: "SubCategory", classNameWidth: "thead-second-width" },
    { title: "Gender" },
    { title: "Design Price" },
    { title: "Box Price" },
    { title: "Fedex UPS" },
    { title: "India Post" },
    { title: "Insurance" },
    { title: "Other Cost" },
    { title: "Profit" },
    { title: "Discount" },
    { title: "Action" },
  ];

  const { state, setState, changeState, ...otherTableActionProps } =
    usePaginationTable();

  const handleButtonClick = (id) => {
    navigate(`${pageRoutes.variantProductId}/${id}`);
  };



  const paginate = (clear = false, isNewFilter = false) => {
    changeState("loader", true);
    let clearStates = {
      ...appConfig.default_pagination_state,
    };

    let filter = {
      page: state.page,
      rowsPerPage: state.rowsPerPage,
    };

    let newFilterState = { ...appConfig.default_pagination_state };

    if (clear) {
      filter = _.merge(filter, clearStates);
    } else if (isNewFilter) {
      filter = _.merge(filter, newFilterState);
    }

    // ----------Get Diamong Api------------

    API.get(apiConfig.product, filter)
      .then((res) => {
        setState({
          ...state,
          total_items: res.count,
          data: res.rows,
          ...(clear && clearStates),
          ...(isNewFilter && newFilterState),
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
        setState({
          ...state,
          ...(clear && clearStates),
          ...(isNewFilter && newFilterState),
          loader: false,
        });
      })
      .finally(() => {
        if (openSearch == true) {
          setOpenSearch(false);
        }
      });
  };

  useDidMountEffect(() => {
    paginate();
  }, [state.page, state.rowsPerPage, state.order, state.orderby]);

  const rows = useMemo(() => {
    return state.data.map((item) => {
      return {
        item: item,
        columns: [
          <span>{item.stockId}</span>,
          <div className="common-width-three-dot-text">
            <span>{item.productName}</span>
          </div>,
          <div className="three-dot-text-title">
            <span>{item.subCategoryName}</span>
          </div>,
          <span>{item.gender}</span>,
          <span>{item.designPrice}</span>,
          <span>{item.boxPrice}</span>,
          <span>{item.fedex_ups}</span>,
          <span>{item.indiaPost}</span>,
          <span>{item.insurance}</span>,
          <span>{item.otherCost}</span>,
          <span>{item.profit}</span>,
          <span>{item.discount}</span>,

          <div>
            <IconButton onClick={(e) => handleButtonClick(item.id)}>
              <Icon color="error">remove_red_eye</Icon>
            </IconButton>
          </div>,
        ],
      };
    });
  }, [state.data]);

  const togglePopupBulk = () => {
    setBulkOpen(!bulkOpen);
  };



  return (
    <>
      <div>
        <Container>
          <Box
            className="breadcrumb"
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Breadcrumb
              routeSegments={[
                { name: "Masters", path: pageRoutes.product },
                { name: "Product" },
              ]}
            />
            <div>
              <Button
                variant="contained"
                onClick={togglePopupBulk}
                style={{ marginLeft: "20px" }}
              >
                Add Product Bulk
              </Button>
            </div>
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
           <div>
      </div>

          <ProductBulkMasterDetails
            open={bulkOpen}
            togglePopup={() => {
              togglePopupBulk();
              paginate();
            }}
            callBack={() => paginate(true)}
          />
        </Container>
      </div>
    </>
  );
};

export default ProductMaster;
