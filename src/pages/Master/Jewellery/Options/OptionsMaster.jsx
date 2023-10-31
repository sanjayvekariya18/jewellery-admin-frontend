import React, { useEffect, useMemo, useState } from "react";
import { Box, Icon, IconButton, Tooltip } from "@mui/material";
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
import OptionsMasterDetails from "./OptionsMasterDetails";
// import OptionsAttributeTable from "./OptionAttributeTable";

const OptionMaster = () => {
  const [open, setOpen] = useState(false);
  // const [openTable, setOpenTable] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);
  // const [selectAttributeData, setSelectAttributeData] = useState(null);

  /* Pagination code */
  const COLUMNS = [
    { title: "Name" },
    { title: "Logo Image" },
    { title: "Image" },
    { title: "Details" },
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
    API.get(apiConfig.options, filter)
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
      .catch((err) => {
        if (
          err.status === 400 ||
          err.status === 401 ||
          err.status === 409 ||
          err.status === 403
        ) {
          toaster.error(err.errors.message);
        } else {
          console.error(err);
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
  }, []);

  /* Pagination code */

  const togglePopup = () => {
    if (open) {
      setSelectedUserData(null);
    }
    setOpen(!open);
  };
  // const togglePopupTable = (name) => {
  //   setSelectAttributeData(name);
  //   setOpenTable(!openTable);
  // };

  const handleEdit = (data) => {
    setSelectedUserData(data);
    setOpen(true);
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
          <span className="three-dot-text">{item.details}</span>,
          <div>
            <IconButton onClick={(e) => handleEdit(item)}>
              <Icon color="primary">create</Icon>
            </IconButton>
            <IconButton onClick={(e) => onClickDelete(item.id)}>
              <Icon color="error">delete</Icon>
            </IconButton>
            {/* <IconButton onClick={() => togglePopupTable(item.name)}>
              <Icon color="error">remove_red_eye</Icon>
            </IconButton> */}
          </div>,
        ],
      };
    });
  }, [state.data]);
  // ------------------------------- Delete Shape ---------------------------------
  const onClickDelete = (id) => {
    Swal.fire({
      title: "Are You Sure",
      text: "Are you sure you want to remove this Option ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        API.destroy(`${apiConfig.options}/${id}`)
          .then((res) => {
            toaster.success("Deleted Successfully");
            paginate();
          })
          .catch(console.error);
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
            { name: "Options" },
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

      <OptionsMasterDetails
        open={open}
        togglePopup={() => {
          togglePopup();
          paginate();
        }}
        userData={selectedUserData}
      />
      {/* <OptionsAttributeTable
        open={openTable}
        togglePopup={() => {
          togglePopupTable();
          paginate();
        }}
        initialState={selectAttributeData}
      /> */}
    </Container>
  );
};

export default OptionMaster;
