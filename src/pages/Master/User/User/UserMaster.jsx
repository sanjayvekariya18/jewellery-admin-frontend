import React, { useMemo, useState } from "react";
import {
  Box,
  Icon,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  Breadcrumb,
  Container,
  StyledAddButton,
} from "../../../../components";
import { apiEndPoint, pageRoutes } from "../../../../constants/routesList";
import { API, HELPER } from "../../../../services";
import { useNavigate } from "react-router-dom";
import UserMasterDetails from "./UserMasterDetails";
import PaginationTable, {
  usePaginationTable,
} from "../../../../components/UI/Pagination/PaginationTable";
import { appConfig } from "./../../../../config";
import _ from "lodash";
import useDidMountEffect from "../../../../hooks/useDidMountEffect";
import SearchFilterDialog from "../../../../components/UI/Dialog/SearchFilterDialog";
import error400cover from "../../../../assets/no-data-found-page.png";
import ImgBoxShow from "../../../../components/UI/ImgBoxShow";
import ThemeRadioGroup from "../../../../components/UI/ThemeRadioGroup";

const UserMaster = () => {
  const [open, setOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const navigate = useNavigate();
  const url = apiEndPoint.user;

  /* Pagination code */
  const COLUMNS = [
    { title: "Name" },
    { title: "Email" },
    { title: "Active" },
    { title: "Image" },
    { title: "Action" },
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

    // ----------Get Blog Api------------
    API.get(apiEndPoint.user, filter)
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

  useDidMountEffect(() => {
    paginate();
  }, [state.page, state.rowsPerPage, state.order, state.orderby]);

  const rows = useMemo(() => {
    return state.data.map((item) => {
      return {
        item: item,
        columns: [
          <span>
            {item.firstName} {item.lastName}
          </span>,
          <span>{item.email}</span>,
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
          <span>
            <ImgBoxShow src={item.image} />
          </span>,
          <div>
            <IconButton
              onClick={(e) =>
                navigate(
                  `${pageRoutes.master.user.userPermissions.split(":")[0]}${item.id
                  }`
                )
              }
            >
              <Icon color="warning">fingerprint</Icon>
            </IconButton>
            <IconButton onClick={(e) => handleEdit(item)}>
              <Icon color="primary">edit</Icon>
            </IconButton>
            {/* <IconButton onClick={(e) => handleDelete(item.id)}>
              <Icon color="error">close</Icon>
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

  const togglePopupSearch = () => {
    setOpenSearch(!openSearch);
  };

  const handleToggle = (id) => {
    API.put(`${url}/${id}/toggle`)
      .then((response) => {
        HELPER.toaster.success(response.message);
        paginate();
      })
      .catch((e) => HELPER.toaster.error("Error " + e));
  };

  const handleEdit = (data) => {
    setSelectedUserData(data);
    setOpen(true);
  };

  const handleDelete = (id) => {
    HELPER.sweetAlert.delete().then(() => {
      API.destroy(`${url}/${id}`)
        .then(() => {
          HELPER.toaster.success("Record Deleted");
          paginate();
        })
        .catch((e) => HELPER.toaster.error("Error " + e));
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
        totalItems={state.total_items}
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
        <TextField
          fullWidth={true}
          size="small"
          type="text"
          name="searchTxt"
          label="Search Text"
          variant="outlined"
          value={state?.searchTxt}
          onChange={(e) => changeState("searchTxt", e.target.value)}
          sx={{ mb: 2, mt: 1 }}
        />

        <ThemeRadioGroup
          name="isActive"
          value={state?.isActive}
          onChange={(e) => changeState("isActive", e.target.value)}
          options={[
            {
              label: "All",
              value: "",
              color: "default"
            },
            {
              label: "Active",
              value: "1",
              color: "success"
            },
            {
              label: "Inactive",
              value: "0",
              color: "error"
            },
          ]}
        />

      </SearchFilterDialog>

      <UserMasterDetails
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

export default UserMaster;
