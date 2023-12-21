import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Icon, IconButton, Tooltip } from "@mui/material";
import error400cover from "../../assets/no-data-found-page.png";
import _ from "lodash";
import Select from "react-select";
import { API, HELPER } from "../../services";
import { apiConfig, appConfig } from "../../config";
import PaginationTable, {
  usePaginationTable,
} from "../../components/UI/Pagination/PaginationTable";
import { Breadcrumb, Container } from "../../components";
import { pageRoutes } from "../../constants/routesList";
import ProductBulkMasterDetails from "./ProductBulkMasterDetails";
import { useNavigate } from "react-router-dom";
import SearchFilterDialog from "../../components/UI/Dialog/SearchFilterDialog";
import Textinput from "../../components/UI/TextInput";
import ReactSelect from "../../components/UI/ReactSelect";
import Swal from "sweetalert2";
import { toaster } from "../../services/helper";
import ThemeSwitch from "../../components/UI/ThemeSwitch";

const ProductMaster = () => {
  const [bulkOpen, setBulkOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [subCategory, setSubCategory] = useState([]);
  const [loading, setLoading] = useState();

  const navigate = useNavigate();

  // ----Pagination code------
  const COLUMNS = [
    { title: "Stock No", classNameWidth: "thead-second-width" },
    { title: "Product Name", classNameWidth: "common-width-apply-th" },
    { title: "SubCategory", classNameWidth: "thead-second-width-stock-no" },
    { title: "Gender", classNameWidth: "thead-second-width-discount-85-align-center" },
    { title: "Design Price", classNameWidth: "thead-second-width-discount-85-align-center" },
    { title: "Box Price", classNameWidth: "thead-second-width-discount-85-align-center" },
    { title: "Fedex UPS", classNameWidth: "thead-second-width-discount-85-align-center" },
    { title: "India Post", classNameWidth: "thead-second-width-discount-85-align-center" },
    { title: "Insurance", classNameWidth: "thead-second-width-discount-85-align-center" },
    { title: "Other Cost", classNameWidth: "thead-second-width-discount-85-align-center" },
    { title: "Profit", classNameWidth: "thead-second-width-discount-85-align-center" },
    { title: "Discount", classNameWidth: "thead-second-width-discount-85-align-center" },
    { title: "Is Visible", classNameWidth: "thead-second-width-discount-85-align-center" },
    {
      title: "Action",
      classNameWidth: "thead-second-width-discount-85-align-center",
    },
  ];

  const {
    state,
    setState,
    getInitialStates,
    changeState,
    ...otherTableActionProps
  } = usePaginationTable({
    // searchTxt: "",
    // subCategory: "",
    // gender: "",
  });

  const handleButtonClick = (id) => {
    navigate(`${pageRoutes.variantProductId}/${id}`);
  };


  // ---------------Visiblility Product Api----------------------

  const hiddenVisibleProduct = (Id) => {
    API.put(apiConfig.visibility_product.replace(":id", Id))
    .then((res) => {
      HELPER.toaster.success(res.message);
      paginate();
      setLoading(false);
    })
    .catch(() => { })
  };

  // ------------------------------- Delete Category ---------------------------------
  const onClickDelete = (category_id) => {
    Swal.fire({
      title: "Are You Sure",
      text: "Are you sure you want to remove this Category ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // API.destroy(`${apiConfig.category}/${category_id}`)
        // .then((res) => {
        toaster.error("Pending Backed Side");
        // paginate();
        // })
        // .catch((e) => HELPER.toaster.error(e.errors.message))
      }
    });
  };

  const paginate = (clear = false, isNewFilter = false) => {
    changeState("loader", true);
    let clearStates = {
      ...appConfig.default_pagination_state,
    };

    let filter = {
      page: state.page,
      rowsPerPage: state.rowsPerPage,
      searchTxt: state.searchTxt,
      subCategory: state.subCategory,
      gender: state.gender,
    };

    let newFilterState = { ...appConfig.default_pagination_state };
    if (clear) {
      delete filter.gender;
      delete filter.subCategory;
      delete filter.searchTxt;
    } else if (isNewFilter) {
      filter = _.merge(filter, newFilterState);
    }

    // ----------Get Diamong Api------------
    setLoading(true);
    API.get(apiConfig.product, filter)
      .then((res) => {
        setLoading(false);
        setState({
          ...(clear
            ? { ...getInitialStates() }
            : {
              ...state,
              ...(clear && clearStates),
              ...(isNewFilter && newFilterState),
              loader: false,
            }),
          total_items: res.count,
          data: res.rows,
        });
      })
      .catch((err) => {
        setLoading(false);
        if (
          err.status === 400 ||
          err.status === 401 ||
          err.status === 409 ||
          err.status === 403
        ) {
          HELPER.toaster.error(err.errors.message);
        } else {
          HELPER.toaster.error(err)
        }
        setState({
          ...state,
          ...(clear && clearStates),
          ...(isNewFilter && newFilterState),
          loader: false,
        });
      });
  };

  // useDidMountEffect(() => {
  //   paginate();
  // }, [state.page, state.rowsPerPage, state.order, state.orderby]);

  useEffect(() => {
    paginate();
  }, [state.page, state.rowsPerPage]);

  // useEffect(() => {
  //   paginate();
  // }, [state.page, state.rowsPerPage, state.order, state.orderby]);

  const rows = useMemo(() => {
    return state.data.map((item) => {
      return {
        item: item,
        columns: [
          <span>{item.stockId}</span>,
          <div className="common-width-three-dot-text">
            <span>{item.productName}</span>
          </div>,
          <div className="three-dot-text-title-stock-no">
            <span>{item.subCategoryName}</span>
          </div>,
          <span>{item.gender}</span>,
          <span>${item.designPrice}</span>,
          <span>${item.boxPrice}</span>,
          <span>{item.fedex_ups}</span>,
          <span>{item.indiaPost}</span>,
          <span>{item.insurance}</span>,
          <span>{item.otherCost}</span>,
          <span>{item.profit}</span>,
          <span>{item.discount}</span>,
          <span>
            <ThemeSwitch
              checked={item.isVisible}
              color="warning"
              onChange={() => {
                hiddenVisibleProduct(item.id);
              }}
            />
          </span>,

          <div>
            <IconButton onClick={(e) => handleButtonClick(item.id)}>
              <Icon color="primary">remove_red_eye</Icon>
            </IconButton>
            <IconButton onClick={(e) => onClickDelete(item.id)}>
              <Icon color="error">delete</Icon>
            </IconButton>
          </div>,
        ],
      };
    });
  }, [state.data]);

  const togglePopupBulk = () => {
    setBulkOpen(!bulkOpen);
  };
  const togglePopupSearch = () => {
    setOpenSearch(!openSearch);
  };

  // useEffect in SubCategory in Select
  useEffect(() => {
    API.get(apiConfig.listSubCategory, { is_public_url: true })
    .then((res) => {
      setSubCategory(res);
    })
    .catch(() => { })
  }, []);
  // --------------------SubCategory Filter----------------------------
  let _sortOptionsSubCategory = subCategory.map((option) => ({
    label: option.name,
    value: option.id,
  }));

  // ----------------Gender Filter----------------
  const sortOptionsGender = [
    { label: "Male", value: "Male" },
    { label: "Female ", value: "Female" },
    { label: "Unisex", value: "Unisex" },
  ];
  // --------------------Gender Filter----------------------------
  let _sortOptionsGender = sortOptionsGender.map((option) => ({
    label: option.label,
    value: option.value,
  }));

  return (
    <>
      <div>
        <Container>
          <Box
            className="breadcrumb"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Breadcrumb
              routeSegments={[
                // { name: "Masters", path: pageRoutes.master.user.user },
                { name: "Product" },
              ]}
            />
            <div>
              <Tooltip title="Filter">
                <IconButton
                  color="inherit"
                  className="button"
                  aria-label="Filter"
                  onClick={togglePopupSearch}
                >
                  <Icon>filter_list</Icon>
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                onClick={togglePopupBulk}
                style={{ marginLeft: "20px" }}
              >
                Add Product Bulk
              </Button>
            </div>
          </Box>
          {/* search of the filter code */}
          <SearchFilterDialog
            isOpen={openSearch}
            maxWidth="sm"
            onClose={() => setOpenSearch(false)}
            reset={() => paginate(true)}
            search={() => {
              paginate(false, true);
              setOpenSearch(false); // Close the modal
            }}
            loader={loading}
          >
            <div style={{ height: "300px" }}>
              <Textinput
                size="small"
                type="text"
                name="searchTxt"
                label="Search Text"
                autoFocus={true} 
                variant="outlined"
                value={state?.searchTxt}
                onChange={(e) => changeState("searchTxt", e.target.value)}
                sx={{ mb: 0, mt: 1, width: "100%" }}
              />
              <div className="text-input-top">
                <Select
                  placeholder="Select SubCategory Name"
                  options={_sortOptionsSubCategory}
                  isMulti
                  value={_sortOptionsSubCategory.filter(
                    (option) =>
                      state.subCategory &&
                      state.subCategory.includes(option.value)
                  )}
                  onChange={(selectedSort) => {
                    const selectedIds = selectedSort.map(
                      (option) => option.value
                    );
                    changeState("subCategory", selectedIds);
                  }}
                  name="choices-multi-default"
                  id="subCategory"
                />
              </div>
              <div className="text-input-top">
                <ReactSelect
                  // label="Select Sort by Price"
                  placeholder={
                    _sortOptionsGender.find(
                      (option) => option.value === state.gender
                    )?.label || "Select Gender"
                  }
                  options={_sortOptionsGender}
                  value={_sortOptionsGender.find(
                    (option) => option.value === state.gender
                  )}
                  onChange={(selectedSort) => {
                    const selectedId = selectedSort.target.value;
                    changeState("gender", selectedId);
                  }}
                  name="choices-multi-default"
                />
              </div>
            </div>
          </SearchFilterDialog>

          {/* pagination code */}
          <PaginationTable
            header={COLUMNS}
            rows={rows}
            totalItems={state.total_items || 0}
            perPage={state.rowsPerPage}
            activePage={state.page}
            checkboxColumn={false}
            selectedRows={state.selectedRows}
            enableOrder={true}
            isLoader={loading}
            emptyTableImg={<img src={error400cover} width="400px" />}
            {...otherTableActionProps}
            orderBy={state.orderby}
            order={state.order}
          ></PaginationTable>
          {/* <div></div> */}

          {/* Product Bulk master add to model  */}
          {bulkOpen && (
            <ProductBulkMasterDetails
              open={bulkOpen}
              togglePopup={() => {
                togglePopupBulk();
                // paginate();
              }}
              callBack={() => paginate(true)}
            />
          )}
        </Container>
      </div>
    </>
  );
};

export default ProductMaster;
