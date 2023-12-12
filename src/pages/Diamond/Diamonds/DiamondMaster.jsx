import React, { useEffect, useMemo, useState } from "react";
import { apiConfig, appConfig } from "../../../config";
import { Breadcrumb, Container, StyledAddButton } from "../../../components";
import { Box, Button, Icon, IconButton, Slider, Tooltip } from "@mui/material";
import ThemeSwitch from "../../../components/UI/ThemeSwitch";
import PaginationTable, {
  usePaginationTable,
} from "../../../components/UI/Pagination/PaginationTable";
import { API, HELPER } from "../../../services";
import Swal from "sweetalert2";
import Select from "react-select";
import error400cover from "../../../assets/no-data-found-page.png";
import _ from "lodash";
import DiamondBulkMasterDetails from "./DiamondBulkMasterDetails";
import SearchFilterDialog from "../../../components/UI/Dialog/SearchFilterDialog";
import DiamondMasterDetails from "./DiamondMasterDetails";
import Textinput from "../../../components/UI/TextInput";
import FindDiamondModal from "./findDiamondMoal";

const DiamondMaster = () => {
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [open, setOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [shapMaster, setShapMaster] = useState([]);
  const [labMaster, setLabMaster] = useState([]);
  const [carat, setCarat] = useState([]);
  const [price, setPrice] = useState([]);
  const [table, setTable] = useState([]);
  const [depth, setDepth] = useState([]);
  const [loading, setLoading] = useState();
  const [findDiamond, setFindDiamond] = useState(false);
  const [gemDiamondData, setDiamondData] = useState(null);

  // ------------------ Pagination code ----------
  const COLUMNS = [
    { title: "Stock No", classNameWidth: "thead-second-width-stone" },
    { title: "Shape", classNameWidth: "thead-second-width-address" },
    { title: "Carat", classNameWidth: "thead-second-width-address" },
    { title: "Cut", classNameWidth: "thead-second-width-address" },
    { title: "Color", classNameWidth: "thead-second-width-address" },
    { title: "Clarity", classNameWidth: "thead-second-width-address" },
    { title: "Polish", classNameWidth: "thead-second-width-address" },
    { title: "Symmetry", classNameWidth: "thead-second-width-address" },
    { title: "Origin", classNameWidth: "thead-second-width-address" },
    { title: "Lab", classNameWidth: "thead-second-width-address" },
    { title: "Price", classNameWidth: "thead-second-width-address" },
    { title: "Is Visible", classNameWidth: "thead-second-width-action-carat" },
    {
      title: "Action",
      classNameWidth: "thead-second-width-discount action-center",
    },
  ];

  // toggleGemstonePopup gemstone model open
  const toggleGemstonePopup = () => {
    if (findDiamond) {
      setDiamondData(null); // Reset gemStoneData when closing the modal
    }
    setFindDiamond(!findDiamond); // Toggle modal visibility
  };

  // diamond detail get by single
  const getDataDiamond = (id) => {
    API.get(apiConfig.findDiamond.replace(":id", id)).then((res) => {
      setDiamondData(res); // Update gemStoneData when fetching data
      setFindDiamond(true); // Open the modal when data is received
    });
  };

  const {
    state,
    setState,
    getInitialStates,
    changeState,
    ...otherTableActionProps
  } = usePaginationTable({});

  // paginate code
  const paginate = (clear = false, isNewFilter = false) => {
    changeState("loader", true);
    let clearStates = {
      ...appConfig.default_pagination_state,
    };

    let filter = {
      page: state.page,
      rowsPerPage: state.rowsPerPage,
      fromCts: state.fromCts,
      toCts: state.toCts,
      shape: state.shape,
      fromColor: clear ? clearStates.fromColor : state.fromColor,
      toColor: clear ? clearStates.toColor : state.toColor,
      fromClarity: clear ? clearStates.fromClarity : state.fromClarity,
      toClarity: clear ? clearStates.toClarity : state.toClarity,
      fromCut: clear ? clearStates.fromCut : state.fromCut,
      toCut: clear ? clearStates.toCut : state.toCut,
      fromFlor: clear ? clearStates.fromFlor : state.fromFlor,
      toFlor: clear ? clearStates.toFlor : state.toFlor,
      fromSym: clear ? clearStates.fromSym : state.fromSym,
      toSym: clear ? clearStates.toSym : state.toSym,
      fromPolish: clear ? clearStates.fromPolish : state.fromPolish,
      toPolish: clear ? clearStates.toPolish : state.toPolish,
      fromTable: clear ? clearStates.fromTable : state.fromTable,
      toTable: clear ? clearStates.toTable : state.toTable,
      fromDepth: clear ? clearStates.fromDepth : state.fromDepth,
      toDepth: clear ? clearStates.toDepth : state.toDepth,
      fromPrice: clear ? clearStates.fromPrice : state.fromPrice,
      toPrice: clear ? clearStates.toPrice : state.toPrice,
      lab: state.lab,
    };

    let newFilterState = { ...appConfig.default_pagination_state };

    if (clear) {
      delete filter.fromCts;
      delete filter.toCts;
      delete filter.shape;
      delete filter.fromColor;
      delete filter.toColor;
      delete filter.fromTable;
      delete filter.toTable;
      delete filter.fromDepth;
      delete filter.toDepth;
      delete filter.fromPrice;
      delete filter.toPrice;
      delete filter.lab;
      delete filter.fromClarity;
      delete filter.toClarity;
      delete filter.fromCut;
      delete filter.toCut;
      delete filter.fromFlor;
      delete filter.toFlor;
      delete filter.fromSym;
      delete filter.toSym;
      delete filter.fromPolish;
      delete filter.toPolish;
      delete filter.fromDepth;
      delete filter.toDepth;
      delete filter.fromTable;
      delete filter.toTable;
    } else if (isNewFilter) {
      filter = _.merge(filter, newFilterState);
    }
    // ----------Get Diamong Api------------
    setLoading(true);

    API.get(apiConfig.diamonds, filter)
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

  // --------------------Shap Filter----------------------------
  let _sortOptionsShap = shapMaster.map((option) => ({
    label: option.shape,
    value: option.id,
  }));

  // ------------------Get Lab API --------------------------------

  useEffect(() => {
    API.get(apiConfig.labList, { is_public_url: true })
      .then((res) => {
        setLabMaster(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // ------------------ Lab Filter --------------------------------

  let _sortOptionsLab = labMaster.map((option) => ({
    label: option.labName,
    value: option.id,
  }));

  // ---------------Visiblility Diamond Api----------------------

  const hiddenVisibleDiamond = (Id) => {
    API.put(apiConfig.visibility_diamond.replace(":id", Id)).then((res) => {
      HELPER.toaster.success(res.message);
      paginate();
      setLoading(false);
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

  useEffect(() => {
    paginate();
  }, [state.page, state.rowsPerPage]);

  // ---------------color Filter----------------------
  const marksColor = [
    { value: 0, label: "D" },
    { value: 1, label: "E" },
    { value: 2, label: "F" },
    { value: 3, label: "G" },
    { value: 4, label: "H" },
    { value: 5, label: "I" },
    { value: 6, label: "K" },
    { value: 7, label: "L" },
    { value: 8, label: "MN" },
    { value: 9, label: "OP" },
  ];
  const handleChangeColor = (event, newValue) => {
    changeState("fromColor", marksColor[newValue[0]].value);
    changeState("toColor", marksColor[newValue[1]].value);
  };

  // ---------------Clarity Filter----------------------
  const marksClarity = [
    { value: 0, label: "FL" },
    { value: 1, label: "IF" },
    { value: 2, label: "VVS1" },
    { value: 3, label: "VVS2" },
    { value: 4, label: "VS1" },
    { value: 5, label: "VS2" },
    { value: 6, label: "SI1" },
    { value: 7, label: "SI2" },
    { value: 8, label: "I1" },
    { value: 9, label: "I2" },
    { value: 10, label: "I3" },
  ];
  const handleChangeClarity = (event, newValue) => {
    changeState("fromClarity", marksClarity[newValue[0]].value);
    changeState("toClarity", marksClarity[newValue[1]].value);
  };

  // ---------------Cut Filter----------------------
  const marksCut = [
    { value: 0, label: "Super Ideal " },
    { value: 1, label: "Ideal" },
    { value: 2, label: "Very_Good " },
    { value: 3, label: "Good" },
    { value: 4, label: "Fair" },
    { value: 5, label: "Poor" },
  ];

  const handleChangeCut = (event, newValue) => {
    changeState("fromCut", marksCut[newValue[0]].value);
    changeState("toCut", marksCut[newValue[1]].value);
  };

  // ---------------Fluorescence Filter----------------------
  const marksFluorescence = [
    { value: 0, label: "None" },
    { value: 1, label: "Faint " },
    { value: 2, label: "Medium  " },
    { value: 3, label: "Stong " },
    { value: 4, label: "Very Strong " },
  ];

  const handleChangeFluorescence = (event, newValue) => {
    changeState("fromFlor", marksFluorescence[newValue[0]].value);
    changeState("toFlor", marksFluorescence[newValue[1]].value);
  };

  // ---------------Symmetry Filter----------------------
  const marksSymmetry = [
    { value: 0, label: "Excellent" },
    { value: 1, label: "Very Good" },
    { value: 2, label: "Good" },
  ];

  const handleChangeSymmetry = (event, newValue) => {
    changeState("fromSym", marksSymmetry[newValue[0]].value);
    changeState("toSym", marksSymmetry[newValue[1]].value);
  };
  // ---------------Polish Filter----------------------

  const marksPolish = [
    { value: 0, label: "Excellent" },
    { value: 1, label: "Very Good" },
    { value: 2, label: "Good" },
  ];

  const handleChangePolish = (event, newValue) => {
    changeState("fromPolish", marksPolish[newValue[0]].value);
    changeState("toPolish", marksPolish[newValue[1]].value);
  };

  // -------------------Get Carat---------------------------------
  useEffect(() => {
    API.get(apiConfig.diamondCaratRange, { is_public_url: true })
      .then((res) => {
        setCarat(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  // ---------------Carat Filter----------------------
  const handleChangeCarat = (event, newValue) => {
    changeState("fromCts", newValue[0]);
    changeState("toCts", newValue[1]);
  };

  // -------------------Get Price---------------------------------
  useEffect(() => {
    API.get(apiConfig.diamondPriceRange, { is_public_url: true })
      .then((res) => {
        setPrice(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  // ---------------Price Filter----------------------
  const handleChangePrice = (event, newValue) => {
    changeState("fromPrice", newValue[0]);
    changeState("toPrice", newValue[1]);
  };
  // ---------------Depth Filter----------------------
  useEffect(() => {
    API.get(apiConfig.diamondDepthRange, { is_public_url: true })
      .then((res) => {
        setDepth(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  const handleChangeDepth = (event, newValue) => {
    changeState("fromDepth", newValue[0]);
    changeState("toDepth", newValue[1]);
  };

  // ---------------Table Filter----------------------
  useEffect(() => {
    API.get(apiConfig.diamondTableRange, { is_public_url: true })
      .then((res) => {
        setTable(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);
  const handleChangeTable = (event, newValue) => {
    changeState("fromTable", newValue[0]);
    changeState("toTable", newValue[1]);
  };
  const rows = useMemo(() => {
    return state.data.map((item) => {
      return {
        item: item,
        columns: [
          <span>{item.stockId}</span>,
          <span>{item.shapeName}</span>,
          <span>{item.carat}</span>,
          <span>{appConfig.D_Cut[item.cut]}</span>,
          <span>{appConfig.D_Color[item.color]}</span>,
          <span>{appConfig.D_Clarity[item.clarity]}</span>,
          <span>{appConfig.D_Polish[item.polish]}</span>,
          <span>{appConfig.D_Symmetry[item.symmetry]}</span>,
          <span>{item.origin}</span>,
          <span>{item.labName}</span>,
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
            <IconButton onClick={(e) => getDataDiamond(item.id)}>
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
            <Breadcrumb routeSegments={[{ name: "Diamonds" }]} />
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
                  Add Diamond Bulk
                </Button>
              </div>
            </div>
            <SearchFilterDialog
              isOpen={openSearch}
              onClose={() => setOpenSearch(false)}
              reset={() => paginate(true)}
              search={() => {
                paginate(false, true);
                setOpenSearch(false);
              }}
              loader={loading}
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
              <div className="text-input-top">
                <Select
                  placeholder="Select Lab Name"
                  options={_sortOptionsLab}
                  isMulti
                  value={_sortOptionsLab.filter(
                    (option) => state.lab && state.lab.includes(option.value)
                  )}
                  onChange={(selectedSort) => {
                    const selectedIds = selectedSort.map(
                      (option) => option.value
                    );
                    changeState("lab", selectedIds);
                  }}
                  name="choices-multi-default"
                  id="lab"
                />
              </div>
              <div className="text-input-top" style={{ padding: "0px 18px" }}>
                <label className="label-class">Color :</label>
                <Slider
                  value={[
                    state.fromColor === undefined || state.fromColor === ""
                      ? 0
                      : state.fromColor,
                    state.toColor === undefined || state.toColor === ""
                      ? 9
                      : state.toColor,
                  ]}
                  onChange={handleChangeColor}
                  aria-labelledby="track-inverted-slider"
                  marks={marksColor}
                  min={0}
                  max={9}
                  valueLabelDisplay="off"
                />
              </div>
              <div className="text-input-top" style={{ padding: "0px 18px" }}>
                <label className="label-class">Clarity :</label>
                <Slider
                  value={[
                    state.fromClarity === undefined || state.fromClarity === ""
                      ? 0
                      : state.fromClarity,
                    state.toClarity === undefined || state.toClarity === ""
                      ? 10
                      : state.toClarity,
                  ]}
                  onChange={handleChangeClarity}
                  aria-labelledby="track-inverted-slider"
                  marks={marksClarity}
                  min={0}
                  max={10}
                  valueLabelDisplay="off"
                />
              </div>
              <div className="text-input-top" style={{ padding: "0px 18px" }}>
                <label className="label-class">Cut :</label>
                <Slider
                  value={[
                    state.fromCut === undefined || state.fromCut === ""
                      ? 0
                      : state.fromCut,
                    state.toCut === undefined || state.toCut === ""
                      ? 6
                      : state.toCut,
                  ]}
                  onChange={handleChangeCut}
                  aria-labelledby="track-inverted-slider"
                  marks={marksCut}
                  min={0}
                  max={5}
                  valueLabelDisplay="off"
                />
              </div>
              <div className="text-input-top" style={{ padding: "0px 18px" }}>
                <label className="label-class">Fluorescence :</label>
                <Slider
                  value={[
                    state.fromFlor === undefined || state.fromFlor === ""
                      ? 0
                      : state.fromFlor,
                    state.toFlor === undefined || state.toFlor === ""
                      ? 4
                      : state.toFlor,
                  ]}
                  onChange={handleChangeFluorescence}
                  aria-labelledby="track-inverted-slider"
                  marks={marksFluorescence}
                  min={0}
                  max={4}
                  valueLabelDisplay="off"
                />
              </div>
              <div className="text-input-top" style={{ padding: "0px 18px" }}>
                <label className="label-class">Symmetry :</label>
                <Slider
                  value={[
                    state.fromSym === undefined || state.fromSym === ""
                      ? 0
                      : state.fromSym,
                    state.toSym === undefined || state.toSym === ""
                      ? 2
                      : state.toSym,
                  ]}
                  onChange={handleChangeSymmetry}
                  aria-labelledby="track-inverted-slider"
                  marks={marksSymmetry}
                  min={0}
                  max={2}
                  valueLabelDisplay="off"
                />
              </div>
              <div className="text-input-top" style={{ padding: "0px 18px" }}>
                <label className="label-class">Polish :</label>
                <Slider
                  value={[
                    state.fromPolish === undefined || state.fromPolish === ""
                      ? 0
                      : state.fromPolish,
                    state.toPolish === undefined || state.toPolish === ""
                      ? 2
                      : state.toPolish,
                  ]}
                  onChange={handleChangePolish}
                  aria-labelledby="track-inverted-slider"
                  marks={marksPolish}
                  min={0}
                  max={2}
                  valueLabelDisplay="off"
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr ",
                  alignItems: "center",
                  gap: "12px 25px",
                  padding: "0 10px",
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
                      className="form-control"
                      type="text"
                      id="minCost"
                      value={
                        state.fromPrice === undefined
                          ? price.minPrice
                          : state.fromPrice
                      }
                      placeholder="Start Price"
                      name="fromPrice"
                      onChange={(e) => changeState("fromPrice", e.target.value)}
                      disabled={true}
                      style={{ width: "140px" }}
                    />
                    <span
                      style={{ margin: "0px 10px 0 12px", fontWeight: "500" }}
                    >
                      To
                    </span>

                    <Textinput
                      className="form-control "
                      type="text"
                      id="maxCost"
                      value={
                        state.toPrice === undefined
                          ? price.maxPrice
                          : state.toPrice
                      }
                      placeholder="End Price"
                      name="toPrice"
                      onChange={(e) => changeState("toPrice", e.target.value)}
                      disabled={true}
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
                      state.toCts === undefined ? carat.maxCarat : state.toCts,
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
                      style={{ margin: "0px 10px 0 12px", fontWeight: "500" }}
                    >
                      To
                    </span>
                    <Textinput
                      className="form-control "
                      type="text"
                      id="maxCost"
                      value={
                        state.toCts === undefined ? carat.maxCarat : state.toCts
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

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr ",
                  alignItems: "center",
                  gap: "12px 25px",
                  padding: "0 10px",
                }}
                className="text-input-top"
              >
                <div>
                  <label className="label-class">Depth :</label>
                  <Slider
                    value={[
                      state.fromDepth === undefined || state.fromDepth === ""
                        ? depth.minDepth
                        : state.fromDepth,
                      state.toDepth === undefined || state.toDepth === ""
                        ? depth.maxDepth
                        : state.toDepth,
                    ]}
                    onChange={handleChangeDepth}
                    valueLabelDisplay="auto"
                    min={depth.minDepth}
                    max={depth.maxDepth}
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
                        state.fromDepth === undefined
                          ? depth.minDepth
                          : state.fromDepth
                      }
                      placeholder="Start Depth"
                      name="fromDepth"
                      onChange={(e) =>
                        changeState("fromDepth", parseFloat(e.target.value))
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
                        state.toDepth === undefined
                          ? depth.maxDepth
                          : state.toDepth
                      }
                      placeholder="End Depth"
                      name="toDepth"
                      onChange={(e) =>
                        changeState("toDepth", parseFloat(e.target.value))
                      }
                      disabled={true}
                      style={{ width: "140px" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="label-class">Table :</label>
                  <Slider
                    value={[
                      state.fromTable === undefined || state.fromTable === ""
                        ? table.minTable
                        : state.fromTable,
                      state.toTable === undefined || state.toTable === ""
                        ? table.maxTable
                        : state.toTable,
                    ]}
                    onChange={handleChangeTable}
                    valueLabelDisplay="auto"
                    min={table.minTable}
                    max={table.maxTable}
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
                        state.fromTable === undefined
                          ? table.minTable
                          : state.fromTable
                      }
                      placeholder="Start Table"
                      name="fromTable"
                      onChange={(e) =>
                        changeState("fromTable", parseFloat(e.target.value))
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
                        state.toTable === undefined
                          ? table.maxTable
                          : state.toTable
                      }
                      placeholder="End Table"
                      name="toTable"
                      onChange={(e) =>
                        changeState("toTable", parseFloat(e.target.value))
                      }
                      disabled={true}
                      style={{ width: "140px" }}
                    />
                  </div>
                </div>
              </div>
            </SearchFilterDialog>
          </Box>
          {/* PaginationTable code define */}
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

          {/* Diamond Master Details Modal */}
          {open && (
            <DiamondMasterDetails
              open={open}
              togglePopup={() => {
                togglePopup();
                // paginate();
              }}
              callBack={() => paginate(true)}
              userData={selectedUserData}
            />
          )}

          {/* Find Diamond Modal */}
          <FindDiamondModal
            open={findDiamond}
            togglePopup={() => {
              toggleGemstonePopup();
              // paginate();
            }}
            gemDiamondData={gemDiamondData}
            callBack={() => paginate(true)}
          />

          {/* Diamond Bulk Master Details Modal */}
          {bulkOpen && (
            <DiamondBulkMasterDetails
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

export default DiamondMaster;
