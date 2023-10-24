import React, { useEffect, useMemo, useState } from "react";
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
import Select from "react-select";
import error400cover from "../../../assets/no-data-found-page.png";
import _ from "lodash";
import DiamondBulkMasterDetails from "./DiamondBulkMasterDetails";
import SearchFilterDialog from "../../../components/UI/Dialog/SearchFilterDialog";
import DiamondMasterDetails from "./DiamondMasterDetails";
import Textinput from "../../../components/UI/TextInput";

const DiamondMaster = () => {
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [open, setOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [color, setColor] = useState([0, 1]);
  const [clarity, setClarity] = useState([0, 10]);
  const [cut, setCut] = useState([0, 5]);
  const [fluorescence, setFluorescence] = useState([0, 4]);
  const [symmetry, setSymmetry] = useState([0, 2]);
  const [polish, setPolish] = useState([0, 2]);
  const [price, setPrice] = useState([20, 665840]);
  const [carat, setCarat] = useState([0.05, 7.01]);
  const [depth, setDepth] = useState([0.26, 62.40]);
  const [table, setTable] = useState([50.00, 78.00]);
  const [shapMaster, setShapMaster] = useState([]);
  const [labMaster, setLabMaster] = useState([]);


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
  console.log('====================================');
  console.log(price);
  console.log('====================================');
  const { state, setState, changeState, ...otherTableActionProps } =
    usePaginationTable({
      shape: "",
      lab: "",
      fromPrice: 20,
      toPrice: 665840,
      fromCts: 0.05,
      toCts: 7.01,
      fromTable: 50.00,
      toTable: 78.00,
      fromDepth: 0.26,
      toDepth: 62.40,
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

      shape: "",
      fromPrice: 20,
      toPrice: 665840,
      fromCts: 0.05,
      toCts: 7.01,
      fromTable: 50.00,
      toTable: 78.00,
      fromDepth: 0.26,
      toDepth: 62.40,
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
      fromCts: state.fromCts,
      toCts: state.toCts,
      shape: state.shape,
      fromColor: state.fromColor,
      toColor: state.toColor,
      fromClarity: state.fromClarity,
      toClarity: state.toClarity,
      fromCut: state.fromCut,
      toCut: state.toCut,
      fromFlor: state.fromFlor,
      toFlor: state.toFlor,
      fromSym: state.fromSym,
      toSym: state.toSym,
      fromPolish: state.fromPolish,
      toPolish: state.toPolish,
      fromTable: state.fromTable,
      toTable: state.toTable,
      fromDepth: state.fromDepth,
      toDepth: state.toDepth,
      fromPrice: clear ? clearStates.fromPrice : state.fromPrice,
      toPrice: clear ? clearStates.toPrice : state.toPrice,
      lab: state.lab,
      sortByShape: state.sortByShape,
      sortByPrice: state.sortByPrice,
      sortByCarat: state.sortByCarat,
      sortByCut: state.sortByCut,
      sortByColor: state.sortByColor,
      sortByLab: state.sortByLab,
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

  useEffect(() => {
    API.get(apiConfig.shapeList, { is_public_url: true })
      .then((res) => {
        setShapMaster(res);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [])

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
  }, [])

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


  // ---------------color Filter----------------------
  const marksColor = [
    { value: 0, label: 'D' },
    { value: 1, label: 'E' },
    { value: 2, label: 'F' },
    { value: 3, label: 'G' },
    { value: 4, label: 'H' },
    { value: 5, label: 'I' },
    { value: 6, label: 'K' },
    { value: 7, label: 'L' },
    { value: 8, label: 'MN' },
    { value: 9, label: 'OP' }
  ]
  const handleChangeColor = (event, newValue) => {
    setColor(newValue);
    changeState("fromColor", marksColor[newValue[0]].value);
    changeState("toColor", marksColor[newValue[1]].value);
  };

  // ---------------Clarity Filter----------------------
  const marksClarity = [
    { value: 0, label: 'FL' },
    { value: 1, label: 'IF' },
    { value: 2, label: 'VVS1' },
    { value: 3, label: 'VVS2' },
    { value: 4, label: 'VS1' },
    { value: 5, label: 'VS2' },
    { value: 6, label: 'SI1' },
    { value: 7, label: 'SI2' },
    { value: 8, label: 'I1' },
    { value: 9, label: 'I2' },
    { value: 10, label: 'I3' },

  ]
  const handleChangeClarity = (event, newValue) => {
    setClarity(newValue);
    changeState("fromClarity", marksClarity[newValue[0]].value);
    changeState("toClarity", marksClarity[newValue[1]].value);
  };

  // ---------------Cut Filter----------------------
  const marksCut = [
    { value: 0, label: 'Super Ideal ' },
    { value: 1, label: 'Ideal' },
    { value: 2, label: 'Very_Good ' },
    { value: 3, label: 'Good' },
    { value: 4, label: 'Fair' },
    { value: 5, label: 'Poor' },
  ]

  const handleChangeCut = (event, newValue) => {
    setCut(newValue);
    changeState("fromCut", marksCut[newValue[0]].value);
    changeState("toCut", marksCut[newValue[1]].value);
  };

  // ---------------Fluorescence Filter----------------------
  const marksFluorescence = [
    { value: 0, label: 'None' },
    { value: 1, label: 'Faint ' },
    { value: 2, label: 'Medium  ' },
    { value: 3, label: 'Stong ' },
    { value: 4, label: 'Very Strong ' },
  ]

  const handleChangeFluorescence = (event, newValue) => {
    setFluorescence(newValue);
    changeState("fromFlor", marksFluorescence[newValue[0]].value);
    changeState("toFlor", marksFluorescence[newValue[1]].value);
  };

  // ---------------Symmetry Filter----------------------
  const marksSymmetry = [
    { value: 0, label: 'Excellent' },
    { value: 1, label: 'Very Good' },
    { value: 2, label: 'Good' },
  ]

  const handleChangeSymmetry = (event, newValue) => {
    setSymmetry(newValue);
    changeState("fromSym", marksSymmetry[newValue[0]].value);
    changeState("toSym", marksSymmetry[newValue[1]].value);
  };
  // ---------------Polish Filter----------------------

  const marksPolish = [
    { value: 0, label: 'Excellent' },
    { value: 1, label: 'Very Good' },
    { value: 2, label: 'Good' },
  ]

  const handleChangePolish = (event, newValue) => {
    setPolish(newValue);
    changeState("fromPolish", marksPolish[newValue[0]].value);
    changeState("toPolish", marksPolish[newValue[1]].value);
  };

  // ---------------Price Filter----------------------
  const handleChangePrice = (event, newValue) => {
    setPrice(newValue);
    changeState("fromPrice", newValue[0]);
    changeState("toPrice", newValue[1]);
  };

  // ---------------Carat Filter----------------------
  const handleChangeCarat = (event, newValue) => {
    setCarat(newValue);
    changeState("fromCts", newValue[0]);
    changeState("toCts", newValue[1]);
  };

  // ---------------Depth Filter----------------------
  const handleChangeDepth = (event, newValue) => {
    setDepth(newValue);
    changeState("fromDepth", newValue[0]);
    changeState("toDepth", newValue[1]);
  };

  // ---------------Table Filter----------------------
  const handleChangeTable = (event, newValue) => {
    setTable(newValue);
    changeState("fromTable", newValue[0]);
    changeState("toTable", newValue[1]);
  };

  const rows = useMemo(() => {
    return state.data.map((item) => {
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
              <div>
                <p>Shape</p>
                <Select
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
                />
              </div>
              <div>
                <p>Color</p>
                <Slider
                  value={color}
                  onChange={handleChangeColor}
                  aria-labelledby="track-inverted-slider"
                  marks={marksColor}
                  min={0}
                  max={10}
                  valueLabelDisplay="off"
                />
              </div>
              <div>
                <p>Clarity</p>
                <Slider
                  value={clarity}
                  onChange={handleChangeClarity}
                  aria-labelledby="track-inverted-slider"
                  marks={marksClarity}
                  min={0}
                  max={10}
                  valueLabelDisplay="off"
                />
              </div>
              <div>
                <p>Cut</p>
                <Slider
                  value={cut}
                  onChange={handleChangeCut}
                  aria-labelledby="track-inverted-slider"
                  marks={marksCut}
                  min={0}
                  max={5}
                  valueLabelDisplay="off"
                />
              </div>
              <div>
                <p>
                  Fluorescence</p>
                <Slider
                  value={fluorescence}
                  onChange={handleChangeFluorescence}
                  aria-labelledby="track-inverted-slider"
                  marks={marksFluorescence}
                  min={0}
                  max={4}
                  valueLabelDisplay="off"
                />
              </div>
              <div>
                <p>
                  Symmetry</p>
                <Slider
                  value={symmetry}
                  onChange={handleChangeSymmetry}
                  aria-labelledby="track-inverted-slider"
                  marks={marksSymmetry}
                  min={0}
                  max={2}
                  valueLabelDisplay="off"
                />
              </div>
              <div>
                <p>
                  Polish</p>
                <Slider
                  value={polish}
                  onChange={handleChangePolish}
                  aria-labelledby="track-inverted-slider"
                  marks={marksPolish}
                  min={0}
                  max={2}
                  valueLabelDisplay="off"
                />
              </div>
              <div>
                <p>Lab</p>
                <Select
                  placeholder="Select Lab Name"
                  options={_sortOptionsLab}
                  isMulti
                  value={_sortOptionsLab.filter((option) =>
                    state.lab.includes(option.value)
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
              <div>
                <p>price</p>
                <Slider
                  defaultValue={[20, 665840]}
                  onChange={handleChangePrice}
                  valueLabelDisplay="auto"
                  min={20}
                  max={665840}
                />
                <Textinput
                  className="form-control"
                  type="text"
                  id="minCost"
                  value={state.fromPrice}
                  placeholder="Start Price"
                  name="fromPrice"
                  onChange={(e) => changeState("fromPrice", e.target.value)}
                  readOnly
                  style={{ width: "350px" }}
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
                  value={state.toPrice}
                  placeholder="End Price"
                  name="toPrice"
                  onChange={(e) => changeState("toPrice", e.target.value)}
                  readOnly
                  style={{ width: "350px" }}
                />
              </div>

              <div>
                <p>Carat</p>
                <Slider
                  defaultValue={[0.1, 7.01]}
                  onChange={handleChangeCarat}
                  valueLabelDisplay="auto"
                  min={0.1}
                  max={7.01}
                  step={0.01}
                />
                <Textinput
                  className="form-control"
                  type="text"
                  id="minCost"
                  value={state.fromCts}
                  placeholder="Start Carat"
                  name="fromCts"
                  onChange={(e) => changeState("fromCts", parseFloat(e.target.value))}
                  readOnly
                  style={{ width: "350px" }}
                />
                <span style={{ margin: "0px 20px 0 20px", fontWeight: "500" }}>To</span>
                <Textinput
                  className="form-control "
                  type="text"
                  id="maxCost"
                  value={state.toCts}
                  placeholder="End Carat"
                  name="toCts"
                  onChange={(e) => changeState("toCts", parseFloat(e.target.value))}
                  readOnly
                  style={{ width: "350px" }}
                />
              </div>

              <div>
                <p>Depth</p>
                <Slider
                  defaultValue={[0.26, 62.40]}
                  onChange={handleChangeDepth}
                  valueLabelDisplay="auto"
                  min={0.26}
                  max={62.40}
                  step={0.01}
                />
                <Textinput
                  className="form-control"
                  type="text"
                  id="minCost"
                  value={state.fromDepth}
                  placeholder="Start Depth"
                  name="fromDepth"
                  onChange={(e) => changeState("fromDepth", parseFloat(e.target.value))}
                  readOnly
                  style={{ width: "350px" }}
                />
                <span style={{ margin: "0px 20px 0 20px", fontWeight: "500" }}>To</span>
                <Textinput
                  className="form-control "
                  type="text"
                  id="maxCost"
                  value={state.toDepth}
                  placeholder="End Depth"
                  name="toDepth"
                  onChange={(e) => changeState("toDepth", parseFloat(e.target.value))}
                  readOnly
                  style={{ width: "350px" }}
                />
              </div>

              <div>
                <p>Table</p>
                <Slider
                  defaultValue={[50.00, 78.00]}
                  onChange={handleChangeTable}
                  valueLabelDisplay="auto"
                  min={50.00}
                  max={78.00}
                  step={0.01}
                />
                <Textinput
                  className="form-control"
                  type="text"
                  id="minCost"
                  value={state.fromTable}
                  placeholder="Start Table"
                  name="fromTable"
                  onChange={(e) => changeState("fromTable", parseFloat(e.target.value))}
                  readOnly
                  style={{ width: "350px" }}
                />
                <span style={{ margin: "0px 20px 0 20px", fontWeight: "500" }}>To</span>
                <Textinput
                  className="form-control "
                  type="text"
                  id="maxCost"
                  value={state.toTable}
                  placeholder="End Table"
                  name="toTable"
                  onChange={(e) => changeState("toTable", parseFloat(e.target.value))}
                  readOnly
                  style={{ width: "350px" }}
                />
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
