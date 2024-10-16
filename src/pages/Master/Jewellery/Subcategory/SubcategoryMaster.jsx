import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Icon,
  IconButton,
  Tooltip,
  Button,
  Typography,
} from "@mui/material";
import Select from "react-select";
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
import SubcategoryMasterDetails from "./SubcategoryMasterDetails";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import SearchFilterDialog from "../../../../components/UI/Dialog/SearchFilterDialog";

const SubcategoryMaster = () => {
  const [open, setOpen] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [textModal, setTextModal] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [loading, setLoading] = useState();
  const [categoryMaster, setCategoryMaster] = useState([]);
  const [addressText, setAddressText] = useState("");
  const textModaltoggle = () => {
    setTextModal(!textModal);
  };
  const togglePopupSearch = () => {
    setOpenSearch(!openSearch);
  };
  /* Pagination code */
  const COLUMNS = [
    { title: "Name", classNameWidth: "thead-second-width-title" },
    {
      title: "Category Name",
      classNameWidth: "thead-second-width-title-answer",
    },
    { title: "Logo Image", classNameWidth: "thead-second-width" },
    { title: "Image", classNameWidth: "thead-second-width" },
    {
      title: "Details",
      classNameWidth: "thead-second-width-title-answer",
    },
    { title: "Action", classNameWidth: "thead-second-width-action-index" },
  ];

  const { state, setState, changeState, getInitialStates, ...otherTableActionProps } =
    usePaginationTable({});

  const paginate = (clear = false, isNewFilter = false) => {
    changeState("loader", true);
    let clearStates = {
      ...appConfig.default_pagination_state,
    };

    let filter = {
      page: state.page,
      rowsPerPage: state.rowsPerPage,
      categoryIds: state.categoryIds,
    };

    let newFilterState = { ...appConfig.default_pagination_state };

    if (clear) {
      delete filter.categoryIds;
    } else if (isNewFilter) {
      filter = _.merge(filter, newFilterState);
    }


    // ----------Get Blog Api------------
    API.get(apiConfig.subCategory, filter)
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
      .catch((err) => {
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
    setAddressText(address); // Set the address text
    textModaltoggle(); // Show the dialog
  };

  const rows = useMemo(() => {
    return state.data.map((item) => {
      return {
        item: item,
        columns: [
          <span>{item.name}</span>,
          <span>{item.categoryName}</span>,

          // <span>
          //   {item.logoUrl && item.logoUrl !== null && (
          //     <Box
          //       component="img"
          //       sx={{
          //         height: 40,
          //         width: 40,
          //         maxHeight: { xs: 25, md: 50 },
          //         maxWidth: { xs: 25, md: 50 },
          //       }}
          //       src={HELPER.getImageUrl(item.logoUrl)}
          //     />
          //   )}
          // </span>,
          <span className="main-image-box-user">
            <img
              src={HELPER.getImageUrl(item.logoUrl)}
              alt=""
            />
          </span>,
          // <span>
          //   {item.imgUrl && item.imgUrl !== null && (
          //     <Box
          //       component="img"
          //       sx={{
          //         height: 40,
          //         width: 40,
          //         maxHeight: { xs: 25, md: 50 },
          //         maxWidth: { xs: 25, md: 50 },
          //       }}
          //       src={HELPER.getImageUrl(item.imgUrl)}
          //     />
          //   )}
          // </span>,
          <span className="main-image-box-user">
            <img
              src={HELPER.getImageUrl(item.imgUrl)}
              alt=""
            />
          </span>,
          <div>
            <span
              className="common-thead-second-width-title-answer"
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
  const onClickDelete = (id) => {
    Swal.fire({
      title: "Are You Sure",
      text: "Are you sure you want to remove this Sub Category ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        API.destroy(`${apiConfig.subCategory}/${id}`)
          .then((res) => {
            toaster.success("Deleted Successfully");
            paginate();
          })
          .catch((e) => HELPER.toaster.error(e.errors.message))
      }
    });
  };
  // ------------------Get Shap API --------------------------------

  useEffect(() => {
    API.get(apiConfig.category, { is_public_url: true })
      .then((res) => {
        setCategoryMaster(res.rows);
      })
      .catch(() => { });
  }, []);

  // ------------Shap List--------------------------------
  let _sortOptionsCategory = categoryMaster && categoryMaster.map((option) => ({
    label: option.name,
    value: option.id,
  }));

  return (
    <Container>
      <Box
        className="breadcrumb"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Breadcrumb
          routeSegments={[
            { name: "Masters", path: pageRoutes.master.user.user },
            { name: "Sub Category" },
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
        isLoader={state.loader}
        emptyTableImg={<img src={error400cover} width="350px" />}
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
        loader={loading}
        className="product-details-select-box"
      >
        <div>
          <Select
            label="Select Category Name"
            placeholder="Select Category Name"
            options={_sortOptionsCategory}
            isMulti
            value={_sortOptionsCategory.filter(
              (option) =>
                state.categoryIds && state.categoryIds.includes(option.value)
            )}
            onChange={(selectedSort) => {
              const selectedIds = selectedSort && selectedSort.map(
                (option) => option.value
              );
              changeState("categoryIds", selectedIds);
            }}
            name="choices-multi-default"
            id="shape"
          />
        </div>
      </SearchFilterDialog>
      <Tooltip title="Create" placement="top">
        <StyledAddButton
          color="secondary"
          aria-label="Add"
          className="button sub-category-tooltip"
          onClick={togglePopup}
        >
          <Icon>add</Icon>
        </StyledAddButton>
      </Tooltip>
      {open && (
        <SubcategoryMasterDetails
          open={open}
          togglePopup={() => {
            togglePopup();
            // paginate();
          }}
          callBack={() => paginate()}
          userData={selectedUserData}
        />
      )}
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

export default SubcategoryMaster;
