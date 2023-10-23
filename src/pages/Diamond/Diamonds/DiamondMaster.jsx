import React, { useCallback, useEffect, useMemo, useState } from "react";
import { apiConfig, appConfig } from "../../../config";
import { Breadcrumb, Container, StyledAddButton } from "../../../components";
import useDidMountEffect from "../../../hooks/useDidMountEffect";
import { Box, Button, Icon, IconButton, Slider, Tooltip } from "@mui/material";
import ThemeSwitch from "../../../components/UI/ThemeSwitch";
import PaginationTable, {
  usePaginationTable,
} from "../../../components/UI/Pagination/PaginationTable";
import { API, HELPER } from "../../../services";
import Swal from "sweetalert2";
import { pageRoutes } from "../../../constants/routesList";
import error400cover from "../../../assets/no-data-found-page.png";
import _ from "lodash";
import ReactSelect from "../../../components/UI/ReactSelect";
import DiamondBulkMasterDetails from "./DiamondBulkMasterDetails";
import SearchFilterDialog from "../../../components/UI/Dialog/SearchFilterDialog";
import { Input, Label } from "reactstrap";
import DiamondMasterDetails from "./DiamondMasterDetails";

const DiamondMaster = () => {
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [open, setOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [value, setValue] = useState([0, 10000]);
  const [value2, setValue2] = useState([0, 10]);
  const [shapMaster, setShapMaster] = useState([]);

  // ----Pagination code------
  const COLUMNS = [
    { title: "stock Id" },
    { title: "carat" },
    { title: "ShapeName" },
    { title: "Description" },
    { title: "color" },
    { title: "clarity" },
    { title: "cut" },
    { title: "symmetry" },
    { title: "polish" },
    { title: "girdle" },
    { title: "culet" },
    { title: "origin" },
    { title: "labName" },
    { title: "certificateNo" },
    { title: "price" },
    { title: "isVisible" },
    { title: "Action" },
  ];

  const { state, setState, changeState, ...otherTableActionProps } =
    usePaginationTable({
      // fromCts: "",
      // toCts: "",
      // shape: "",
      // fromColor: "",
      // toColor: "",
      // fromClarity: "",
      // toClarity: "",
      // fromCut: "",
      // toCut: "",
      // fromFlor: "",
      // toFlor: "",
      // fromSym: "",
      // toSym: "",
      // fromPolish: "",
      // toPolish: "",
      // fromTable: "",
      // toTable: "",
      // fromDepth: "",
      // toDepth: "",
      // fromPrice: "",
      // toPrice: "",
      // lab: "",
      sortByShape: "ASC",
      sortByPrice: "ASC",
      sortByCarat: "ASC",
      sortByCut: "ASC",
      sortByColor: "ASC",
      sortByLab: "ASC",
    });

  const paginate = (clear = false, isNewFilter = false) => {
    changeState("loader", true);
    let clearStates = {
      fromCts: "",
      toCts: "",
      shape: "",
      fromColor: "",
      toColor: "",
      fromClarity: "",
      toClarity: "",
      fromCut: "",
      toCut: "",
      fromFlor: "",
      toFlor: "",
      fromSym: "",
      toSym: "",
      fromPolish: "",
      toPolish: "",
      fromTable: "",
      toTable: "",
      fromDepth: "",
      toDepth: "",
      fromPrice: "",
      toPrice: "",
      lab: "",
      sortByShape: "ASC",
      sortByPrice: "ASC",
      sortByCarat: "ASC",
      sortByCut: "ASC",
      sortByColor: "ASC",
      sortByLab: "ASC",
      ...appConfig.default_pagination_state,
    };

    let filter = {
      page: state.page,
      rowsPerPage: state.rowsPerPage,
      fromCts: clear ? clearStates.fromCts : state.fromCts,
      toCts: clear ? clearStates.toCts : state.toCts,
      shape: clear ? clearStates.shape : state.shape,
      fromColor: clear ? clearStates.fromColor : state.fromColor,
      toColor: clear ? clearStates.toColor : state.toColor,
      fromClarity: clear ? clearStates.fromClarity : state.fromClarity,
      toClarity: clear ? clearStates.toClarity : state.toClarity,
      fromCut: clear ? clearStates.fromCut : state.fromCut,
      toCut: clear ? clearStates.toCut : state.toCut,
      fromFlor: clear ? clearStates.fromFlor : state.fromFlor,
      toFlor: clear ? clearStates.toFlor : state.toFlor,
      fromSym: clear ? clearStates.fromSym : state.fromSym,
      fromPolish: clear ? clearStates.fromPolish : state.fromPolish,
      toPolish: clear ? clearStates.toPolish : state.toPolish,
      fromTable: clear ? clearStates.fromTable : state.fromTable,
      toTable: clear ? clearStates.toTable : state.toTable,
      fromDepth: clear ? clearStates.fromDepth : state.fromDepth,
      toDepth: clear ? clearStates.toDepth : state.toDepth,
      fromPrice: clear ? clearStates.fromPrice : state.fromPrice,
      toPrice: clear ? clearStates.toPrice : state.toPrice,
      lab: clear ? clearStates.lab : state.lab,
      sortByShape: clear ? clearStates.sortByShape : state.sortByShape,
      sortByPrice: clear ? clearStates.sortByPrice : state.sortByPrice,
      sortByCarat: clear ? clearStates.sortByCarat : state.sortByCarat,
      sortByCut: clear ? clearStates.sortByCut : state.sortByCut,
      sortByColor: clear ? clearStates.sortByColor : state.sortByColor,
      sortByLab: clear ? clearStates.sortByLab : state.sortByLab,
    };

    let newFilterState = { ...appConfig.default_pagination_state };

    if (clear) {
      filter = _.merge(filter, clearStates);
    } else if (isNewFilter) {
      filter = _.merge(filter, newFilterState);
    }

    // ----------Get Diamong Api------------

    API.get(apiConfig.diamonds, filter)
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

  // ------------------Get Shap API --------------------------------

  // useEffect(() => {
  //   API.get(apiConfig.shape)
  //     .then((res) => {
  //       setShapMaster(res);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }, [])

  // ---------------Visiblility Diamond Api----------------------

  const hiddenVisibleDiamond = (Id) => {
    API.put(apiConfig.visibility_diamond.replace(":id", Id)).then((res) => {
      HELPER.toaster.success(res.message);
      paginate();
    });
  };
  //------------ Delete Diamond --------------

  const onClickDelete = (diamond_id) => {
    Swal.fire({
      title: "Are You Sure",
      text: "Are you sure you want to remove this Diamond ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        API.destroy(`${apiConfig.diamonds}/${diamond_id}`)
          .then((res) => {
            HELPER.toaster.success("Deleted Successfully");
            paginate();
          })
          .catch(console.error);
      }
    });
  };

  useDidMountEffect(() => {
    paginate();
  }, [state.page, state.rowsPerPage, state.order, state.orderby]);

  const handleChangePrice = (event, newValue) => {
    setValue(newValue);
    changeState("fromPrice", newValue[0]);
    changeState("toPrice", newValue[1]);
  };
  const handleChangeDimension = (event, newValue) => {
    setValue2(newValue);
    changeState("fromDimension", newValue[0]);
    changeState("toDimension", newValue[1]);
  };

  let _sortOptionsShap = shapMaster.map((option) => ({
    label: option.shape,
    value: option.id,
  }));
  const sortOptionsOrigin = [
    { label: "Lab", value: "Lab" },
    { label: "Natural", value: "Natural" },
  ];

  let _sortOptionsOrigin = sortOptionsOrigin.map((option) => ({
    label: option.label,
    value: option.value,
  }));

  const sortOptionsColor = [
    { label: "Blue", value: "Blue" },
    { label: "White", value: "White" },
    { label: "Green", value: "Green" },
    { label: "Pink", value: "Pink" },
    { label: "Teal", value: "Teal" },
    { label: "Purple", value: "Purple" },
    { label: "Peach", value: "Peach" },
    { label: "Yellow", value: "Yellow" },
    { label: "Orange", value: "Orange" },
    { label: "Other", value: "Other" },
  ];

  let _sortOptionsColor = sortOptionsColor.map((option) => ({
    label: option.label,
    value: option.value,
  }));

  const sortOptionsGemstoneType = [
    { label: "Moissanite", value: "Moissanite" },
    { label: "Sapphire", value: "Sapphire" },
    { label: "COLORED_DIAMOND ", value: "ColoredDiamond " },
    { label: "Emerald", value: "Emerald" },
    { label: "Aquamarine", value: "Aquamarine" },
    { label: "Morganite", value: "Morganite" },
    { label: "Alexandrite", value: "Alexandrite" },
    { label: "Ruby", value: "Ruby" },
    { label: "Tanzanite", value: "Tanzanite" },
    { label: "Tourmaline", value: "Tourmaline" },
    { label: "Amethyst", value: "Amethyst" },
    { label: "Garnet", value: "Garnet" },
    { label: "Spinel", value: "Spinel" },
    { label: "Peridot", value: "Peridot" },
    { label: "Citrine", value: "Citrine" },
    { label: "Other", value: "Other" },
  ];

  let _sortOptionsGemstoneType = sortOptionsGemstoneType.map((option) => ({
    label: option.label,
    value: option.value,
  }));

  const sortOptionsSortBy = [
    { label: "Newest", value: "newest" },
    { label: "Lowest Price", value: "lPrice" },
    { label: "Highest Price", value: "hPrice" },
  ];
  let _sortOptionsSortBy = sortOptionsSortBy.map((option) => ({
    label: option.label,
    value: option.value,
  }));
  // ----------Get Gemstone List Api-------------
  const rows = useMemo(() => {
    return state.data.map((item) => {
      // console.log(item,"ietem");
      return {
        item: item,
        columns: [
          <span>{item.stockId}</span>,
          <span>{item.carat}</span>,
          <span>{item.shapeName}</span>,
          <span>{item.color}</span>,
          <span>{item.clarity}</span>,
          <span>{item.cut}</span>,
          <span>{item.fluorescence}</span>,
          <span>{item.symmetry}</span>,
          <span>{item.polish}</span>,
          <span>{item.girdle}</span>,
          <span>{item.culet}</span>,
          <span>{item.origin}</span>,
          <span>{item.labName}</span>,
          <span>{item.certificateNo}</span>,
          <span>{item.price}</span>,
          <span>
            <ThemeSwitch
              checked={item.isVisible}
              color="warning"
              onChange={() => {
                hiddenVisibleDiamond(item.id);
              }}
            />
          </span>,
          <div>
            <IconButton onClick={(e) => handleEdit(item)}>
              <Icon color="primary">create</Icon>
            </IconButton>
            <IconButton onClick={(e) => onClickDelete(item.id)}>
              <Icon color="error">delete</Icon>
            </IconButton>
          </div>,
        ],
      };
    });
  }, [state.data]);

  const togglePopup = () => {
    if (open) {
      setSelectedUserData(null);
    }
    setOpen(!open);
  };

  const togglePopupBulk = () => {
    // if (bulkOpen) {
    //     setSelectedUserData(null);
    // }
    setBulkOpen(!bulkOpen);
  };
  const togglePopupSearch = () => {
    setOpenSearch(!openSearch);
  };

  const handleEdit = (data) => {
    setSelectedUserData(data);
    setOpen(true);
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
                { name: "Masters", path: pageRoutes.diamond },
                { name: "Diamonds" },
              ]}
            />
            <div>
              <div>
                <Button variant="contained" onClick={togglePopupBulk}>
                  Add DiamondBulk
                </Button>

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
              </div>
            </div>
            <SearchFilterDialog
              isOpen={openSearch}
              onClose={() => setOpenSearch(false)}
              reset={() => paginate(true)}
              search={() => paginate(false, true)}
            >
              <div style={{ height: "200px" }}>
                <ReactSelect
                  label={"Select Sort by Price"}
                  placeholder="Select Sort by Price"
                  options={_sortOptionsSortBy}
                  onChange={(e) => {
                    changeState("sortBy", e?.target.value || "");
                  }}
                  name="sortBy"
                />
              </div>

              <div style={{ height: "200px" }}>
                <Label className="form-label" htmlFor="product-price-input">
                  Price :
                </Label>
                <Slider
                  value={value}
                  onChange={handleChangePrice}
                  valueLabelDisplay="auto"
                  min={0}
                  max={10000}
                />
                <Input
                  className="form-control"
                  type="text"
                  id="minCost"
                  value={state.fromPrice}
                  placeholder="Start Price"
                  name="fromPrice"
                  onChange={(e) => changeState("fromPrice", e.target.value)}
                  readOnly
                />
                <span className="fw-semibold text-muted">to</span>
                <Input
                  className="form-control "
                  type="text"
                  id="maxCost"
                  value={state.toPrice}
                  placeholder="End Price"
                  name="toPrice"
                  onChange={(e) => changeState("toPrice", e.target.value)}
                  readOnly
                />
              </div>
              <div style={{ height: "200px" }}>
                <Label className="form-label" htmlFor="product-price-input">
                  Dimension :
                </Label>
                <Slider
                  value={value2}
                  onChange={handleChangeDimension}
                  valueLabelDisplay="auto"
                  min={0}
                  max={10}
                />
                <Input
                  defaultValue="1"
                  className="form-control"
                  type="text"
                  id="minCost"
                  value={state.fromDimension}
                  placeholder="Start Dimension"
                  name="fromDimension"
                  onChange={(e) => changeState("fromDimension", e.target.value)}
                  readOnly
                />
                <span className="fw-semibold text-muted">to</span>
                <Input
                  className="form-control "
                  type="text"
                  id="maxCost"
                  defaultValue="10"
                  value={state.toDimension}
                  placeholder="End Dimension"
                  name="toDimension"
                  onChange={(e) => changeState("toDimension", e.target.value)}
                  readOnly
                />
              </div>
              <div>
                {/* <Select
                  placeholder="Select Shap Name"
                  options={_sortOptionsShap}
                  isMulti
                  value={_sortOptionsShap.filter((option) =>
                    state.shape.includes(option.value)
                  )}
                  onChange={(selectedSort) => {
                    const selectedIds = selectedSort.map(
                      (option) => option.value
                    );
                    changeState("shape", selectedIds);
                  }}
                  name="choices-multi-default"
                  id="shape"
                /> */}
              </div>

              <div>
                {/* <Select
                  placeholder="Select Origin Name"
                  options={_sortOptionsOrigin}
                  isMulti
                  value={_sortOptionsOrigin.filter((option) =>
                    state.origin.includes(option.value)
                  )}
                  onChange={(selectedSort) => {
                    const selectedIds = selectedSort.map(
                      (option) => option.value
                    );
                    changeState("origin", selectedIds);
                  }}
                  name="choices-multi-default"
                  id="origin"
                /> */}
              </div>

              <div>
                {/* <Select
                  placeholder="Select Color"
                  options={_sortOptionsColor}
                  isMulti
                  value={_sortOptionsColor.filter((option) =>
                    state.color.includes(option.value)
                  )}
                  onChange={(selectedSort) => {
                    const selectedIds = selectedSort.map(
                      (option) => option.value
                    );
                    changeState("color", selectedIds);
                  }}
                  name="choices-multi-default"
                  id="color"
                /> */}
              </div>

              {/* <div>
                <Select
                  placeholder="Select GemstoneType"
                  options={_sortOptionsGemstoneType}
                  isMulti
                  value={_sortOptionsGemstoneType.filter((option) =>
                    state.gemstoneType.includes(option.value)
                  )}
                  onChange={(selectedSort) => {
                    const selectedIds = selectedSort.map(
                      (option) => option.value
                    );
                    changeState("gemstoneType", selectedIds);
                  }}
                  name="choices-multi-default"
                  id="gemstoneType"
                />
              </div> */}
            </SearchFilterDialog>
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
          <Tooltip title="Create" placement="top">
            <StyledAddButton
              color="secondary"
              aria-label="Add"
              className="button"
              onClick={togglePopup}
            >
              <Icon>add</Icon>
            </StyledAddButton>
          </Tooltip>
          <DiamondMasterDetails
            open={open}
            togglePopup={() => {
              togglePopup();
              paginate();
            }}
            callBack={() => paginate(true)}
            userData={selectedUserData}
          />
          <DiamondBulkMasterDetails
            open={bulkOpen}
            togglePopup={() => {
              togglePopupBulk();
              paginate();
            }}
            callBack={() => paginate(true)}
            //   userData={selectedUserData}
          />
        </Container>
      </div>
    </>
  );
};

export default DiamondMaster;
