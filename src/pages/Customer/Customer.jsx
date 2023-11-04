import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  DialogContent,
  DialogTitle,
  Icon,
  TextField,
  Tooltip,
} from "@mui/material";
import { Breadcrumb, Container } from "../../components";
import { apiConfig, appConfig } from "../../config";
import _ from "lodash";
import Swal from "sweetalert2";
import { toaster } from "../../../src/services/helper";
import PaginationTable from "../../components/UI/Pagination/PaginationTable";
import { usePaginationTable } from "../../components/UI/Pagination/PaginationTable";
import { API, HELPER } from "../../../src/services/index";
import { IconButton, Button } from "@mui/material";
import error400cover from "../../assets/no-data-found-page.png";
import SearchFilterDialog from "../../components/UI/Dialog/SearchFilterDialog";
import LabMasterDetails from "../Master/Diamond/Lab/LabMasterDetails";
import ThemeDialog from "../../components/UI/Dialog/ThemeDialog";
import Textarea from "../../components/UI/Textarea";
import Textinput from "../../components/UI/TextInput";

const Customer = () => {
  const [open, setOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [textModal, setTextModal] = useState(false);
  const [addressText, setAddressText] = useState("");
  const textModaltoggle = () => {
    setTextModal(!textModal);
  };
  /* Pagination code */
  const TITLE = [
    { title: "Name", classNameWidth: "thead-second-width-title-email" },
    { title: "Email", classNameWidth: "thead-second-width-title-email" },
    { title: "Country", classNameWidth: "thead-second-width" },
    { title: "State", classNameWidth: "thead-second-width-stock-no" },
    { title: "City", classNameWidth: "thead-second-width" },
    { title: "Pincode", classNameWidth: "thead-second-width" },
    { title: "Address", classNameWidth: "thead-second-width-stock-no" },
    { title: "Active", classNameWidth: "thead-second-width-action" },
    { title: "Action", classNameWidth: "thead-second-width-action" },
  ];

  const {
    state,
    setState,
    changeState,
    getInitialStates,
    ...otherTableActionProps
  } = usePaginationTable({});

  const paginate = (clear = false, isNewFilter = false) => {
    changeState("loader", true);
    let clearStates = {
      ...appConfig.default_pagination_state,
    };

    let filter = {
      page: state.page,
      searchTxt: state.searchTxt,
      isActive: state.isActive,
      rowsPerPage: state.rowsPerPage,
    };

    let newFilterState = { ...appConfig.default_pagination_state };
    if (clear) {
      delete filter.searchTxt;
      delete filter.isActive;
    } else if (isNewFilter) {
      filter = _.merge(filter, newFilterState);
    }

    // ----------Get Blog Api------------
    API.get(apiConfig.customer, filter)
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
        });
      })
      .catch(() => {
        setState({
          ...state,
          ...(clear && clearStates),
          ...(isNewFilter && newFilterState),
          loader: false,
        });
      });
    // .finally(() => {
    //   if (openSearch == true) {
    //     setOpenSearch(false);
    //   }
    // });
  };

  //------------ Delete Lab--------------

  const onClickDelete = (customer_id) => {
    Swal.fire({
      title: "Are You Sure",
      text: "Are you sure you want to remove this Customer ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        API.destroy(`${apiConfig.customer}/${customer_id}`)
          .then((res) => {
            toaster.success("Deleted Successfully");
            paginate();
          })
          .catch(console.error);
      }
    });
  };
  const showAddressInDialog = (item) => {
    const address = `${item.addressLine1 || ""} ${item.addressLine2 || ""} ${
      item.addressLine3 || ""
    }`;
    setAddressText(address); // Set the address text
    textModaltoggle(); // Show the dialog
  };

  useEffect(() => {
    paginate();
  }, [state.page, state.rowsPerPage]);
  const rows = useMemo(() => {
    return state.data.map((item) => {
      return {
        item: item,
        columns: [
          <span>{item.firstName + " " + item.lastName} </span>,
          <span>{item.email}</span>,
          <span>{item.country}</span>,
          <span>{item.state}</span>,
          <span>{item.city}</span>,
          <span>{item.pincode}</span>,
          <span
            className="three-dot-text-title-stock-no"
            style={{ fontWeight: "500", cursor: "pointer" }}
            onClick={() => showAddressInDialog(item)}
          >
            {`${item.addressLine1 || ""} ${item.addressLine2 || ""} ${
              item.addressLine3 || ""
            }`}
          </span>,
          <span>
            <IconButton onClick={() => handleToggle(item.id)}>
              <Icon
                color={item.isActive == true ? "success" : "error"}
                style={{ fontWeight: 700 }}
              >
                power_settings_new
              </Icon>
            </IconButton>
          </span>,
          <div>
            <IconButton onClick={(e) => onClickDelete(item.id)}>
              <Icon color="error">delete</Icon>
            </IconButton>
          </div>,
        ],
      };
    });
  }, [state.data]);
  /* Pagination code */

  const togglePopup = () => {
    if (open) {
      setSelectedUserData(null);
    }
    setOpen(!open);
  };
  const togglePopupSearch = () => {
    setOpenSearch(!openSearch);
  };

  const handleToggle = (id) => {
    API.put(apiConfig.customerActive.replace(":id", id))
      .then((response) => {
        HELPER.toaster.success(response.message);
        paginate();
      })
      .catch((e) => HELPER.toaster.error("Error " + e));
  };

  return (
    <Container>
      <Box
        className="breadcrumb"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Breadcrumb routeSegments={[{ name: "Customer" }]} />
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
      </Box>
      <PaginationTable
        header={TITLE}
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

      <SearchFilterDialog
        isOpen={openSearch}
        maxWidth="sm"
        onClose={() => setOpenSearch(false)}
        reset={() => paginate(true)}
        search={() => {
          paginate(false, true);
          setOpenSearch(false); // Close the modal
        }}
      >
        <Textinput
          size="small"
          focused={true}
          type="text"
          name="searchTxt"
          label="Search Text"
          variant="outlined"
          value={state?.searchTxt}
          onChange={(e) => changeState("searchTxt", e.target.value)}
          sx={{ mb: 0, mt: 1, width: "100%" }}
        />
      </SearchFilterDialog>

      <LabMasterDetails
        open={open}
        togglePopup={() => {
          togglePopup();
          paginate();
        }}
        userData={selectedUserData}
      />

      {textModal && (
        <ThemeDialog
          title="Address"
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
          <div style={{ padding: "0px", margin: "0px" }}>
            <Textarea
              className="form-control"
              rows="5"
              value={addressText}
              readOnly
            ></Textarea>
          </div>
        </ThemeDialog>
      )}
    </Container>
  );
};

export default Customer;
