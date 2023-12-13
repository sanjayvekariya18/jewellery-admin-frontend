import React, { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";
import { Container } from "../../../../components";
import { API, HELPER } from "../../../../services";
import PaginationTable, {
  usePaginationTable,
} from "../../../../components/UI/Pagination/PaginationTable";
import { apiConfig, appConfig } from "./../../../../config";
import _ from "lodash";
import error400cover from "../../../../assets/no-data-found-page.png";
import { toaster } from "../../../../services/helper";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";

const OptionsAttributeTable = ({ open, togglePopup, initialState }) => {
  /* Pagination code */
  const COLUMNS = [
    { title: "Attribute Name" },
    { title: "Option Name" },
    { title: "Option Logo" },
    { title: "Option Image" },
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

    let newFilterState = { ...appConfig.default_pagination_state };

    // ----------Get Blog Api------------
    API.get(apiConfig.optionsAttributes.replace(":name", initialState))
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

  const rows = useMemo(() => {
    return state.data.map((item) => {
      return {
        item: item,
        columns: [
          <span>{item.attributeName}</span>,
          <span>{item.optionName}</span>,
          <span>
            {item.optionLogo && item.optionLogo !== null && (
              <Box
                component="img"
                sx={{
                  height: 50,
                  width: 50,
                  maxHeight: { xs: 25, md: 50 },
                  maxWidth: { xs: 25, md: 50 },
                }}
                src={HELPER.getImageUrl(item.optionLogo)}
              />
            )}
          </span>,
          <span>
            {item.optionImage && item.optionImage !== null && (
              <Box
                component="img"
                sx={{
                  height: 50,
                  width: 50,
                  maxHeight: { xs: 25, md: 50 },
                  maxWidth: { xs: 25, md: 50 },
                }}
                src={HELPER.getImageUrl(item.optionImage)}
              />
            )}
          </span>,
        ],
      };
    });
  }, [state.data]);

  return (
    <ThemeDialog
      title={"Option Attribute Table"}
      isOpen={open}
      onClose={() => {
        togglePopup();
      }}
    >
      <Container>
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
      </Container>
    </ThemeDialog>
  );
};

export default OptionsAttributeTable;
