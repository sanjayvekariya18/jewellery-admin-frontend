import React, { useEffect,useMemo, useState } from "react";
import { Box, Icon, IconButton, TableBody, TableCell, TableHead, TablePagination, TableRow, Tooltip } from "@mui/material";
import { Breadcrumb, Container, StyledAddButton, StyledTable } from "../../../../components";
import { apiEndPoint, pageRoutes } from "../../../../constants/routesList";
import { API, HELPER } from "../../../../services";
import { appConfig } from "./../../../../config";
import _ from "lodash";

import * as CONFIG from "../../../../constants/config";
import PaginationTable, { usePaginationTable } from "../../../../components/UI/Pagination/PaginationTable";
import useDidMountEffect from "../../../../hooks/useDidMountEffect";
import { useNavigate } from "react-router";

const PermissionsMaster = () => {

	const [openSearch, setOpenSearch] = useState(false);

	/* Pagination code */
	const COLUMNS = [
		{ title: "Permission"},
		{ title: "Group"},
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
		  orderBy: state.orderby
		};
	
		let newFilterState = { ...appConfig.default_pagination_state };
	
		if (clear) {
		  filter = _.merge(filter, clearStates);
		} else if (isNewFilter) {
		  filter = _.merge(filter, newFilterState);
		}
	
		// ----------Get Blog Api------------
		API.get(apiEndPoint.permission, filter)
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
		  }).finally(() => {
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
			  <span>{item.permissionName} </span>,
			  <span>{item.permissionGroup}</span>,
			],
		  };
		});
	  }, [state.data]);
	return (
		<Container>
			<Box className="breadcrumb">
				<Breadcrumb
					routeSegments={[
						{ name: "Masters", path: pageRoutes.master.user.permissions },
						{ name: "User", path: pageRoutes.master.user.permissions },
						{ name: "Permissions" },
					]}
				/>
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
				{...otherTableActionProps}
				orderBy={state.orderby}
				order={state.order}
			>
				
			</PaginationTable>
		</Container>
	);
};

export default PermissionsMaster;
