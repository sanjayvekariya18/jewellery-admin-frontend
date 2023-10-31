import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  FormControlLabel,
  Icon,
  IconButton,
  Radio,
  RadioGroup,
  Tooltip,
} from "@mui/material";
import { Breadcrumb, Container, StyledAddButton } from "../../../../components";
import { pageRoutes } from "../../../../constants/routesList";
import { API } from "../../../../services";
import PaginationTable, {
  usePaginationTable,
} from "../../../../components/UI/Pagination/PaginationTable";
import { apiConfig, appConfig } from "./../../../../config";
import _ from "lodash";
import SearchFilterDialog from "../../../../components/UI/Dialog/SearchFilterDialog";
import error400cover from "../../../../assets/no-data-found-page.png";
import Swal from "sweetalert2";
import { toaster } from "../../../../services/helper";
import DetailsGroupMasterDetails from "./DetailsGroupMasterDetails";
import Textinput from "../../../../components/UI/TextInput";

const DetailsGroupMaster = () => {
  const [open, setOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);

  /* Pagination code */
  const COLUMNS = [{ title: "Group Name" }, { title: "Action" }];

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
    API.get(apiConfig.productDetailGroup, filter)
      .then((res) => {
        setState({
          ...state,
          total_items: res.count,
          data: res,
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
      text: "Are you sure you want to remove this Product Details Group ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        API.destroy(`${apiConfig.productDetailGroup}/${id}`)
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
  }, []);

  const rows = useMemo(() => {
    return state.data.map((item) => {
      return {
        item: item,
        columns: [
          <span>{item.groupName}</span>,
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
            { name: "Product Details Group" },
          ]}
        />
        {/* <Tooltip title="Filter">
          <IconButton
            color="inherit"
            className="button"
            aria-label="Filter"
            onClick={togglePopupSearch}
          >
            <Icon>filter_list</Icon>
          </IconButton>
        </Tooltip> */}
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
        footerVisibility={false}
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

      <SearchFilterDialog
        isOpen={openSearch}
        onClose={() => setOpenSearch(false)}
        reset={() => paginate(true)}
        search={() => paginate(false, true)}
      >
        <Textinput
          size="small"
          type="text"
          name="searchTxt"
          label="Search Text"
          value={state?.searchTxt}
          onChange={(e) => changeState("searchTxt", e.target.value)}
          sx={{ mb: 2, mt: 1 }}
        />
        <RadioGroup
          row
          aria-label="position"
          name="isActive"
          value={state?.isActive}
          onChange={(e) => changeState("isActive", e.target.value)}
        >
          <FormControlLabel
            value=""
            label="All"
            labelPlacement="start"
            control={<Radio color="default" />}
          />
          <FormControlLabel
            value="1"
            label="Active"
            labelPlacement="start"
            control={<Radio color="success" />}
          />
          <FormControlLabel
            value="0"
            label="Inactive"
            labelPlacement="start"
            control={<Radio color="error" />}
          />
        </RadioGroup>
      </SearchFilterDialog>

      <DetailsGroupMasterDetails
        open={open}
        togglePopup={() => {
          togglePopup();
          paginate();
        }}
        userData={selectedUserData}
      />
    </Container>
  );
};

export default DetailsGroupMaster;
