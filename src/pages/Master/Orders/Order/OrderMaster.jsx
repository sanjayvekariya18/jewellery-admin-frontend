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
import OrderMasterDetail from "./OrderMasterDetail";
import { pageRoutes } from "../../../../constants/routesList";
import ApproveCancelOrder from "./ApproveCancelOrder";
import moment from "moment-timezone";

const OrderMaster = () => {
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [approveCancel, setApproveCancel] = useState(null);
  const [openSearch, setOpenSearch] = useState(false);
  const [open, setOpen] = useState(false);
  const [approveOrder, setApproveOrder] = useState(false);
  const [dropDown, setDropDown] = useState([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);
  const [filter, setFilter] = useState({
    orderStatus: "pending",
  });

  // ----Pagination code------
  const COLUMNS = [
    filter.orderStatus === "pending" ||
    filter.orderStatus === "approve" ||
    filter.orderStatus === "processing" ||
    filter.orderStatus === "packed" ||
    filter.orderStatus === "dispatch"
      ? {
          title: "Select Order",
          order: false,
          field: "totalReturnProducts",
        }
      : {
          title: "",
          order: false,
          field: "",
          classNameWidth: "thead-width-zero",
        },
    { title: "Order No", order: true, field: "orderNo" },
    { title: "Payable Amount", order: false, field: "payableAmount" },
    { title: "Customer Name", order: false, field: "customerName" },
    { title: "Order Date", order: false, field: "orderDate" },
    { title: "Payment Status", order: false, field: "paymentStatus" },
    { title: "Total Products", order: false, field: "totalProducts" },
    filter.orderStatus === "delivered"
      ? {
          title: "Total Return Products",
          order: false,
          field: "totalReturnProducts",
        }
      : {
          title: "",
          order: false,
          field: "",
          classNameWidth: "thead-width-zero",
        },
    { title: "Actions", order: false, field: "Actions" },
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
      paymentStatus: state.paymentStatus,
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
      delete filterData.paymentStatus;
      delete filterData.orderNoArr;
      delete filterData.stockIds;
      setDateRange([null, null]);
    } else if (isNewFilter) {
      filterData = _.merge(filterData, newFilterState);
    }

    // ----------Get Order Api------------

    API.get(apiConfig.orders, filterData)
      .then((res) => {
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
          status: res.statuses,
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
      });
  };

  // ----------------multiple checkBox select code ----------------
  const handleCheckbox = (itemId) => {
    setSelectedCheckboxes((prevSelectedCheckboxes) => {
      if (
        prevSelectedCheckboxes.some((selectedItem) => selectedItem === itemId)
      ) {
        return prevSelectedCheckboxes.filter(
          (selectedItem) => selectedItem !== itemId
        );
      } else {
        return [...prevSelectedCheckboxes, itemId];
      }
    });
  };

  const handleCancelOrder = (data) => {
    setSelectedUserData(data);
    setOpen(true);
  };

  const approveCancelOrder = (data) => {
    setApproveCancel(data);
    setApproveOrder(true);
  };

  useEffect(() => {
    paginate();
  }, [
    state.page,
    state.rowsPerPage,
    filter,
    selectedCheckboxes,
    state.order,
    state.orderby,
  ]);

  const successLabel = {
    backgroundColor: "#e9fbf0d6",
    border: "1px solid #1a8d488f",
    color: "#2a5c3edb",
    padding: "6px 8px",
    borderRadius: "20px",
  };

  const failLabel = {
    backgroundColor: "rgb(253, 237, 237)",
    border: "1px solid #f16e5d9e",
    color: "rgb(239 43 40)",
    padding: "6px 8px",
    borderRadius: "20px",
  };

  const rows = useMemo(() => {
    return state.data.map((item) => {
      return {
        item: item,
        columns: [
          <span>
            {(filter.orderStatus === "pending" ||
              filter.orderStatus === "approve" ||
              filter.orderStatus === "processing" ||
              filter.orderStatus === "packed" ||
              filter.orderStatus === "dispatch") && (
              <Checkbox
                checked={selectedCheckboxes.some(
                  (selectedItem) => selectedItem === item.id
                )}
                onChange={() => handleCheckbox(item.id)}
                color="primary"
              />
            )}
          </span>,
          <span>{item.orderNo}</span>,
          <span>{item.payableAmount}</span>,
          <span>{item.customerName}</span>,
          <span>
            {moment(item.orderDate, "Do MMMM YYYY").format(
              appConfig.dateDisplayFormat
            )}
          </span>,
          <span
            style={item.paymentStatus === "success" ? successLabel : failLabel}
          >
            {item.paymentStatus}
          </span>,

          <span>{item.totalProducts}</span>,
          item.orderStatus === "delivered" && (
            <span>{item.totalReturnProducts}</span>
          ),
          <span>
            <MaxHeightMenu
              optionsMenu={[
                {
                  key: "Cancel Order",
                  color: "red",
                  icon: "cancel",
                  onClick: () => handleCancelOrder(item.id),
                },
                {
                  key: "Approve Cancel Order",
                  color: "green",
                  icon: "check_circle",
                  onClick: () => approveCancelOrder(item.id),
                },
              ]}
            />
          </span>,
        ],
      };
    });
  }, [state.data]);

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

  const togglePopupApproveCancel = () => {
    if (approveOrder) {
      setSelectedUserData(null);
    }
    setApproveOrder(!approveOrder);
  };

  const activeButtonStyle = {
    backgroundColor: "#1976d2", // You can set your desired background color here
    color: "white",
    margin: "0px 5px", // Change the text color when the button is active
  };

  const buttonStyle = {
    margin: "0px 5px",
  };

  // -------------Change the Oreder status --------------------
  const editOrderStatus = () => {
    const payload = {
      orderIds: selectedCheckboxes,
      status: state.status[0],
    };
    API.put(apiConfig.changeOrderStatus, payload)
      .then((res) => {
        paginate();
        setSelectedCheckboxes([]);
        HELPER.toaster.success(res.message);
      })
      .catch((e) => HELPER.toaster.error(e.errors.orderIds[0]));
  };

  // ----------------Filter of the Payment Status ----------------
  const sortOptionPayment = [
    { label: "Success", value: "success" },
    { label: "Fail", value: "fail" },
  ];
  let _sortOptionPayment = sortOptionPayment.map((option) => ({
    label: option.label,
    value: option.value,
  }));

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
                { name: "Masters", path: pageRoutes.master.user.user },
                { name: "Orders" },
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
              // search={() => paginate(false, true)}
              search={() => {
                paginate(false, true);
                setOpenSearch(false); // Close the modal
              }}
            >
              <div style={{ height: "300px" }}>
                {/* <div className="text-input-top"> */}
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
                {/* </div> */}

                <div className="text-input-top">
                  <ReactSelect
                    // label="Select Sort by Price"
                    placeholder={
                      _sortOptionPayment.find(
                        (option) => option.value === state.paymentStatus
                      )?.label || "Select Payment Status"
                    }
                    options={_sortOptionPayment}
                    value={_sortOptionPayment.find(
                      (option) => option.value === state.paymentStatus
                    )}
                    onChange={(selectedSort) => {
                      const selectedId = selectedSort.target.value;
                      changeState("paymentStatus", selectedId);
                    }}
                    name="choices-multi-default"
                  />
                </div>

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
              padding: "15px 10px",
              background: "#a6a6a608",
              border: "1px solid #a6a6a61a",
            }}
          >
            <div className="main-buttons-handle-order">
              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  setFilter({
                    ...filter,
                    orderStatus: "pending",
                  })
                }
                style={
                  filter.orderStatus === "pending"
                    ? activeButtonStyle
                    : buttonStyle
                }
              >
                Pending
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  setFilter({
                    ...filter,
                    orderStatus: "approve",
                  })
                }
                style={
                  filter.orderStatus === "approve"
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
                    orderStatus: "processing",
                  })
                }
                style={
                  filter.orderStatus === "processing"
                    ? activeButtonStyle
                    : buttonStyle
                }
              >
                Processing
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  setFilter({
                    ...filter,
                    orderStatus: "packed",
                  })
                }
                style={
                  filter.orderStatus === "packed"
                    ? activeButtonStyle
                    : buttonStyle
                }
              >
                Packed
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  setFilter({
                    ...filter,
                    orderStatus: "dispatch",
                  })
                }
                style={
                  filter.orderStatus === "dispatch"
                    ? activeButtonStyle
                    : buttonStyle
                }
              >
                Dispatch
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  setFilter({
                    ...filter,
                    orderStatus: "delivered",
                  })
                }
                style={
                  filter.orderStatus === "delivered"
                    ? activeButtonStyle
                    : buttonStyle
                }
              >
                Delivered
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  setFilter({
                    ...filter,
                    orderStatus: "cancel",
                  })
                }
                style={
                  filter.orderStatus === "cancel"
                    ? activeButtonStyle
                    : buttonStyle
                }
              >
                Cancel
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  setFilter({
                    ...filter,
                    orderStatus: "return",
                  })
                }
                style={
                  filter.orderStatus === "return"
                    ? activeButtonStyle
                    : buttonStyle
                }
              >
                Return
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  setFilter({
                    ...filter,
                    orderStatus: "fail",
                  })
                }
                style={
                  filter.orderStatus === "fail"
                    ? activeButtonStyle
                    : buttonStyle
                }
              >
                Fail
              </Button>
              <Button
                variant="outlined"
                color="primary"
                onClick={() =>
                  setFilter({
                    ...filter,
                    orderStatus: "cancel_request",
                  })
                }
                style={
                  filter.orderStatus === "cancel_request"
                    ? activeButtonStyle
                    : buttonStyle
                }
              >
                Customer Cancel Order
              </Button>
            </div>

            <div style={{ width: "260px" }}>
              {(filter.orderStatus === "pending" ||
                filter.orderStatus === "approve" ||
                filter.orderStatus === "processing" ||
                filter.orderStatus === "packed" ||
                filter.orderStatus === "dispatch") && (
                <ReactSelect
                  placeholder="Select Status"
                  isDisabled={state.data?.length > 0 ? false : true}
                  options={
                    state.status && state.status.length !== 0
                      ? [
                          {
                            label: state.status[0],
                            value: state.status[0],
                          },
                        ]
                      : []
                  }
                  onChange={editOrderStatus}
                  name="status-select"
                />
              )}
            </div>
          </div>
          {state.data?.length > 0 ? (
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
        {open && (
          <OrderMasterDetail
            open={open}
            togglePopup={() => {
              togglePopup();
              paginate();
            }}
            callBack={() => paginate(true)}
            userData={selectedUserData}
          />
        )}
        {approveOrder && (
          <ApproveCancelOrder
            open={approveOrder}
            togglePopup={() => {
              togglePopupApproveCancel();
              paginate();
            }}
            callBack={() => paginate(true)}
            userData={approveCancel}
          />
        )}
      </div>
    </>
  );
};

export default OrderMaster;
