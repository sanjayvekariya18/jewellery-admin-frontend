import React, { useEffect, useMemo, useState } from "react";
import PaginationTable, {
  usePaginationTable,
} from "../../components/UI/Pagination/PaginationTable";
import { apiConfig, appConfig } from "../../config";
import { Box, Button, Icon, IconButton, Slider, Tooltip } from "@mui/material";
import Select from "react-select";
import error400cover from "../../assets/no-data-found-page.png";
import _ from "lodash";
import { API, HELPER } from "../../services";
import Swal from "sweetalert2";
import Textinput from "../../components/UI/TextInput";
import ThemeSwitch from "../../components/UI/ThemeSwitch";
import SearchFilterDialog from "../../components/UI/Dialog/SearchFilterDialog";
import { Breadcrumb, Container, StyledAddButton } from "../../components";
import ColorDiamondBulkMasterDetails from "./ColorDiamondBulkMasterDetails";
import ColorDiamondMasterDetails from "./ColorDiamondMasterDetails";
import FindColoredModal from "./findColoredDiamondModal";

const ColorDiamondMaster = () => {
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [open, setOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [shapMaster, setShapMaster] = useState([]);
  const [price, setPrice] = useState([]);
  const [carat, setCarat] = useState([]);
  const [intensity, setIntensity] = useState([]);
  const [color, setColor] = useState([]);
  const [gemStoneData, setGemstoneData] = useState(null);
  const [findGemstone, setFindGemstone] = useState(false);
  const [loading, setLoading] = useState();

  // -------------------Get Price---------------------------------
  useEffect(() => {
    API.get(apiConfig.priceRange, { is_public_url: true })
      .then((res) => {
        setPrice(res);
      })
      .catch((err) => {
        HELPER.toaster.error(err)
      });
  }, []);
  // ---------------Price Filter----------------------
  const handleChangePrice = (event, newValue) => {
    changeState("fromPrice", newValue[0]);
    changeState("toPrice", newValue[1]);
  };
  // -------------------Get Carat---------------------------------
  useEffect(() => {
    API.get(apiConfig.caratRange, { is_public_url: true })
      .then((res) => {
        setCarat(res);
      })
      .catch((err) => {
        HELPER.toaster.error(err)
      });
  }, []);
  // ---------------Carat Filter----------------------
  const handleChangeCarat = (event, newValue) => {
    changeState("fromCts", newValue[0]);
    changeState("toCts", newValue[1]);
  };

  // -------------------Get intensity---------------------------------
  useEffect(() => {
    API.get(apiConfig.intensityRange, { is_public_url: true })
      .then((res) => {
        setIntensity(res);
      })
      .catch((err) => {
        HELPER.toaster.error(err)
      });
  }, []);
  const _intensityOptions = intensity.map((item) => ({
    label: item,
    value: item,
  }));

  // -------------------Get Color---------------------------------
  useEffect(() => {
    API.get(apiConfig.colorRange, { is_public_url: true })
      .then((res) => {
        setColor(res);
      })
      .catch((err) => {
        HELPER.toaster.error(err)
      });
  }, []);
  const _colorOptions = color.map((item) => ({
    label: item,
    value: item,
  }));

  // ----------------Origin Filter----------------
  const sortOptionsOrigin = [
    { label: "Lab", value: "Lab" },
    { label: "Natural", value: "Natural" },
  ];

  let _sortOptionsOrigin = sortOptionsOrigin.map((option) => ({
    label: option.label,
    value: option.value,
  }));
  // ----Pagination code------
  const COLUMNS = [
    { title: "Stock No", classNameWidth: "thead-second-width-discount" },
    { title: "Title", classNameWidth: "thead-second-width-title-option" },
    { title: "Shape", classNameWidth: "thead-second-width-discount-85" },
    { title: "Carat", classNameWidth: "thead-second-width-action-50" },
    { title: "Color", classNameWidth: "thead-second-width-discount-85" },
    { title: "Clarity", classNameWidth: "thead-second-width-discount-85" },
    { title: "Origin", classNameWidth: "thead-second-width-discount-85" },
    { title: "Intensity", classNameWidth: "thead-second-width-discount-85" },
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
  } = usePaginationTable({
    // shape: "",
    // color: "",
    // sortBy: "newest",
    // intensity: "",
    // origin: "",
    // fromPrice: price.minPrice,
    // toPrice: price.maxPrice,
    // fromCts: carat.minCarat,
    // toCts: carat.maxCarat,
  });
  const paginate = (clear = false, isNewFilter = false) => {
    changeState("loader", true);
    let clearStates = {
      ...appConfig.default_pagination_state,
    };

    let filter = {
      page: state.page,
      rowsPerPage: state.rowsPerPage,
      shape: state.shape,
      color: state.color,
      origin: state.origin,
      intensity: state.intensity,
      fromPrice: clear ? price.minPrice : state.fromPrice,
      toPrice: clear ? price.maxPrice : state.toPrice,
      fromCts: clear ? carat.minCarat : state.fromCts,
      toCts: clear ? carat.maxCarat : state.toCts,
      // sortBy: state.sortBy,
    };

    let newFilterState = { ...appConfig.default_pagination_state };

    if (clear) {
      delete filter.fromCts;
      delete filter.toCts;
      delete filter.color;
      delete filter.shape;
      delete filter.toPrice;
      delete filter.fromPrice;
      delete filter.intensity;
      delete filter.origin;
    } else if (isNewFilter) {
      filter = _.merge(filter, newFilterState);
    }

    // ----------Get Colored Diamond Api------------
    setLoading(true);
    API.get(apiConfig.coloredDiamond, filter)
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
    // .finally(() => {
    //   if (openSearch === true) {
    //     setOpenSearch(false);
    //   }
    // });
  };

  // ------------------Get Shap API --------------------------------

  useEffect(() => {
    API.get(apiConfig.shapeList, { is_public_url: true })
      .then((res) => {
        setShapMaster(res);
      })
      .catch((err) => {
        HELPER.toaster.error(err)
      });
  }, []);

  // --------------------Shap Filter----------------------------
  let _sortOptionsShap = shapMaster.map((option) => ({
    label: option.shape,
    value: option.id,
  }));

  // ---------------Visiblility Colored Diamond Api----------------------

  const hiddenVisibleDiamond = (Id) => {
    API.put(apiConfig.visibility_gemstone.replace(":id", Id)).then((res) => {
      HELPER.toaster.success(res.message);
      paginate();
      setLoading(false);
    });
  };
  //------------ Delete Colored Diamond --------------

  const onClickDelete = (diamond_id) => {
    Swal.fire({
      title: "Are You Sure",
      text: "Are you sure to remove this Colored Diamond ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        API.destroy(`${apiConfig.gemstone}/${diamond_id}`)
          .then((res) => {
            HELPER.toaster.success("Deleted Successfully");
            paginate();
          })
          .catch((e) => HELPER.toaster.error(e.errors.message))
      }
    });
  };

  const getDataGemstone = (id) => {
    API.get(apiConfig.findGemstone.replace(":id", id)).then((res) => {
      setGemstoneData(res); // Update gemStoneData when fetching data
      setFindGemstone(true); // Open the modal when data is received
    });
  };

  // useEffect(() => {
  //   paginate();
  // }, []);

  useEffect(() => {
    paginate();
  }, [state.page, state.rowsPerPage]);

  const rows = useMemo(() => {
    return state.data.map((item) => {
      return {
        item: item,
        columns: [
          <span>{item.stockId}</span>,
          <div className="common-thead-second-width-title">
            <span>{item.title}</span>
          </div>,
          <span>{item.shapeName}</span>,
          <span>{item.carat}</span>,
          <span>{item.color}</span>,
          <span>{item.clarity}</span>,
          <span>{item.origin}</span>,
          <span>{item.intensity}</span>,
          <span>${item.price}</span>,
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

  // -------------togglePopupBulk --------------------
  const togglePopupBulk = () => {
    // if (bulkOpen) {
    //     setSelectedUserData(null);
    // }
    setBulkOpen(!bulkOpen);
  };

  // --------------------search --------------------
  const togglePopupSearch = () => {
    setOpenSearch(!openSearch);
  };

  // ----------------handel Edit--------------------------------
  const handleEdit = (data) => {
    setSelectedUserData(data);
    setOpen(true);
  };

  // --------------toggleGemstonePopup------------------
  const toggleGemstonePopup = () => {
    if (findGemstone) {
      setGemstoneData(null); // Reset gemStoneData when closing the modal
    }
    setFindGemstone(!findGemstone); // Toggle modal visibility
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
            <Breadcrumb
              routeSegments={[
                // { name: "Masters", path: pageRoutes.master.user.user },
                { name: "Colored Diamond" },
              ]}
            />
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
                  Add Colored Diamond Bulk
                </Button>
              </div>
            </div>

            {/* search Filter */}
            <SearchFilterDialog
              isOpen={openSearch}
              onClose={() => setOpenSearch(false)}
              reset={() => paginate(true)}
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
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <div>
                    <Select
                      placeholder="Select Shap Name"
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
                      label="Select Color"
                      placeholder="Select Color Name"
                      options={_colorOptions}
                      isMulti
                      value={_colorOptions.filter(
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
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr ",
                    alignItems: "center",
                    gap: "12px",
                  }}
                  className="text-input-top"
                >
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
                  <div>
                    <Select
                      placeholder="Select Intensity Name"
                      options={_intensityOptions}
                      isMulti
                      value={_intensityOptions.filter(
                        (option) =>
                          state.intensity &&
                          state.intensity.includes(option.value)
                      )}
                      onChange={(selectedSort) => {
                        const selectedIds = selectedSort.map(
                          (option) => option.value
                        );
                        changeState("intensity", selectedIds);
                      }}
                      name="choices-multi-default"
                      id="intensity"
                    />
                  </div>
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr ",
                    alignItems: "center",
                    gap: "12px 25px",
                  }}
                  className="text-input-top"
                >
                  <div>
                    <label className="label-class">Price :</label>
                    {/* <Slider
                      defaultValue={[
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
                    /> */}
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
                        style={{ margin: "0px 20px 0 20px", fontWeight: "500" }}
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
                    <label className="label-class">Carat :</label>
                    <Slider
                      value={[
                        state.fromCts === undefined
                          ? carat.minCarat
                          : state.fromCts,
                        state.toCts === undefined
                          ? carat.maxCarat
                          : state.toCts,
                      ]}
                      onChange={handleChangeCarat}
                      valueLabelDisplay="auto"
                      min={carat.minCarat}
                      max={carat.maxCarat}
                      step={0.01}
                    />
                    <div
                      style={{
                        display: "flex",
                        width: "100%",
                        alignItems: "center",
                      }}
                    >
                      <Textinput
                        className="form-control"
                        type="text"
                        id="minCost"
                        value={
                          state.fromCts === undefined
                            ? carat.minCarat
                            : state.fromCts
                        }
                        placeholder="Start Carat"
                        name="fromCts"
                        onChange={(e) =>
                          changeState("fromCts", parseFloat(e.target.value))
                        }
                        disabled={true}
                        style={{ width: "140px" }}
                      />
                      <span
                        style={{ margin: "0px 20px 0 20px", fontWeight: "500" }}
                      >
                        To
                      </span>
                      <Textinput
                        className="form-control "
                        type="text"
                        id="maxCost"
                        value={
                          state.toCts === undefined
                            ? carat.maxCarat
                            : state.toCts
                        }
                        placeholder="End Carat"
                        name="toCts"
                        onChange={(e) =>
                          changeState("toCts", parseFloat(e.target.value))
                        }
                        disabled={true}
                        style={{ width: "140px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </SearchFilterDialog>
          </Box>


          {/* pagination Table */}
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


          {/* single add Colored Diamond */}
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


          {/* add coloredDiamond Details added form */}
          {open && (
            <ColorDiamondMasterDetails
              open={open}
              togglePopup={() => {
                togglePopup();
                // paginate();
              }}
              callBack={() => paginate(true)}
              userData={selectedUserData}
            />
          )}

            {/* add coloredDiamond Bulk Details added form */}
          <ColorDiamondBulkMasterDetails
            open={bulkOpen}
            togglePopup={() => {
              togglePopupBulk();
              // paginate();
            }}
            callBack={() => paginate(true)}
            //   userData={selectedUserData}
          />

          {/*  Find One colored dimaond model open*/}
          <FindColoredModal
            open={findGemstone}
            togglePopup={() => {
              toggleGemstonePopup();
              // paginate();
            }}
            gemStoneData={gemStoneData}
            callBack={() => paginate(true)}
          />
        </Container>
      </div>
    </>
  );
};

export default ColorDiamondMaster;
