import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  FormControlLabel,
  Icon,
  IconButton,
  Radio,
  RadioGroup,
  Button,
  Tooltip,
} from "@mui/material";
import { Breadcrumb, Container, StyledAddButton } from "../../../../components";
import { pageRoutes } from "../../../../constants/routesList";
import { API } from "../../../../services";
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
import BlogCategoryMasterDetails from "./BlogCategoryMasterDetails";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import Textarea from "../../../../components/UI/Textarea";

const BlogCategoryMaster = () => {
  const [open, setOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [textModal, setTextModal] = useState(false);
  const [addressText, setAddressText] = useState("");
  const textModaltoggle = () => {
    setTextModal(!textModal);
  };
  /* Pagination code */
  const COLUMNS = [
    { title: "Category Name", classNameWidth: "thead-second-width-title" },
    { title: "Description", classNameWidth: "thead-second-width-title-option" },
    { title: "Action", classNameWidth: "thead-second-width-action-index" },
  ];

  const { state, setState, changeState, ...otherTableActionProps } =
    usePaginationTable({
      searchTxt: "",
      isActive: "",
      order: "",
      orderby: "",
    });

  const paginate = (clear = false, isNewFilter = false) => {
    changeState("loader", true);
    let clearStates = {
      searchTxt: "",
      isActive: "",
      ...appConfig.default_pagination_state,
    };

    let filter = {
      page: state.page,
      searchTxt: state.searchTxt,
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

    // ----------Get Product Details Group Api------------
    API.get(apiConfig.blogCategory, filter)
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
      .catch(() => {
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

  //------------ Delete Lab --------------

  const onClickDelete = (id) => {
    Swal.fire({
      title: "Are You Sure",
      text: "Are you sure you want to remove this Blog Category ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        API.destroy(`${apiConfig.blogCategory}/${id}`)
          .then((res) => {
            toaster.success("Deleted Successfully");
            paginate();
          })
          .catch(console.error);
      }
    });
  };

  useEffect(() => {
    paginate();
  }, [state.page, state.rowsPerPage]);
  const showAddressInDialog = (item) => {
    const description = item.description;
    setAddressText(description); // Set the address text
    textModaltoggle(); // Show the dialog
  };

  const rows = useMemo(() => {
    return state.data.map((item) => {
      return {
        item: item,
        columns: [
          <span>{item.category_name}</span>,
          <div
            className="common-thead-second-width-title-option"
            style={{ fontWeight: "500", cursor: "pointer" }}
            onClick={() => showAddressInDialog(item)}
          >
            <span>{item.description}</span>
          </div>,
          <div>
            <IconButton onClick={(e) => handleEdit(item)}>
              <Icon color="primary">create</Icon>
            </IconButton>
            <IconButton onClick={(e) => onClickDelete(item.category_id)}>
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
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <Breadcrumb
          routeSegments={[
            { name: "Masters", path: pageRoutes.master.user.user },
            { name: "Blog Cateogry" },
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
        search={() => paginate(false, true)}
      >
        <Textinput
          size="small"
          type="text"
          name="searchTxt"
          label="Search Text"
          variant="outlined"
          value={state?.searchTxt}
          onChange={(e) => changeState("searchTxt", e.target.value.trim())}
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

      <BlogCategoryMasterDetails
        open={open}
        togglePopup={() => {
          togglePopup();
          paginate();
        }}
        userData={selectedUserData}
      />

      {textModal && (
        <ThemeDialog
          title="Description"
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

export default BlogCategoryMaster;
