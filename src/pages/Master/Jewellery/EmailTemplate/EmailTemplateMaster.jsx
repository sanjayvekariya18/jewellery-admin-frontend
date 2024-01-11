import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Icon,
  IconButton,
  Button,
  Tooltip,
  Typography,
} from "@mui/material";
import { Breadcrumb, Container, StyledAddButton } from "../../../../components";
import { pageRoutes } from "../../../../constants/routesList";
import { API, HELPER } from "../../../../services";
import PaginationTable, {
  usePaginationTable,
} from "../../../../components/UI/Pagination/PaginationTable";
import { apiConfig, appConfig } from "../../../../config";
import _ from "lodash";
import SearchFilterDialog from "../../../../components/UI/Dialog/SearchFilterDialog";
import error400cover from "../../../../assets/no-data-found-page.png";
import Swal from "sweetalert2";
import { toaster } from "../../../../services/helper";
import Textinput from "../../../../components/UI/TextInput";
import EmailTemplateMasterDetails from "./EmailTemplateMasterDetails";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";

const EmailTemplateMaster = () => {
  const [open, setOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [textModal, setTextModal] = useState(false);
  const [addressText, setAddressText] = useState("");
  const [loading, setLoading] = useState();

  const textModaltoggle = () => {
    setTextModal(!textModal);
  };

  /* Pagination code */
  const COLUMNS = [
    { title: "Template Name", classNameWidth: "thead-second-width-title-blog" },
    { title: "Subject", classNameWidth: "thead-second-width-title-blog" },
    { title: "Action", classNameWidth: "thead-second-width-action-index" },
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

    // ---------- Email Template Api ------------
    setLoading(true);
    API.get(apiConfig.emailTemplate, filter)
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
      .catch(() => {
        setLoading(false);
        setState({
          ...state,
          ...(clear && clearStates),
          ...(isNewFilter && newFilterState),
          loader: false,
        });
      });
  };

  //------------ Delete --------------

  const onClickDelete = (id) => {
    Swal.fire({
      title: "Are You Sure",
      text: "Are you sure you want to remove this Email Template ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        API.destroy(`${apiConfig.emailTemplate}/${id}`)
          .then((res) => {
            toaster.success("Deleted Successfully");
            paginate();
          })
          .catch((e) => HELPER.toaster.error(e.errors.message))
      }
    });
  };

  useEffect(() => {
    paginate();
  }, [state.page, state.rowsPerPage]);

  const showAddressInDialog = (item) => {
    const description = item.subject;
    setAddressText(description); // Set the address text
    textModaltoggle(); // Show the dialog
  };

  const rows = useMemo(() => {
    return state.data.map((item) => {
      return {
        item: item,
        columns: [
          <div className="common-thead-second-width-title-blog">
            <span>{item.template_name}</span>
          </div>,
          <div
            className="common-thead-second-width-title-blog"
            style={{ fontWeight: "500", cursor: "pointer" }}
            onClick={() => showAddressInDialog(item)}
          >
            <span>{item.subject}</span>
          </div>,
          <div>
            <IconButton onClick={(e) => handleEdit(item)}>
              <Icon color="primary">create</Icon>
            </IconButton>
            <IconButton onClick={(e) => onClickDelete(item.template_id)}>
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

  const handleEdit = (data) => {
    setSelectedUserData(data);
    setOpen(true);
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
        <Breadcrumb
          routeSegments={[
            { name: "Masters", path: pageRoutes.master.user.user },
            { name: "Email Template" },
          ]}
        />
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

      <SearchFilterDialog
        isOpen={openSearch}
        maxWidth="sm"
        onClose={() => setOpenSearch(false)}
        reset={() => {
          changeState("searchTxt", ""); // Clear the search text
          paginate(true);
        }}
        search={() => {
          paginate(false, true);
          setOpenSearch(false); // Close the modal
        }}
        loader={loading}
      >
        <Textinput
          size="small"
          type="text"
          name="searchTxt"
          label="Search Text"
          variant="outlined"
          autoFocus={true}
          value={state?.searchTxt || ""}
          onChange={(e) => changeState("searchTxt", e.target.value)}
          sx={{ mb: 0, mt: 1, width: "100%" }}
        />
      </SearchFilterDialog>

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

      <EmailTemplateMasterDetails
        open={open}
        togglePopup={() => {
          togglePopup();
          // paginate();
        }}
        callBack={() => paginate()}
        userData={selectedUserData}
      />

      {textModal && (
        <ThemeDialog
          title="Body"
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
          <div style={{ padding: "0px", margin: "0px", lineBreak: "anywhere" }}>
            <Typography variant="body1" style={{ lineHeight: "22px" }}>
              {addressText}
            </Typography>
          </div>
        </ThemeDialog>
      )}
    </Container>
  );
};

export default EmailTemplateMaster;
