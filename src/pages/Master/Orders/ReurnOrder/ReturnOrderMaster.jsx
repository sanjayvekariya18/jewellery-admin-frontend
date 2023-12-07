import React, { useEffect, useMemo, useState } from "react";
import PaginationTable, {
  usePaginationTable,
} from "../../../../components/UI/Pagination/PaginationTable";
import { API, HELPER } from "../../../../services";
import { apiConfig, appConfig } from "../../../../config";
import { Breadcrumb, Container } from "../../../../components";
import _ from "lodash";
import {
  Box,
  Button,
  Checkbox,
  Icon,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchFilterDialog from "../../../../components/UI/Dialog/SearchFilterDialog";
import error400cover from "../../../../assets/no-data-found-page.png";
import ReactSelect from "../../../../components/UI/ReactSelect";
import momentTimezone from "moment-timezone";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import "flatpickr/dist/themes/airbnb.css";
import MaxHeightMenu from "../../../../components/MaxHeightMenu";
import { pageRoutes } from "../../../../constants/routesList";
import moment from "moment-timezone";
import ReturnRejectMaster from "./ReturnRejectMaster";
import RefundAmountReturnOrder from "./RefundAmountReturnOrder";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import { Col, Row } from "reactstrap";
import { checkFileType, setImageSrc } from "../../../../services/helper";

const ReturnOrderMaster = () => {
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [refundAmountCancel, setRefundAmountCancel] = useState(null);
  const [openSearch, setOpenSearch] = useState(false);
  const [open, setOpen] = useState(false);
  const [refundAmount, setRefundAmount] = useState(false);
  const [dropDown, setDropDown] = useState([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [statuses, setStatuses] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isShowReturnOrderFiles, setIsShowReturnOrderFiles] = useState(false);
  const [returnProductFiles, setReturnProductFiles] = useState([]);

  const [filter, setFilter] = useState({
    returnOrderStatus: "request",
  });

  const [textModal, setTextModal] = useState(false);
  const [addressText, setAddressText] = useState("");
  const textModaltoggle = () => {
    setTextModal(!textModal);
  };

  // ----Pagination code------
  const COLUMNS = [
    filter.returnOrderStatus === "request" ||
      filter.returnOrderStatus === "approve" ||
      filter.returnOrderStatus === "receive" ||
      (filter.returnOrderStatus !== "verified" &&
        filter.returnOrderStatus !== "reject" &&
        filter.returnOrderStatus !== "refund")
      ? {
        title: "Select Order",
        order: false,
        field: "totalReturnProducts",
        classNameWidth: "thead-second-width-address",
      }
      : {
        title: "",
        order: false,
        field: "",
        classNameWidth: "thead-width-zero",
      },
    {
      title: "Order No",
      order: false,
      field: "orderNo",
      classNameWidth: "thead-second-width-stone",
    },
    {
      title: "Type",
      order: false,
      field: "",
      classNameWidth: "thead-second-width-stone",
    },
    {
      title: "Title",
      order: false,
      field: "title",
      classNameWidth: "thead-second-width-title-answer",
    },
    {
      title: "Price",
      order: false,
      field: "totalPrice",
      classNameWidth: "thead-second-width-stone",
    },
    {
      title: "Reject Reason",
      order: false,
      field: "returnReason",
      classNameWidth: "thead-second-width-stock-numbers",
    },
    {
      title: "Return Date",
      order: true,
      field: "createdAt",
      classNameWidth: "thead-second-width-stock-numbers",
    },
    filter.returnOrderStatus === "refund"
      ? {
        title: "Refund Date",
        order: false,
        field: "refundDate",
        classNameWidth: "thead-second-width-stock-numbers",
      }
      : {
        title: "",
        order: false,
        field: "",
        classNameWidth: "thead-second-width-stock-numbers",
      },
    filter.returnOrderStatus === "refund"
      ? {
        title: "Refund Amount",
        order: false,
        field: "refundAmount",
        classNameWidth: "thead-second-width-stock-numbers-refundAmount",
      }
      : {
        title: "",
        order: false,
        field: "",
        classNameWidth: "thead-width-zero",
      },
    filter.returnOrderStatus === "delivered"
      ? {
        title: "Total Return Products",
        order: false,
        field: "totalReturnProducts",
        classNameWidth: "thead-second-width-stock-numbers",
      }
      : {
        title: "",
        order: false,
        field: "",
        classNameWidth: "thead-width-zero",
      },
    {
      title: "Action",
      order: false,
      field: "",
      classNameWidth: "thead-second-width-stock-numbers",
    },
  ];

  // --------------------------------------- paginate  the results-------------------------
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

    //      ------filters --------------------------------
    let filterData = {
      from_date:
        !clear && dateRange[0]
          ? momentTimezone
            .tz(
              dateRange[0],
              Intl.DateTimeFormat().resolvedOptions().timeZone
            )
            .format(appConfig.dateDisplayEditFormat)
          : null,
      to_date:
        !clear && dateRange[1]
          ? momentTimezone
            .tz(
              dateRange[1],
              Intl.DateTimeFormat().resolvedOptions().timeZone
            )
            .format(appConfig.dateDisplayEditFormat)
          : null,
      page: state.page,
      rowsPerPage: state.rowsPerPage,
      order: clear ? clearStates.order : state.order,
      orderBy: clear ? clearStates.orderby : state.orderby,
      orderNoArr: state.orderNoArr,
      stockIds: state.stockIds,
      ...filter,
    };

    let newFilterState = { ...appConfig.default_pagination_state };
    if (clear) {
      delete filterData.from_date;
      delete filterData.to_date;
      delete filterData.orderNoArr;
      delete filterData.stockIds;
      setDateRange([null, null]);
    } else if (isNewFilter) {
      filterData = _.merge(filterData, newFilterState);
    }

    // ----------Get Order Api------------
    setLoading(true);
    API.get(apiConfig.returnOrder, filterData)
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
        setStatuses(res.statuses);
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

  // ----------------multiple checkBox select code ----------------
  const handleCheckbox = (itemId) => {
    setSelectedCheckboxes((prevSelectedCheckboxes) => {
      if (
        prevSelectedCheckboxes.some((selectedItem) => selectedItem === itemId)
      ) {
        // If the checkbox is checked, disable the ReactSelect
        return prevSelectedCheckboxes.filter(
          (selectedItem) => selectedItem !== itemId
        );
      } else {
        // If the checkbox is unchecked, enable the ReactSelect
        return [...prevSelectedCheckboxes, itemId];
      }
    });
  };
  const refundAmountOrder = (data) => {
    setRefundAmountCancel(data);
    setRefundAmount(true);
  };

  const generateProductField = (product, type) => {
    const _mergeField = (product, gemstone, diamond, _type) => {
      let _field = '';

      if (_type == 'price') {
        _field += '$'
      }

      if (product) {
        _field += `${product}`

        if (gemstone || diamond) {
          _field += '<br />'
        }
      }

      return `${_field}${gemstone}${diamond}`
    }

    switch (type) {
      case "type":
        let type = ''

        if ((product.ProductVariant && product.Diamond) || (product.ProductVariant && product.Gemstone) || product.ProductVariant) {
          type = 'Jewellery'
        } else if (product.Diamond) {
          type = 'Diamond'
        } else if (product.Gemstone) {
          type = 'Gemstone'
        }

        return type;

      case "title":
        let title = product.ProductVariant
          ? product.ProductVariant.title
          : "";
        let diamondDetails = "";
        let gemstoneTitle = "";

        if (product.ProductVariant && product.Diamond) {
          diamondDetails = `(${product.Diamond.carat} Carat ${product.Diamond.ShapeMaster
            ? product.Diamond.ShapeMaster.shape
            : ""
            } Diamond)`;
        } else if (product.ProductVariant && product.Gemstone) {
          gemstoneTitle = product.Gemstone
            ? `(${product.Gemstone.title} Gemstone)`
            : "";
        } else if (product.Diamond) {
          diamondDetails = `${product.Diamond.carat} Carat ${product.Diamond.ShapeMaster
            ? product.Diamond.ShapeMaster.shape
            : ""
            } Diamond`;
        } else if (product.Gemstone) {
          gemstoneTitle = product.Gemstone
            ? `${product.Gemstone.title} Gemstone`
            : "";
        }

        return _mergeField(title, gemstoneTitle, diamondDetails, 'title');

      case "price":
        let priceVariant = product.ProductVariant
          ? product.ProductVariant.totalPrice
          : "";
        let gemstonePrice = "";
        let diamondPrice = "";

        if (product.ProductVariant && product.Diamond) {
          diamondPrice = `($${product.Diamond.price || 0})`;
        } else if (product.ProductVariant && product.Gemstone) {
          gemstonePrice = `($${product.Gemstone.price || 0})`;
        } else if (product.Diamond) {
          diamondPrice = product.Diamond.price || 0;
        } else if (product.Gemstone) {
          gemstonePrice = product.Gemstone.price || 0;
        }

        return _mergeField(priceVariant, gemstonePrice, diamondPrice, 'price')

      default:
        break;
    }
  };

  useEffect(() => {
    paginate();
  }, [
    state.page,
    state.rowsPerPage,
    filter,
    state.order,
    state.orderby,
  ]);

  const rows = useMemo(() => {
    return state.data.map((item) => {
      return {
        item: item,
        columns: [
          <span>
            {(filter.returnOrderStatus === "request" ||
              filter.returnOrderStatus === "approve" ||
              filter.returnOrderStatus === "receive" ||
              (filter.returnOrderStatus !== "verified" &&
                filter.returnOrderStatus !== "refund" &&
                filter.returnOrderStatus !== "reject")) && (
                <Checkbox
                  checked={selectedCheckboxes.some(
                    (selectedItem) => selectedItem === item.id
                  )}
                  onChange={() => handleCheckbox(item.id)}
                  color="primary"
                />
              )}
          </span>,
          <div className="span-permision">
            <span>{item.order.orderNo}</span>
          </div>,
          <div className="span-permision">
            <span>{generateProductField(item.OrderProduct, 'type')}</span>
          </div>,
          <span dangerouslySetInnerHTML={{ __html: generateProductField(item.OrderProduct, 'title') }} >
          </span>,
          <span dangerouslySetInnerHTML={{ __html: generateProductField(item.OrderProduct, 'price') }}>
          </span>
          ,

          <div style={{ width: "80px" }}>
            <Button
              color="primary"
              variant="contained"
              onClick={() => showAddressInDialog(item)}
              sx={{ width: "100%", borderRadius: 1 }}
            >
              View
            </Button>
          </div>,
          <span>
            {moment(item.createdAt).format(appConfig.dateAndTimeDisplayFormat)}
          </span>,
          <span>
            {filter.returnOrderStatus === "refund" &&
              item.refundDate &&
              moment(item.refundDate).format(
                appConfig.dateAndTimeDisplayFormat
              )}
          </span>,
          <div className="thead-second-width-stock-numbers-refundAmount">
            <span>
              {filter.returnOrderStatus === "refund" && item.refundAmount}
            </span>
          </div>,

          <span>
            {filter.returnOrderStatus === "verified" ? (
              <MaxHeightMenu
                optionsMenu={[
                  {
                    key: "Refund Amount",
                    color: "green",
                    icon: "check_circle",
                    onClick: () => refundAmountOrder(item.id),
                  },
                  {
                    key: "View Files",
                    color: "green",
                    icon: "article",
                    onClick: () => {
                      if (!HELPER.isEmpty(item.file)) {
                        setReturnProductFiles(item.file)
                        setIsShowReturnOrderFiles(true)
                      }
                    },
                  },
                ]}
              />
            ) : (
              <span>
                <Tooltip title={'View Return Order Files'} placement="top">
                  <IconButton onClick={() => {
                    if (!HELPER.isEmpty(item.file)) {
                      setReturnProductFiles(item.file)
                      setIsShowReturnOrderFiles(true)
                    }
                  }}>
                    <Icon color="info">article</Icon>
                  </IconButton>
                </Tooltip>
              </span>
            )}
          </span>,

        ],
      };
    });
  }, [state.data, selectedCheckboxes]);

  // ------------------------Toggle Of The Search----------------------------------------
  const togglePopupSearch = () => {
    setOpenSearch(!openSearch);
  };

  const togglePopup = () => {
    if (open) {
      setSelectedUserData(null);
    }
    setOpen(!open);
  };

  const togglePopupRefundAmount = () => {
    if (refundAmount) {
      setSelectedUserData(null);
    }
    setRefundAmount(!refundAmount);
  };

  const activeButtonStyle = {
    backgroundColor: "#1976d2",
    color: "white",
    margin: "0px 5px",
  };

  const buttonStyle = {
    margin: "0px 5px",
  };

  // -------------Change the Oreder status --------------------
  const editOrderStatus = (event) => {
    const selectedOption = event.target.value;
    if (selectedOption === "reject") {
      setSelectedUserData(selectedCheckboxes);
      togglePopup();
    } else {
      const payload = {
        returnOrderProductIds: selectedCheckboxes,
        status: selectedOption,
      };
      API.put(apiConfig.changeReturnOrderStatus, payload)
        .then((res) => {
          setSelectedCheckboxes([]);
          paginate();
          HELPER.toaster.success(res.message);
        })
        .catch((e) => HELPER.toaster.error(e.errors.returnOrderProductIds[0]));
    }
  };
  // -------------------DropDwon Api in OrderNo and stockNo------------------------

  let _sortOptionsOrderNo = [];
  let _sortOptionStockNo = [];

  useEffect(() => {
    API.get(apiConfig.orderFilterDropDown)
      .then((res) => {
        setDropDown({
          orderNo: res.dropdowns.orderNo,
          stockNo: res.dropdowns.stockNo,
        });
      })
      .catch((e) => {
        HELPER.toaster.error(e);
      });
  }, []);

  if (Array.isArray(dropDown.orderNo)) {
    _sortOptionsOrderNo =
      dropDown.orderNo &&
      dropDown.orderNo.map((option) => {
        const label = option;
        const value = option;
        return { label, value };
      });
  }

  if (Array.isArray(dropDown.stockNo)) {
    _sortOptionStockNo =
      dropDown.stockNo &&
      dropDown.stockNo.map((option) => {
        const label = option;
        const value = option;
        return { label, value };
      });
  }

  const showAddressInDialog = (item) => {
    const address = item.returnReason;
    setAddressText(address); // Set the address text
    textModaltoggle(); // Show the dialog
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
                { name: "Masters", path: pageRoutes.master.user.returnOrder },
                { name: "Return Order" },
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
            </div>
            <SearchFilterDialog
              isOpen={openSearch}
              onClose={() => setOpenSearch(false)}
              reset={() => paginate(true)}
              maxWidth="sm"
              search={() => {
                paginate(false, true);
                setOpenSearch(false);
              }}
              loader={loading}
            >
              <div style={{ height: "300px" }}>
                <Flatpickr
                  className="flatpickr-input"
                  placeholder="Select Date Range"
                  onChange={(date) => setDateRange(date)}
                  value={dateRange}
                  options={{
                    mode: "range",
                    dateFormat: "Y-m-d",
                  }}
                />
                <div className="text-input-top">
                  <Select
                    placeholder="Select Order No"
                    options={_sortOptionsOrderNo}
                    isMulti
                    value={_sortOptionsOrderNo.filter(
                      (option) =>
                        state.orderNoArr &&
                        state.orderNoArr.includes(option.value)
                    )}
                    onChange={(selectedSort) => {
                      const selectedIds = selectedSort.map(
                        (option) => option.value
                      );
                      changeState("orderNoArr", selectedIds);
                    }}
                    name="choices-multi-default"
                    id="orderNoArr"
                  />
                </div>

                <div className="text-input-top">
                  <Select
                    placeholder="Select Stock No"
                    options={_sortOptionStockNo}
                    isMulti
                    value={_sortOptionStockNo.filter(
                      (option) =>
                        state.stockIds && state.stockIds.includes(option.value)
                    )}
                    onChange={(selectedSort) => {
                      const selectedIds = selectedSort.map(
                        (option) => option.value
                      );
                      changeState("stockIds", selectedIds);
                    }}
                    name="choices-multi-default"
                    id="stockIds"
                  />
                </div>
              </div>
            </SearchFilterDialog>
          </Box>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              // marginBottom: "10px",
              height: "75px",
              padding: "15px 10px",
              background: "#a6a6a608",
              border: "1px solid #a6a6a61a",
            }}
          >
            <div className="main-buttons-handle-order-return">
              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  setFilter({
                    ...filter,
                    returnOrderStatus: "request",
                  })
                }
                style={
                  filter.returnOrderStatus === "request"
                    ? activeButtonStyle
                    : buttonStyle
                }
              >
                Request
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  setFilter({
                    ...filter,
                    returnOrderStatus: "approve",
                  })
                }
                style={
                  filter.returnOrderStatus === "approve"
                    ? activeButtonStyle
                    : buttonStyle
                }
              >
                Approve
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  setFilter({
                    ...filter,
                    returnOrderStatus: "receive",
                  })
                }
                style={
                  filter.returnOrderStatus === "receive"
                    ? activeButtonStyle
                    : buttonStyle
                }
              >
                Receive
              </Button>

              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  setFilter({
                    ...filter,
                    returnOrderStatus: "verified",
                  })
                }
                style={
                  filter.returnOrderStatus === "verified"
                    ? activeButtonStyle
                    : buttonStyle
                }
              >
                Verified
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  setFilter({
                    ...filter,
                    returnOrderStatus: "refund",
                  })
                }
                style={
                  filter.returnOrderStatus === "refund"
                    ? activeButtonStyle
                    : buttonStyle
                }
              >
                Refund
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  setFilter({
                    ...filter,
                    returnOrderStatus: "reject",
                  })
                }
                style={
                  filter.returnOrderStatus === "reject"
                    ? activeButtonStyle
                    : buttonStyle
                }
              >
                Reject
              </Button>
            </div>

            {state.data?.length > 0 && (
              <div style={{ width: "260px" }}>
                {filter.returnOrderStatus === "request" ||
                  filter.returnOrderStatus === "approve" ||
                  filter.returnOrderStatus === "receive" ||
                  (filter.returnOrderStatus !== "verified" &&
                    filter.returnOrderStatus !== "refund" &&
                    filter.returnOrderStatus !== "reject") ? (
                  <ReactSelect
                    placeholder="Select Status"
                    // isDisabled={!isCheckboxChecked}
                    value={selectedStatus}
                    options={
                      statuses && Array.isArray(statuses) && statuses.length > 0
                        ? statuses.map((status) => ({
                          label: status,
                          value: status,
                        }))
                        : []
                    }
                    onChange={(selectedOption) => {
                      setSelectedStatus(selectedOption);
                      editOrderStatus(selectedOption);
                    }}
                    name="status-select"
                  />
                ) : null}
              </div>
            )}
          </div>
          {loading ? (
            <div style={{ margin: "25px  auto", textAlign: "center" }}>
              <img
                src="../../../../../../assets/loading.gif"
                alt=""
                srcSet=""
                height={28}
                width={28}
              />
            </div>
          ) : state.data?.length > 0 ? (
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
              orderBy={state.orderby}
              order={state.order}
              {...otherTableActionProps}
            ></PaginationTable>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "50px",
              }}
            >
              <img src={error400cover} width="420px" />
            </div>
          )}
        </Container>
        {open && selectedUserData && (
          <ReturnRejectMaster
            open={open}
            togglePopup={() => {
              togglePopup();
              // paginate();
            }}
            callBack={() => {
              setSelectedCheckboxes([]);
              paginate(true)
            }}
            userData={selectedUserData}
          />
        )}

        {refundAmount && (
          <RefundAmountReturnOrder
            open={refundAmount}
            togglePopup={() => {
              togglePopupRefundAmount();
              // paginate();
            }}
            callBack={() => paginate(true)}
            userData={refundAmountCancel}
          />
        )}

        {textModal && (
          <ThemeDialog
            title="Reject Order Reason"
            id="showModal"
            isOpen={textModal}
            toggle={textModaltoggle}
            centered
            maxWidth="sm"
            actionBtns={
              <Button
                variant="contained"
                color="secondary"
                onClick={textModaltoggle}
              >
                Close
              </Button>
            }
          >
            <div
              style={{ padding: "0px", margin: "0px", lineBreak: "anywhere" }}
            >
              <Typography variant="body1" style={{ lineHeight: "22px" }}>
                {addressText}
              </Typography>
            </div>
          </ThemeDialog>
        )}

        {/* Show Return order files */}
        {isShowReturnOrderFiles && (
          <ThemeDialog
            title="Return Order Product Files"
            id="showReturnOrderModal"
            isOpen={isShowReturnOrderFiles}
            toggle={() => setIsShowReturnOrderFiles(!isShowReturnOrderFiles)}
            centered
            maxWidth="sm"
            actionBtns={
              <Button
                variant="contained"
                color="secondary"
                onClick={() => setIsShowReturnOrderFiles(!isShowReturnOrderFiles)}
              >
                Close
              </Button>
            }
          >
            <div
              style={{ padding: "0px", margin: "0px", lineBreak: "anywhere" }}
            >
              <Row>
                {returnProductFiles &&
                  returnProductFiles.map((item, i) => {
                    return (
                      <Col xl={3} key={i}>
                        {((checkFileType(item)) == 'image' ?
                          <img src={setImageSrc(item)} className="img-fluid" /> :
                          <video width="320" height="240" controls>
                            <source src={setImageSrc(item)} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        )}

                      </Col>
                    );
                  })}
              </Row>
            </div>
          </ThemeDialog>
        )}
      </div>
    </>
  );
};

export default ReturnOrderMaster;
