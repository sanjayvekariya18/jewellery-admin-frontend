import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { appConfig } from "./../../../config";

import {
  Box,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import StyledTable from "../../StyledTable";
import { visuallyHidden } from "@mui/utils";

const rowsPerPageOptions = [10, 25, 50, 100];

export const usePaginationTable = (initialState = {}) => {
  const [state, setState] = useState({
    total_items: 0,
    data: [],
    ...appConfig.default_pagination_state,
    selectedRows: [],
    loader: false,
    order: "",
    orderby: "",
    ...initialState,
  });

  const changeState = (field, value) => {
    setState((previous) => {
      return {
        ...previous,
        [field]: value,
      };
    });
  };

  const getInitialStates = () => {
    return {
      total_items: 0,
      data: [],
      ...appConfig.default_pagination_state,
      selectedRows: [],
      loader: false,
      order: "",
      orderby: "",
      ...initialState,
    };
  };

  // Per Page & Page Setting
  const changePerPage = useCallback(
    (value) => {
      changeState("rowsPerPage", value);
      changeState("page", 0);
    },
    [changeState]
  );

  const changeActivePage = useCallback(
    (value) => {
      changeState("page", value);
    },
    [changeState]
  );

  const onCheckBoxSelect = useCallback(
    (ids) => {
      changeState("selectedRows", ids);
    },
    [changeState]
  );

  const changeOrder = useCallback(
    (orderby, order) => {
      setState((previous) => ({
        ...previous,
        orderby,
        order,
      }));
    },
    [setState]
  );

  return {
    state,
    setState,
    changeState,
    changePerPage,
    changeActivePage,
    changeOrder,
    onCheckBoxSelect,
    getInitialStates,

  };
};

export default function PaginationTable({

  // Table Header & Body Setting
  header,
  rows,
  totalItems,

  // Sorting Setting
  enableOrder,
  orderBy,
  order,
  changeOrder,

  // Checkbox Column & Filter Section(children) Setting
  children,
  checkboxColumn,
  selectedRows,
  onCheckBoxSelect,
  emptyTableImg = null,

  // Per Page & Page Setting
  pageSizeArr,
  perPage,
  changePerPage,
  activePage,
  changeActivePage,
  isLoader = true,
  isModalTrue = false,
  selectedRowId,
  footerVisibility,
  selectAllCheckbox,

}) {
  const _onChangeSelect = (e) => {
    console.log("Event:", e);
  
    if (e.target.getAttribute("data-all")) {
      // Handle "Select All" checkbox
      const newSelectedRows = e.target.checked ? rows.map((row) => row.checkboxValue) : [];
      console.log("New Selected Rows:", newSelectedRows);
      onCheckBoxSelect(newSelectedRows);
    } else {
      // Handle individual checkboxes
      const currentValue = e.target.value;
      const updatedSelectedRows = e.target.checked
        ? [...selectedRows, currentValue]
        : selectedRows.filter((value) => value !== currentValue);
  
      console.log("Updated Selected Rows:", updatedSelectedRows);
      onCheckBoxSelect(updatedSelectedRows);
    }
  };
  

  // Show Page
  const selectOptions = pageSizeArr.map((pageSize) => ({
    label: `Show ${pageSize}`,
    value: pageSize,
  }));

  return (
    <React.Fragment>
      <Box width="100%" overflow="auto">
        <StyledTable className="common-table-row">
          <TableHead>
            <TableRow>
              {selectAllCheckbox && (
                <TableCell>
                  {selectAllCheckbox}
                </TableCell>
              )}

              {header.map((headerItem, headerIndex) => {
                return (
                  <TableCell
                    align="center"
                    key={`tr_${headerIndex}`}
                    // className={`${
                    //   headerItem.title === "Product Name"
                    //     ? "width-apply-th"
                    //     : ""
                    // }`}
                    className={headerItem.classNameWidth || ""}
                  >
                    {enableOrder && headerItem?.order ? (
                      <TableSortLabel
                        active={headerItem.field == orderBy}
                        direction={order == "asc" ? "desc" : "asc"}
                        onClick={() => {
                          changeOrder(
                            headerItem.field,
                            order == "asc" ? "desc" : "asc"
                          );
                        }}
                      >
                        {`${headerItem.title} `}
                        <Box component="span" sx={visuallyHidden}>
                          {order === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      </TableSortLabel>
                    ) : (
                      <>{`${headerItem.title} `}</>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoader ? (
              <TableRow>
                <TableCell colSpan={header.length} align="center">
                  <div
                    style={{
                      margin: "4px auto",
                      textAlign: "center",
                    }}
                  >
                    <img
                      src="../../../assets/loading.gif"
                      alt=""
                      srcSet=""
                      height={28}
                      width={28}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, rowIndex) => (
                < TableRow key={`tr_${rowIndex}`} className={selectedRowId && (row.item.banner_id === selectedRowId || row.item.slider_id === selectedRowId ? 'selected-row' : '')}>
                  <>
                    {row.columns.map((column, columnIndex) => (
                      <TableCell key={`td_${rowIndex}_${columnIndex}`} align="center">
                        <label
                          htmlFor={
                            row.item.slider_id
                          }
                          style={{
                            height: '50%', // Adjust the percentage value as needed
                            width: '100%',
                            display: 'block',

                          }}
                        >
                          {column}
                        </label>
                      </TableCell>
                    ))}
                  </>
                </TableRow>
              ))
            )}
          </TableBody>
        </StyledTable>
        {isLoader === false && rows?.length === 0 && activePage === 0 && (
          <>
            <div
              className=""
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "center",
              }}
            >
              {emptyTableImg}
            </div>
          </>
        )}
      </Box>

      {
        footerVisibility && (
          <div className="main-footer-table-pagination">
            <TablePagination
              sx={{ px: 2 }}
              page={activePage}
              component="div"
              rowsPerPage={perPage}
              count={totalItems}
              onPageChange={(_, pageNumber) => changeActivePage(pageNumber)}
              rowsPerPageOptions={rowsPerPageOptions}
              onRowsPerPageChange={(event) =>
                changePerPage(Number(event.target.value))
              }
              nextIconButtonProps={{ "aria-label": "Next Page" }}
              backIconButtonProps={{ "aria-label": "Previous Page" }}
              showFirstButton={true}
              showLastButton={true}
            />
          </div>
        )
      }
    </React.Fragment >
  );
}

PaginationTable.defaultProps = {
  children: null,
  checkboxColumn: false,

  pageSizeArr: [10, 50, 100, 200],

  enableOrder: false,
  footerVisibility: true,
  selectAllCheckbox: null,

};

PaginationTable.propTypes = {
  header: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  totalItems: PropTypes.number.isRequired,

  enableOrder: PropTypes.bool,
  orderBy: PropTypes.string,
  order: PropTypes.string,
  changeOrder: PropTypes.func,

  children: PropTypes.node,

  checkboxColumn: PropTypes.bool,
  selectedRows: PropTypes.array,
  onCheckBoxSelect: PropTypes.func,

  pageSizeArr: PropTypes.array,
  perPage: PropTypes.number,
  changePerPage: PropTypes.func.isRequired,
  activePage: PropTypes.number,
  changeActivePage: PropTypes.func.isRequired,

  footerVisibility: PropTypes.bool,
  selectedRowId: PropTypes.string,
  selectAllCheckbox: PropTypes.element,
};
