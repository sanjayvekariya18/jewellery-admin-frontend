import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Icon,
  IconButton,
  Button,
  Tooltip,
  Typography,
} from "@mui/material";
import { Breadcrumb, Container, StyledAddButton } from "../../../../components";
import { pageRoutes } from "../../../../constants/routesList";
import { API, HELPER } from "../../../../services";
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
import BlogMasterDetails from "./BlogMasterDetails";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import moment from "moment";
import ReactSelect from "../../../../components/UI/ReactSelect";
import Flatpickr from "react-flatpickr";
import momentTimezone from "moment-timezone";
import "flatpickr/dist/themes/material_blue.css";
import "flatpickr/dist/themes/airbnb.css";

const BlogMaster = () => {
  const [open, setOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [textModal, setTextModal] = useState(false);
  const [addressText, setAddressText] = useState("");
  const [dateRange, setDateRange] = useState([null, null]);
  const [loading, setLoading] = useState();

  const textModaltoggle = () => {
    setTextModal(!textModal);
  };
  const [blogCategoryData, setBlogCategoryData] = useState([]);

  /* Pagination code */
  const COLUMNS = [
    { title: "Title", classNameWidth: "thead-second-width-title-blog" },
    { title: "Category Name", classNameWidth: "thead-second-width-title" },
    { title: "Image", classNameWidth: "thead-second-width" },
    { title: "Date", classNameWidth: "thead-second-width" },
    { title: "Action", classNameWidth: "thead-second-width-action-index" },
  ];

  const {
    state,
    setState,
    getInitialStates,
    changeState,
    ...otherTableActionProps
  } = usePaginationTable({});

  const paginate = (clear = false, isNewFilter = false) => {
    changeState("loader", true);
    let clearStates = {
      ...appConfig.default_pagination_state,
    };

    let filter = {
      page: state.page,
      searchTxt: state.searchTxt,
      from_date:
        !clear && dateRange[0]
          ? momentTimezone
            .tz(
              dateRange[0],
              Intl.DateTimeFormat().resolvedOptions().timeZone
            )
            .format(appConfig.dateDisplayEditFormat)
          : null,
      to_date:
        !clear && dateRange[1]
          ? momentTimezone
            .tz(
              dateRange[1],
              Intl.DateTimeFormat().resolvedOptions().timeZone
            )
            .format(appConfig.dateDisplayEditFormat)
          : null,
      category_id: state.category_id,
      isActive: state.isActive,
      rowsPerPage: state.rowsPerPage,
    };

    let newFilterState = { ...appConfig.default_pagination_state };

    if (clear) {
      delete filter.category_id;
      delete filter.isActive;
      delete filter.searchTxt;
      delete filter.from_date;
      delete filter.to_date;
      setDateRange([null, null]); // Reset date range here
    } else if (isNewFilter) {
      filter = _.merge(filter, newFilterState);
    }

    // ----------Get Product Details Group Api------------
    setLoading(true);
    API.get(apiConfig.blog, filter)
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
      .catch(() => {
        setLoading(false);
        setState({
          ...state,
          ...(clear && clearStates),
          ...(isNewFilter && newFilterState),
          loader: false,
        });
      });
    // .finally(() => {
    //   if (openSearch == true) {
    //     setOpenSearch(false);
    //   }
    // });
  };

  //------------ Delete Blog --------------

  const onClickDelete = (id) => {
    Swal.fire({
      title: "Are You Sure",
      text: "Are you sure you want to remove this Blog ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        API.destroy(`${apiConfig.blog}/${id}`)
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

  useEffect(() => {
    API.get(apiConfig.listblogCategory, { is_public_url: true })
      .then((res) => {
        setBlogCategoryData(res);
        paginate();
      })
      .catch(() => { });
  }, []);

  const rows = useMemo(() => {
    return state.data.map((item) => {
      return {
        item: item,
        columns: [
          <div className="common-thead-second-width-title-blog">
            <span>{item.title}</span>
          </div>,
          <span>{item.category_name}</span>,
          <span>
            {item.featured_image && item.featured_image !== null && (
              <Box
                component="img"
                sx={{
                  height: 40,
                  width: 40,
                  maxHeight: { xs: 25, md: 50 },
                  maxWidth: { xs: 25, md: 50 },
                }}
                src={HELPER.getImageUrl(item.featured_image)}
              />
            )}
          </span>,
          <span>
            {moment(item.publish_date).format(appConfig.dateAndTimeDisplayFormat)}
          </span>,
          <div>
            <IconButton onClick={(e) => handleEdit(item)}>
              <Icon color="primary">create</Icon>
            </IconButton>
            <IconButton onClick={(e) => onClickDelete(item.blog_id)}>
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

  let _sortOptions = blogCategoryData.map((option) => ({
    label: option.category_name,
    value: option.category_id,
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
            { name: "Blog" },
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
      {/* Pagination Table */}
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

      {/* search filter */}
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
          type="text"
          name="searchTxt"
          label="Search Text"
          variant="outlined"
          autoFocus={true} 
          value={state?.searchTxt || ""}
          onChange={(e) => changeState("searchTxt", e.target.value)}
          sx={{ mb: 0, mt: 1, width: "100%" }}
        />
        <div className="text-input-top">
          <Flatpickr
            className="flatpickr-input"
            placeholder="Select Date Range"
            onChange={(date) => setDateRange(date)}
            value={dateRange}
            options={{
              mode: "range",
              dateFormat: "Y-m-d",
            }}
          />
        </div>
        <div style={{ height: "200px" }} className="text-input-top">
        <ReactSelect
              placeholder="Select Category Name"
              options={_sortOptions}
              value={state.category_id}
              onChange={(e) => {
                changeState("category_id", e.target.value || "");
              }}
              name="category_id"
            />
          {/* <ReactSelect
            placeholder={
              _sortOptions.find((option) => option.value === state.category_id)
                ?.label || "Select Category Name"
            }
            options={_sortOptions}
            value={_sortOptions.find(
              (option) => option.value === state.category_id
            )}
            onChange={(selectedSort) => {
              const selectedId = selectedSort.target.value;
              changeState("category_id", selectedId);
            }}
            name="choices-multi-default"
          /> */}
        </div>
      </SearchFilterDialog>

      {/* added to model */}
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

      {/* Blog Master details */}
      <BlogMasterDetails
        open={open}
        togglePopup={() => {
          togglePopup();
          // paginate();
        }}
        userData={selectedUserData}
        blogCategoryData={blogCategoryData}
        callBack={() => paginate()}

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

export default BlogMaster;
