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
import { pageRoutes } from "../../constants/routesList";
import Textinput from "../../components/UI/TextInput";
import ThemeSwitch from "../../components/UI/ThemeSwitch";
import SearchFilterDialog from "../../components/UI/Dialog/SearchFilterDialog";
import useDidMountEffect from "../../hooks/useDidMountEffect";
import { Breadcrumb, Container, StyledAddButton } from "../../components";
import ColorDiamondBulkMasterDetails from "./ColorDiamondBulkMasterDetails";
import ColorDiamondMasterDetails from "./ColorDiamondMasterDetails";

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

  // -------------------Get Price---------------------------------
  useEffect(() => {
    API.get(apiConfig.priceRange, { is_public_url: true })
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
  // -------------------Get Carat---------------------------------
  useEffect(() => {
    API.get(apiConfig.caratRange, { is_public_url: true })
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

  // -------------------Get intensity---------------------------------
  useEffect(() => {
    API.get(apiConfig.intensityRange, { is_public_url: true })
      .then((res) => {
        setIntensity(res);
      })
      .catch((err) => {
        console.error(err);
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
        console.error(err);
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
    { title: "stock No" },
    { title: "Title" },
    { title: "Description" },
    { title: "Carat" },
    { title: "Shape" },
    { title: "Color" },
    { title: "Clarity" },
    { title: "Origin" },
    { title: "Intensity" },
    { title: "MLength" },
    { title: "MWidth" },
    { title: "MDepth" },
    { title: "price" },
    { title: "isVisible" },
    { title: "Action" },
  ];

  const { state, setState, changeState, ...otherTableActionProps } =
    usePaginationTable({
      shape: "",
      color: "",
      sortBy: "newest",
      intensity: "",
      origin: "",
      fromPrice: price.minPrice,
      toPrice: price.maxPrice,
      fromCts: carat.minCarat,
      toCts: carat.maxCarat,
    });

  const paginate = (clear = false, isNewFilter = false) => {
    changeState("loader", true);
    let clearStates = {
      shape: "",
      origin: "",
      color: "",
      intensity: "",
      sortBy: "newest",

      ...appConfig.default_pagination_state,
    };

    let filter = {
      page: state.page,
      rowsPerPage: state.rowsPerPage,
      fromCts: state.fromCts,
      toCts: state.toCts,
      shape: state.shape,
      color: state.color,
      origin: state.origin,
      intensity: state.intensity,
      fromPrice: clear ? clearStates.fromPrice : state.fromPrice,
      toPrice: clear ? clearStates.toPrice : state.toPrice,
      sortBy: state.sortBy,
    };

    let newFilterState = { ...appConfig.default_pagination_state };

    if (clear) {
      filter = _.merge(filter, clearStates);
    } else if (isNewFilter) {
      filter = _.merge(filter, newFilterState);
    }

    // ----------Get Colored Diamong Api------------

    API.get(apiConfig.coloredDiamond, filter)
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
    });
  };
  //------------ Delete Colored Diamond --------------

  const onClickDelete = (diamond_id) => {
    Swal.fire({
      title: "Are You Sure",
      text: "Are you sure you want to remove this Colored Diamond ?",
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
          .catch(console.error);
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
          <span>{item.title}</span>,
          <span>{item.description}</span>,
          <span>{item.carat}</span>,
          <span>{item.shapeName}</span>,
          <span>{item.color}</span>,
          <span>{item.clarity}</span>,
          <span>{item.origin}</span>,
          <span>{item.intensity}</span>,
          <span>{item.mLength}</span>,
          <span>{item.mWidth}</span>,
          <span>{item.mDepth}</span>,
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
                { name: "Masters", path: pageRoutes.colorDiamond },
                { name: "Colored Diamond" },
              ]}
            />
            <div>
              <div>
                <Button variant="contained" onClick={togglePopupBulk}>
                  Add colored DiamondBulk
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
                <p>price</p>
                <Slider
                  defaultValue={[price.minPrice, price.maxPrice]}
                  onChange={handleChangePrice}
                  valueLabelDisplay="auto"
                  min={price.minPrice}
                  max={price.maxPrice}
                />
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
                  readOnly
                  style={{ width: "350px" }}
                />
                <span style={{ margin: "0px 20px 0 20px", fontWeight: "500" }}>
                  To
                </span>

                <Textinput
                  className="form-control "
                  type="text"
                  id="maxCost"
                  value={
                    state.toPrice === undefined ? price.maxPrice : state.toPrice
                  }
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
                  defaultValue={[carat.minCarat, carat.maxCarat]}
                  onChange={handleChangeCarat}
                  valueLabelDisplay="auto"
                  min={carat.minCarat}
                  max={carat.maxCarat}
                  step={0.01}
                />
                <Textinput
                  className="form-control"
                  type="text"
                  id="minCost"
                  value={
                    state.fromCts === undefined ? carat.minCarat : state.fromCts
                  }
                  placeholder="Start Carat"
                  name="fromCts"
                  onChange={(e) =>
                    changeState("fromCts", parseFloat(e.target.value))
                  }
                  readOnly
                  style={{ width: "350px" }}
                />
                <span style={{ margin: "0px 20px 0 20px", fontWeight: "500" }}>
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
                  readOnly
                  style={{ width: "350px" }}
                />
              </div>

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
              <div className="text-input-top">
                <Select
                  label="Select Color"
                  placeholder="Select Color name"
                  options={_colorOptions}
                  isMulti
                  value={_colorOptions.filter((option) =>
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
                />
              </div>
              <div className="text-input-top">
                <Select
                  label="Select Origin"
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
                />
              </div>
              <div>
                <p>Intensity</p>
                <Select
                  placeholder="Select Intensity Name"
                  options={_intensityOptions}
                  isMulti
                  value={_intensityOptions.filter((option) =>
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
          <ColorDiamondMasterDetails
            open={open}
            togglePopup={() => {
              togglePopup();
              paginate();
            }}
            callBack={() => paginate(true)}
            userData={selectedUserData}
          />
          <ColorDiamondBulkMasterDetails
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

export default ColorDiamondMaster;
