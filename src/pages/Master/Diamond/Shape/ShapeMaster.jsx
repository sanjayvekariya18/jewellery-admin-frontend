import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Icon,
  IconButton,
  Tooltip,
  Button,
  Typography,
} from "@mui/material";
import { Breadcrumb, Container, StyledAddButton } from "../../../../components";
import { pageRoutes } from "../../../../constants/routesList";
import { API, HELPER } from "../../../../services";
import PaginationTable, {
  usePaginationTable,
} from "../../../../components/UI/Pagination/PaginationTable";
import { apiConfig, appConfig } from "./../../../../config";
import _ from "lodash";
import error400cover from "../../../../assets/no-data-found-page.png";
import { toaster } from "../../../../services/helper";
import Swal from "sweetalert2";
import ShapeMasterDetails from "./ShapeMasterDetails";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";

const ShapeMaster = () => {
  const [open, setOpen] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [textModal, setTextModal] = useState(false);
  const [addressText, setAddressText] = useState("");
  const [loading, setLoading] = useState();

  const textModaltoggle = () => {
    setTextModal(!textModal);
  };

  /* ------------------columns code  define--------------------*/
  const COLUMNS = [
    { title: "Rank", classNameWidth: "thead-second-width-action-index" },
    { title: "Shape", classNameWidth: "thead-second-width-title" },
    { title: "Image", classNameWidth: "thead-second-width" },
    { title: "Description", classNameWidth: "thead-second-width-title-option" },
    { title: "Action", classNameWidth: "thead-second-width-action-index" },
  ];

  const { state, setState, changeState, ...otherTableActionProps } =
    usePaginationTable({
      isActive: "",
      order: "",
      orderby: "",
    });
  // pagination table code define
  const paginate = (clear = false, isNewFilter = false) => {
    changeState("loader", true);
    let clearStates = {
      isActive: "",
      ...appConfig.default_pagination_state,
    };

    let filter = {
      page: state.page,
      isActive: state.isActive,
      rowsPerPage: state.rowsPerPage,
      order: state.order,
      orderBy: state.orderby,
    };

    let newFilterState = { ...appConfig.default_pagination_state };

    if (clear) {
      filter = _.merge(filter, clearStates);
    } else if (isNewFilter) {
      filter = _.merge(filter, newFilterState);
    }

    // ----------Get Blog Api------------
    setLoading(true);
    API.get(apiConfig.shape)
      .then((res) => {
        setLoading(false);
        setState({
          ...state,
          total_items: res.count,
          data: res,
          ...(clear && clearStates),
          ...(isNewFilter && newFilterState),
          loader: false,
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
          toaster.error(err.errors.message);
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
  };

  useEffect(() => {
    paginate();
  }, [state.page, state.rowsPerPage]);

  const showAddressInDialog = (item) => {
    const address = item.description;
    setAddressText(address); // Set the address text
    textModaltoggle(); // Show the dialog
  };

  // rows code define
  const rows = useMemo(() => {
    return state.data.map((item) => {
      return {
        item: item,
        columns: [
          <span>{item.rankk}</span>,
          <span>{item.shape}</span>,
          <span>
            {item.imgUrl && item.imgUrl !== null && (
              <Box
                component="img"
                sx={{
                  height: 40,
                  width: 40,
                  maxHeight: { xs: 25, md: 50 },
                  maxWidth: { xs: 25, md: 50 },
                }}
                src={HELPER.getImageUrl(item.imgUrl)}
              />
            )}
          </span>,
          <div>
            <span
              className="common-thead-second-width-title-option"
              style={{ fontWeight: "500", cursor: "pointer" }}
              onClick={() => showAddressInDialog(item)}
            >
              {item.description}
            </span>
          </div>,
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
  /* Pagination code */

  const togglePopup = () => {
    if (open) {
      setSelectedUserData(null);
    }
    setOpen(!open);
  };

  const handleEdit = (data) => {
    setSelectedUserData(data);
    setOpen(true);
  };
  // ------------------------------- Delete Shape ---------------------------------
  const onClickDelete = (shape_id) => {
    Swal.fire({
      title: "Are You Sure",
      text: "Are you sure you want to remove this Shape ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        API.destroy(`${apiConfig.shape}/${shape_id}`)
          .then((res) => {
            toaster.success("Deleted Successfully");
            paginate();
          })
          .catch((e) => HELPER.toaster.error(e.errors.message))
      }
    });
  };

  return (
    <Container>
      <Box
        className="breadcrumb"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Breadcrumb
          routeSegments={[
            { name: "Masters", path: pageRoutes.master.user.user },
            { name: "Shape" },
          ]}
        />
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
        emptyTableImg={<img src={error400cover} width="350px" />}
        {...otherTableActionProps}
        orderBy={state.orderby}
        order={state.order}
        footerVisibility={false}
      ></PaginationTable>
      <Tooltip title="Create" placement="top">
        <StyledAddButton
          color="secondary"
          aria-label="Add"
          className="button sub-category-tooltip-shape"
          onClick={togglePopup}
        >
          <Icon>add</Icon>
        </StyledAddButton>
      </Tooltip>
      {/* ShapeMasterDetails form define */}
      <ShapeMasterDetails
        open={open}
        togglePopup={() => {
          togglePopup();
          // paginate();
        }}
        callBack={() => paginate()}
        userData={selectedUserData}
      />
      {/* ThemeDialog details define */}
      {textModal && (
        <ThemeDialog
          title="Details"
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

export default ShapeMaster;
