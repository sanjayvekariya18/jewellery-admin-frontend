import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Icon,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Breadcrumb, Container, StyledAddButton } from "../../../../components";
import { pageRoutes } from "../../../../constants/routesList";
import { API, HELPER } from "../../../../services";
import PaginationTable, {
  usePaginationTable,
} from "../../../../components/UI/Pagination/PaginationTable";
import { apiConfig, appConfig } from "./../../../../config";
import SearchFilterDialog from "../../../../components/UI/Dialog/SearchFilterDialog";
import error400cover from "../../../../assets/no-data-found-page.png";
import Swal from "sweetalert2";
import { toaster } from "../../../../services/helper";
import DetailsGroupMasterDetails from "./DetailsGroupMasterDetails";
import Textinput from "../../../../components/UI/TextInput";
import _ from "lodash"

const DetailsGroupMaster = () => {
  const [open, setOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [loading, setLoading] = useState();


  /* Pagination code */
  const COLUMNS = [
    { title: "Group Name" },
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
      searchTxt: clear ? clearStates.searchTxt : state.searchTxt,
      page: state.page,
      rowsPerPage: state.rowsPerPage,
    };

    let newFilterState = { ...appConfig.default_pagination_state };
    if (clear) {
      delete filter.searchTxt;
    } else if (isNewFilter) {
      filter = _.merge(filter, newFilterState);
    }






    // ----------Get Product Details Group Api------------
    setLoading(true);
    API.get(apiConfig.productDetailGroup, filter)
      .then((res) => {
        console.log(res,"res");
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
          .catch((e) => HELPER.toaster.error(e.errors.message))
      }
    });
  };

  useEffect(() => {
    paginate();
  }, [state.page, state.rowsPerPage]);                                                     

  const rows = useMemo(() => {
    return state.data.map((item) => {
      console.log(item,"hello");
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
          focused={true}
          type="text"
          name="searchTxt"
          label="Search Text"
          autoFocus={true}
          variant="outlined"
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
      <DetailsGroupMasterDetails
        open={open}
        togglePopup={() => {
          togglePopup();
          // paginate();
        }}
        userData={selectedUserData}
        callBack={() => paginate()}
      />
    </Container>
  );
};

export default DetailsGroupMaster;
