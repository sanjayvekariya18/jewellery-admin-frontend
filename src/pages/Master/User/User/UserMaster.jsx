import React, { useEffect, useMemo, useState } from "react";
import { Box, Icon, IconButton, Tooltip } from "@mui/material";
import { Breadcrumb, Container, StyledAddButton } from "../../../../components";
import { apiEndPoint, pageRoutes } from "../../../../constants/routesList";
import { API, HELPER } from "../../../../services";
import { useNavigate } from "react-router-dom";
import UserMasterDetails from "./UserMasterDetails";
import PaginationTable, {
  usePaginationTable,
} from "../../../../components/UI/Pagination/PaginationTable";
import { apiConfig, appConfig } from "./../../../../config";
import _ from "lodash";
import SearchFilterDialog from "../../../../components/UI/Dialog/SearchFilterDialog";
import error400cover from "../../../../assets/no-data-found-page.png";
import ImgBoxShow from "../../../../components/UI/ImgBoxShow";
import ThemeRadioGroup from "../../../../components/UI/ThemeRadioGroup";
import { toaster } from "../../../../services/helper";
import Textinput from "../../../../components/UI/TextInput";
import LockResetIcon from '@mui/icons-material/LockReset';
import Swal from 'sweetalert2';
const UserMaster = () => {
  const [open, setOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [loading, setLoading] = useState();

  const navigate = useNavigate();

  /* Pagination code */
  const COLUMNS = [
    { title: "Profile", classNameWidth: "thead-second-width" },
    { title: "Name", classNameWidth: "thead-second-width-title" },
    { title: "Email", classNameWidth: "thead-second-width-title" },
    { title: "Active", classNameWidth: "thead-second-width-action" },
    { title: "Action", classNameWidth: "thead-second-width-action" },
    { title: "Permission", classNameWidth: "thead-second-width-action-index" },
    { title: "Reset Password", classNameWidth: "thead-second-width-action-index thead-second-width-action-index-responsive" },
  ];

  const {
    state,
    setState,
    changeState,
    getInitialStates,
    ...otherTableActionProps
  } = usePaginationTable({
    isActive: "",
  });

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
      delete filter.isActive;
      delete filter.searchTxt;
    } else if (isNewFilter) {
      filter = _.merge(filter, newFilterState);
    }

    // ----------Get Blog Api------------
    setLoading(true);
    API.get(apiEndPoint.user, filter)
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

  const rows = useMemo(() => {
    return state.data.map((item) => {
      return {
        item: item,
        columns: [
          <span className="main-image-box-user">
             <img
              className="rounded-circle header-profile-user"
              src={HELPER.getImageUrl(item.image)}
              alt=""
            />
          </span>,
          <span>
            {item.firstName} {item.lastName}
          </span>,
          <div>
            <span>{item.email}</span>
          </div>,
          <span>
            <IconButton onClick={() => handleToggle(item.id)}>
              <Icon
                color={item.isActive === true ? "success" : "error"}
                style={{ fontWeight: 700 }}
              >
                power_settings_new
              </Icon>
            </IconButton>
          </span>,

          <div>
            <IconButton onClick={(e) => handleEdit(item)}>
              <Icon color="primary">edit</Icon>
            </IconButton>
            {/* <IconButton onClick={(e) => handleDelete(item.id)}>
              <Icon color="error">close</Icon>
            </IconButton> */}
          </div>,

          <IconButton
            onClick={(e) =>
              navigate(
                `${pageRoutes.master.user.userPermissions.split(":")[0]}${item.id
                }`
              )
            }
          >
            <Icon color="warning">fingerprint</Icon>
          </IconButton>,
          <IconButton onClick={() => resetPassword(item.id)}>
            <LockResetIcon color="primary" style={{ fontSize: "28px" }} />
          </IconButton>
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
    API.put(`${apiConfig.user}/${id}/toggle`)
      .then((response) => {
        HELPER.toaster.success(response.message);
        paginate();
        setLoading(false);
      })
      .catch((e) => HELPER.toaster.error("Error " + e));
  };

  const handleEdit = (data) => {
    setSelectedUserData(data);
    setOpen(true);
  };
  const resetPassword = (id) => {
    API.put(`${apiConfig.resetPassword.replace(':id', id)}`)
      .then((res) => {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: res.message,
        });
      })
      .catch((error) => {
        HELPER.toaster.error(error.errors);
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
            { name: "User" },
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

      <SearchFilterDialog
        isOpen={openSearch}
        onClose={() => setOpenSearch(false)}
        reset={() => {
          changeState("searchTxt", ""); // Clear the search text
          paginate(true);
        }}
        search={() => {
          paginate(false, true);
          setOpenSearch(false); // Close the modal
        }}
        maxWidth="sm"
        loader={loading}
      >
        <Textinput
          size="small"
          type="text"
          name="searchTxt"
          autoFocus={true}
          label="Search Text"
          value={state?.searchTxt || ''}
          onChange={(e) => changeState("searchTxt", e.target.value)}
          sx={{ mb: 2, mt: 1, width: "100%" }}
        />

        <ThemeRadioGroup
          name="isActive"
          value={state?.isActive}
          onChange={(e) => changeState("isActive", e.target.value)}
          options={[
            {
              label: "All",
              value: "",
              color: "default",
            },
            {
              label: "Active",
              value: "1",
              color: "success",
            },
            {
              label: "Inactive",
              value: "0",
              color: "error",
            },
          ]}
        />
      </SearchFilterDialog>

      <UserMasterDetails
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

export default UserMaster;
