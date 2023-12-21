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
import SearchFilterDialog from "../../../../components/UI/Dialog/SearchFilterDialog";
import error400cover from "../../../../assets/no-data-found-page.png";
import Swal from "sweetalert2";
import { toaster } from "../../../../services/helper";
import DetailsMasterDetails from "./DetailsMasterDetails";
import ReactSelect from "../../../../components/UI/ReactSelect";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";

const DetailsMaster = () => {
  const [open, setOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [productDetailsGroupId, setProductDetailsGroupId] = useState([]);
  const [textModal, setTextModal] = useState(false);
  const [loading, setLoading] = useState();

  const [addressText, setAddressText] = useState("");
  const textModaltoggle = () => {
    setTextModal(!textModal);
  };
  /* Pagination code */
  const COLUMNS = [
    { title: "Detail Name", classNameWidth: "thead-second-width-title" },
    { title: "Group Name", classNameWidth: "thead-second-width-title" },
    { title: "Logo", classNameWidth: "thead-second-width" },
    { title: "Description", classNameWidth: "thead-second-width-title-answer" },
    { title: "Action", classNameWidth: "thead-second-width-action-index" },
  ];

  const { state, setState, changeState, ...otherTableActionProps } =
    usePaginationTable({
      // searchTxt: "",
      // isActive: "",
    });

  const paginate = (clear = false, isNewFilter = false) => {
    changeState("loader", true);
    let clearStates = {
      searchTxt: "",
      isActive: "",
      detailsGroupId: "",
      ...appConfig.default_pagination_state,
    };

    let filter = {
      page: state.page,
      searchTxt: state.searchTxt,
      isActive: state.isActive,
      rowsPerPage: state.rowsPerPage,
      detailsGroupId: state.detailsGroupId,
    };

    let newFilterState = { ...appConfig.default_pagination_state };
    if (clear) {
      delete filter.searchTxt;
      delete filter.isActive;
      delete filter.detailsGroupId;
    } else if (isNewFilter) {
      filter = _.merge(filter, newFilterState);
    }
    // ----------Get Product Details Group Api------------
    setLoading(true);
    API.get(apiConfig.productDetails, filter)
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

  //------------ Delete Lab --------------

  const onClickDelete = (id) => {
    Swal.fire({
      title: "Are You Sure",
      text: "Are you sure you want to remove this Product Details ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        API.destroy(`${apiConfig.productDetails}/${id}`)
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
    const address = item.description;
    setAddressText(address); // Set the address text
    textModaltoggle(); // Show the dialog
  };

  const rows = useMemo(() => {
    return state.data.map((item) => {
      return {
        item: item,
        columns: [
          <span>{item.detailName}</span>,
          <span>{item.groupName}</span>,
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
          <div>
            <span
              className="common-thead-second-width-title-answer"
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

  const togglePopupSearch = () => {
    setOpenSearch(!openSearch);
  };

  const handleEdit = (data) => {
    setSelectedUserData(data);
    setOpen(true);
  };

  useEffect(() => {
    API.get(apiConfig.listProductDetailGroup, { is_public_url: true })
      .then((res) => {
        setProductDetailsGroupId(res);
        paginate();
      })
      .catch(() => { });
  }, []);

  let _sortOptions = productDetailsGroupId.map((option) => ({
    label: option.groupName,
    value: option.id,
  }));
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
            { name: "Product Details" },
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
          className="button"
          onClick={togglePopup}
        >
          <Icon>add</Icon>
        </StyledAddButton>
      </Tooltip>

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
      >
        <div style={{ height: "200px" }}>
          {/* <ReactSelect
            label={"Product Details Group Name"}
            placeholder="Select Product Details Group Name"
            options={_sortOptions}
            onChange={(e) => {
              changeState("detailsGroupId", e?.target.value || "");
            }}
            name="detailsGroupId"
          /> */}

          <ReactSelect
            // label="Select Sort by Price"
            placeholder={
              _sortOptions.find(
                (option) => option.value === state.detailsGroupId
              )?.label || "Select Product Details Group Name"
            }
            options={_sortOptions}
            value={_sortOptions.find(
              (option) => option.value === state.detailsGroupId
            )}
            onChange={(selectedSort) => {
              const selectedId = selectedSort.target.value;
              changeState("detailsGroupId", selectedId);
            }}
            name="choices-multi-default"
          />
        </div>
      </SearchFilterDialog>

      <DetailsMasterDetails
        open={open}
        togglePopup={() => {
          togglePopup();
          // paginate();
        }}
        callBack={() => paginate(true)}
        userData={selectedUserData}
        productDetailsGroupId={productDetailsGroupId}
      />
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

export default DetailsMaster;
