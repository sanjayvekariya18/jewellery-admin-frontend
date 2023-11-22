import React, { useEffect, useMemo, useState } from "react";
import { Breadcrumb, Container, StyledAddButton } from "../../../../components";
import PaginationTable, {
  usePaginationTable,
} from "../../../../components/UI/Pagination/PaginationTable";
import { API, HELPER } from "../../../../services";
import { apiConfig, appConfig } from "../../../../config";
import _ from "lodash";
import Swal from "sweetalert2";
import { Box, Button, Icon, IconButton, Slider, Tooltip } from "@mui/material";
import error400cover from "../../../../assets/no-data-found-page.png";
import SearchFilterDialog from "../../../../components/UI/Dialog/SearchFilterDialog";
import Select from "react-select";
import ThemeSwitch from "../../../../components/UI/ThemeSwitch";
import GemstoneMasterDetails from "./GemstoneMasterDetails";
import GemstoneBulkMasterDetails from "./GemstoneBulkMasterDetails";
import Textinput from "../../../../components/UI/TextInput";
import FindGemstoneModal from "./findGemstoneModal";

const GemstoneMaster = () => {
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [open, setOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [loading, setLoading] = useState();
  const [shapMaster, setShapMaster] = useState([]);
  const [findGemstone, setFindGemstone] = useState(false);
  const [gemStoneData, setGemstoneData] = useState(null);
  const [price, setPrice] = useState([]);

  // ----Pagination code------
  const COLUMNS = [
    { title: "Stock No", classNameWidth: "thead-second-width-discount" },
    { title: "Title", classNameWidth: "thead-second-width-title-option" },
    { title: "Type", classNameWidth: "thead-second-width-discount-85" },
    { title: "Shape", classNameWidth: "thead-second-width-discount-85" },
    { title: "Carat", classNameWidth: "thead-second-width-action-50" },
    { title: "Color", classNameWidth: "thead-second-width-discount-85" },
    {
      title: "Clarity",
      classNameWidth: "thead-second-width-discount-85",
    },
    {
      title: "Origin",
      classNameWidth: "thead-second-width-discount-85",
    },
    { title: "Price", classNameWidth: "thead-second-width-action-carat" },
    { title: "Is Visible", classNameWidth: "thead-second-width-action-carat" },
    {
      title: "Action",
      classNameWidth: "thead-second-width-discount action-center",
    },
  ];

  const {
    state,
    setState,
    getInitialStates,
    changeState,
    ...otherTableActionProps
  } = usePaginationTable({});

  const paginate = (clear = false, isNewFilter = false) => {
    changeState("loader", true);
    let clearStates = {
      ...appConfig.default_pagination_state,
    };

    let filter = {
      page: state.page,
      rowsPerPage: state.rowsPerPage,
      shape: clear ? clearStates.shape : state.shape,
      color: clear ? clearStates.color : state.color,
      origin: clear ? clearStates.origin : state.origin,
      gemstoneType: clear ? clearStates.gemstoneType : state.gemstoneType,
      fromPrice: clear ? clearStates.fromPrice : state.fromPrice,
      toPrice: clear ? clearStates.toPrice : state.toPrice,
      fromDimension: clear ? clearStates.fromDimension : state.fromDimension,
      toDimension: clear ? clearStates.toDimension : state.toDimension,
    };

    let newFilterState = { ...appConfig.default_pagination_state };
    if (clear) {
      delete filter.fromPrice;
      delete filter.toPrice;
      delete filter.fromDimension;
      delete filter.toDimension;
      delete filter.shape;
      delete filter.color;
      delete filter.origin;
      delete filter.gemstoneType;
    } else if (isNewFilter) {
      filter = _.merge(filter, newFilterState);
    }

    // ----------Get Gemstone Api------------
    setLoading(true);
    API.get(apiConfig.gemstone, filter)
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
          console.error(err);
        }
        setState({
          ...state,
          ...(clear && clearStates),
          ...(isNewFilter && newFilterState),
          loader: false,
        });
      });
  };

  // ------------------Get Shap API --------------------------------

  useEffect(() => {
    API.get(apiConfig.shapeList, { is_public_url: true })
      .then((res) => {
        setShapMaster(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // ------------Shap List--------------------------------
  let _sortOptionsShap = shapMaster.map((option) => ({
    label: option.shape,
    value: option.id,
  }));

  // --------------- Visiblility Gemstone Api ----------------------

  const hiddenVisibleGemstone = (Id) => {
    API.put(apiConfig.visibility_gemstone.replace(":id", Id)).then((res) => {
      HELPER.toaster.success(res.message);
      paginate();
      setLoading(false);
    });
  };
  //------------ Delete Gemstone --------------

  const onClickDelete = (gemstone_id) => {
    Swal.fire({
      title: "Are You Sure",
      text: "Are you sure you want to remove this Gemstone ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        API.destroy(`${apiConfig.gemstone}/${gemstone_id}`)
          .then((res) => {
            HELPER.toaster.success("Deleted Successfully");
            paginate();
          })
          .catch(console.error);
      }
    });
  };

  useEffect(() => {
    paginate();
  }, [state.page, state.rowsPerPage]);

  // ------------------- Get Price ---------------------------------
  useEffect(() => {
    API.get(apiConfig.gemstonePriceRange, { is_public_url: true })
      .then((res) => {
        setPrice(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // --------------- Price Filter ----------------------
  const handleChangePrice = (event, newValue) => {
    changeState("fromPrice", newValue[0]);
    changeState("toPrice", newValue[1]);
  };

  // ---------------- Origin Filter ----------------
  const sortOptionsOrigin = [
    { label: "Lab", value: "Lab" },
    { label: "Natural", value: "Natural" },
  ];

  let _sortOptionsOrigin = sortOptionsOrigin.map((option) => ({
    label: option.label,
    value: option.value,
  }));

  // ---------------------Color Filter----------------
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

  // -------------------GemstonesType Filter --------------------------------
  const sortOptionsGemstoneType = [
    { label: "Moissanite", value: "Moissanite" },
    { label: "Sapphire", value: "Sapphire" },
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

  const toggleGemstonePopup = () => {
    if (findGemstone) {
      setGemstoneData(null); // Reset gemStoneData when closing the modal
    }
    setFindGemstone(!findGemstone); // Toggle modal visibility
  };

  const getDataGemstone = (id) => {
    API.get(apiConfig.findGemstone.replace(":id", id)).then((res) => {
      setGemstoneData(res); // Update gemStoneData when fetching data
      setFindGemstone(true); // Open the modal when data is received
    });
  };

  // ----------Get Gemstone List Api-------------

  const rows = useMemo(() => {
    return state.data.map((item) => {
      return {
        item: item,
        columns: [
          <span>{item.stockId}</span>,
          <div className="common-thead-second-width-title">
            <span>{item.title}</span>
          </div>,
          <span>{item.gemstoneType}</span>,
          <span>{item.shapeName}</span>,
          <span>{item.carat}</span>,
          <span>{item.color}</span>,
          <span>{item.clarity}</span>,
          <span>{item.origin}</span>,
          <span>{item.price}</span>,
          <span>
            <ThemeSwitch
              checked={item.isVisible}
              color="warning"
              onChange={() => {
                hiddenVisibleGemstone(item.id);
              }}
            />
          </span>,
          <div>
            <IconButton onClick={(e) => getDataGemstone(item.id)}>
              <Icon color="error">remove_red_eye</Icon>
            </IconButton>
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
    setBulkOpen(!bulkOpen);
  };
  const togglePopupSearch = () => {
    setOpenSearch(!openSearch);
  };

  const handleEdit = (data) => {
    setSelectedUserData(data);
    setOpen(true);
  };

  const activeButtonStyle = {
    backgroundColor: "#1976d2", // You can set your desired background color here
    color: "white", // Change the text color when the button is active
  };

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
            <Breadcrumb routeSegments={[{ name: "Gemstones" }]} />
            <div>
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
                  Add Gemstones Bulk
                </Button>
              </div>
            </div>
            <SearchFilterDialog
              isOpen={openSearch}
              onClose={() => setOpenSearch(false)}
              reset={() => paginate(true)}
              // search={() => paginate(false, true)}
              search={() => {
                paginate(false, true);
                setOpenSearch(false); // Close the modal
              }}
              loader={loading}
            >
              <div style={{ height: "350px" }}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr ",
                    gap: "12px",
                  }}
                  className="text-input-top"
                >
                  <div>
                    <Select
                      label="Select Shape Name"
                      placeholder="Select Shape Name"
                      options={_sortOptionsShap}
                      isMulti
                      value={_sortOptionsShap.filter(
                        (option) =>
                          state.shape && state.shape.includes(option.value)
                      )}
                      onChange={(selectedSort) => {
                        const selectedIds = selectedSort.map(
                          (option) => option.value
                        );
                        changeState("shape", selectedIds);
                      }}
                      name="choices-multi-default"
                      id="shape"
                    />
                  </div>
                  <div>
                    <Select
                      label="Select Origin"
                      placeholder="Select Origin Name"
                      options={_sortOptionsOrigin}
                      isMulti
                      value={_sortOptionsOrigin.filter(
                        (option) =>
                          state.origin && state.origin.includes(option.value)
                      )}
                      onChange={(selectedSort) => {
                        const selectedIds = selectedSort.map(
                          (option) => option.value
                        );
                        changeState("origin", selectedIds);
                      }}
                      name="choices-multi-default"
                      id="origin"
                    />
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr ",
                    gap: "12px",
                  }}
                >
                  <div className="text-input-top">
                    <Select
                      label="Select Color"
                      placeholder="Select Color Name"
                      options={_sortOptionsColor}
                      isMulti
                      value={_sortOptionsColor.filter(
                        (option) =>
                          state.color && state.color.includes(option.value)
                      )}
                      onChange={(selectedSort) => {
                        const selectedIds = selectedSort.map(
                          (option) => option.value
                        );
                        changeState("color", selectedIds);
                      }}
                      name="choices-multi-default"
                      id="color"
                    />
                  </div>

                  <div className="text-input-top">
                    <Select
                      label="Select GemstoneType"
                      placeholder="Select GemstoneType"
                      options={_sortOptionsGemstoneType}
                      isMulti
                      value={_sortOptionsGemstoneType.filter(
                        (option) =>
                          state.gemstoneType &&
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
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr ",
                    gap: "12px 25px",
                  }}
                  className="text-input-top"
                >
                  <div>
                    <label className="label-class">Price :</label>
                    <Slider
                      value={[
                        state.fromPrice === undefined
                          ? price.minPrice
                          : state.fromPrice,
                        state.toPrice === undefined
                          ? price.maxPrice
                          : state.toPrice,
                      ]}
                      onChange={handleChangePrice}
                      valueLabelDisplay="auto"
                      min={price.minPrice}
                      max={price.maxPrice}
                    />
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                      }}
                    >
                      <Textinput
                        type="number"
                        id="minCost"
                        value={
                          state.fromPrice === undefined
                            ? price.minPrice
                            : state.fromPrice
                        }
                        placeholder="Start Price"
                        disabled={true}
                        name="fromPrice"
                        onChange={(e) =>
                          changeState("fromPrice", e.target.value)
                        }
                        style={{ width: "140px" }}
                      />

                      <span
                        style={{ margin: "0px 10px 0 12px", fontWeight: "500" }}
                      >
                        To
                      </span>

                      <Textinput
                        type="number"
                        id="maxCost"
                        disabled={true}
                        value={
                          state.toPrice === undefined
                            ? price.maxPrice
                            : state.toPrice
                        }
                        placeholder="End Price"
                        name="toPrice"
                        onChange={(e) => changeState("toPrice", e.target.value)}
                        style={{ width: "140px" }}
                      />
                    </div>
                  </div>
                  <div>
                    <div style={{ paddingBottom: "10px" }}>
                      <label className="label-class">Dimension :</label>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "auto auto auto ",
                        gap: "6px",
                      }}
                      className="main-buttons-handle"
                    >
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() =>
                          setState({
                            ...state,
                            fromDimension: null,
                            toDimension: 6,
                          })
                        }
                        style={
                          state.fromDimension === null &&
                          state.toDimension === 6
                            ? activeButtonStyle
                            : {}
                        }
                      >
                        Under 6mm
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() =>
                          setState({
                            ...state,
                            fromDimension: 6,
                            toDimension: 6.9,
                          })
                        }
                        style={
                          state.fromDimension === 6 && state.toDimension === 6.9
                            ? activeButtonStyle
                            : {}
                        }
                      >
                        6-6.9mm
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() =>
                          setState({
                            ...state,
                            fromDimension: 7,
                            toDimension: 7.9,
                          })
                        }
                        style={
                          state.fromDimension === 7 && state.toDimension === 7.9
                            ? activeButtonStyle
                            : {}
                        }
                      >
                        7-7.9mm
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() =>
                          setState({
                            ...state,
                            fromDimension: 8,
                            toDimension: 8.9,
                          })
                        }
                        style={
                          state.fromDimension === 8 && state.toDimension === 8.9
                            ? activeButtonStyle
                            : {}
                        }
                      >
                        8-8.9mm
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() =>
                          setState({
                            ...state,
                            fromDimension: 10,
                            toDimension: null,
                          })
                        }
                        style={
                          state.fromDimension === 10 &&
                          state.toDimension === null
                            ? activeButtonStyle
                            : {}
                        }
                      >
                        10mm+
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
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
            isLoader={loading}
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

            {/* Gem Stone Details Modal */}
            {open && (
              <GemstoneMasterDetails
                open={open}
                togglePopup={() => {
                  togglePopup();
                  // paginate();
                }}
                callBack={() => paginate(true)}
                userData={selectedUserData}
              />
            )}

            {/* Gem Stone Bulk Details Modal */}
            <GemstoneBulkMasterDetails
              open={bulkOpen}
              togglePopup={() => {
                togglePopupBulk();
                // paginate();
              }}
              callBack={() => paginate(true)}
              userData={selectedUserData}
            />
        

          {/* Gem Stone Bulk Details Modal */}
          <GemstoneBulkMasterDetails
            open={bulkOpen}
            togglePopup={() => {
              togglePopupBulk();
              paginate();
            }}
            callBack={() => paginate(true)}
          />

          {/* Find Gem Stone Bulk Details Modal */}
          <FindGemstoneModal
            open={findGemstone}
            togglePopup={() => {
              toggleGemstonePopup();
              // paginate();
            }}
            gemStoneData={gemStoneData}
          />
        </Container>
      </div>
    </>
  );
};

export default GemstoneMaster;
