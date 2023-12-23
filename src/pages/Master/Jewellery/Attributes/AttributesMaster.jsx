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
import AttributesMasterDetails from "./AttributesMasterDetails";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";

const AttributesMaster = () => {
  const [open, setOpen] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [editAttributeSingleData, setEditAttributeSingleData] = useState([]);
  const [textModal, setTextModal] = useState(false);
  const [addressText, setAddressText] = useState("");
  const [loading, setLoading] = useState();

  const textModaltoggle = () => {
    setTextModal(!textModal);
  };
  /* Pagination code */
  const COLUMNS = [
    { title: "Name", classNameWidth: "thead-second-width-title" },
    { title: "Logo Image", classNameWidth: "thead-second-width" },
    { title: "Image", classNameWidth: "thead-second-width" },
    { title: "Details", classNameWidth: "thead-second-width-title-option" },
    { title: "Action", classNameWidth: "thead-second-width-action-index" },
  ];

  const { state, setState, changeState, ...otherTableActionProps } =
    usePaginationTable({});

  const paginate = (clear = false, isNewFilter = false) => {
    changeState("loader", true);
    let clearStates = {
      ...appConfig.default_pagination_state,
    };

    let filter = {
      page: state.page,
      rowsPerPage: state.rowsPerPage,
    };

    let newFilterState = { ...appConfig.default_pagination_state };

    if (clear) {
      filter = _.merge(filter, clearStates);
    } else if (isNewFilter) {
      filter = _.merge(filter, newFilterState);
    }

    // ----------Get Attributes Api------------
    setLoading(true);
    API.get(apiConfig.attributes, filter)
      .then((res) => {
        setLoading(false);
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
    const address = item.details;
    setAddressText(address);
    textModaltoggle();
  };

  const rows = useMemo(() => {
    return state.data.map((item) => {
      return {
        item: item,
        columns: [
          <span>{item.name}</span>,

          <span>
            {item.logoUrl && item.logoUrl !== null && (
              <Box
                component="img"
                sx={{
                  height: 40,
                  width: 40,
                  maxHeight: { xs: 25, md: 50 },
                  maxWidth: { xs: 25, md: 50 },
                }}
                src={HELPER.getImageUrl(item.logoUrl)}
              />
            )}
          </span>,
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
              {item.details}
            </span>
          </div>,
          <div>
            <IconButton onClick={(e) => handleEdit(item)}>
              <Icon color="primary">create</Icon>
            </IconButton>
            {/* <IconButton onClick={(e) => onClickDelete(item.id)}>
              <Icon color="error">delete</Icon>
            </IconButton> */}
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

  useEffect(() => {
    if (selectedUserData) {
      // Check if selectedUserData is not null
      API.get(apiConfig.attributesId.replace(":id", selectedUserData.id))
        .then((res) => {
          setEditAttributeSingleData({ ...res });
        })
        .catch((err) => {
          if (
            err.status === 400 ||
            err.status === 401 ||
            err.status === 409 ||
            err.status === 422 ||
            err.status === 403
          ) {
            HELPER.toaster.error(err.errors.message);
          } else {
            HELPER.toaster.error(err)
          }
        });
    }
  }, [selectedUserData]);
  // ------------------------------- Delete Shape ---------------------------------
  // const onClickDelete = (id) => {
  //   Swal.fire({
  //     title: "Are You Sure",
  //     text: "Are you sure you want to remove this Attributes ?",
  //     icon: "question",
  //     showCancelButton: true,
  //     confirmButtonColor: "green",
  //     cancelButtonColor: "red",
  //     cancelButtonText: "No",
  //     confirmButtonText: "Yes",
  //     reverseButtons: true,
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       API.destroy(apiConfig.attributesId.replace(":id", id))
  //         .then((res) => {
  //           toaster.success("Deleted Successfully");
  //           paginate();
  //         })
  //         .catch((e) => HELPER.toaster.error(e.errors.message))
  //     }
  //   });
  // };

  return (
    <Container>
      <Box
        className="breadcrumb"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Breadcrumb
          routeSegments={[
            { name: "Masters", path: pageRoutes.master.user.user },
            { name: "Attributes" },
          ]}
        />
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
        emptyTableImg={<img src={error400cover} width="350px" />}
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
      {/* {open && ( */}
      <AttributesMasterDetails
        open={open}
        togglePopup={() => {
          togglePopup();
          // paginate();
        }}
        callBack={() => paginate()}
        userData={selectedUserData}
        editAttributeSingleData={editAttributeSingleData}
      />
      {/* )} */}
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

export default AttributesMaster;
