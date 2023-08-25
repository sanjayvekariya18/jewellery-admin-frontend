import React, { useEffect, useState } from "react";
import { Box, Icon, IconButton, TableBody, TableCell, TableHead, TablePagination, TableRow, Tooltip } from "@mui/material";
import { Breadcrumb, Container, StyledAddButton, StyledTable } from "../../../../components";
import { apiEndPoint, pageRoutes } from "../../../../constants/routesList";
import { API, HELPER } from "../../../../services";
import * as CONFIG from "../../../../constants/config";
import { useNavigate } from "react-router-dom";
import UserMasterDetails from "./UserMasterDetails";

const UserMaster = () => {
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(8);
	const [tableDataCount, setTableDataCount] = useState(0);
	const [tableData, setTableData] = useState([]);
	const [open, setOpen] = useState(false);
	const [selectedUserData, setSelectedUserData] = useState(null);
    const navigate = useNavigate();
	const url = apiEndPoint.user;

	const handleChangePage = (_, newPage) => {
		setPage(newPage);
		getTableData(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(+event.target.value);
		setPage(0);
		getTableData(0, +event.target.value);
	};

	const getTableData = (pg = page, rpp = rowsPerPage) => {
		API.get(url, { page: pg, rowsPerPage: rpp }).then((response) => {
			setTableDataCount(response.count);
			setTableData(response.rows);
		});
	};

	useEffect(() => {
		getTableData();
	}, []);

	const togglePopup = () => {
		if (open) {
			getTableData();
			setSelectedUserData(null);
		}
		setOpen(!open);
	};

	const handleToggle = (id) => {
		API.put(`${apiEndPoint.user}/${id}/toggle`)
			.then((response) => {
				HELPER.toaster.success(response.message);
				getTableData();
			})
			.catch((e) => HELPER.toaster.error("Error " + e));
	};

	const handleEdit = (data) => {
		setSelectedUserData(data);
		togglePopup();
	};

	const handleDelete = (id) => {
		HELPER.sweetAlert.delete().then(() => {
			API.destroy(`${url}/${id}`)
				.then(() => {
					HELPER.toaster.success("Record Deleted");
					getTableData();
				})
				.catch((e) => HELPER.toaster.error("Error " + e));
		});
	};

	return (
		<Container>
			<Box className="breadcrumb">
				<Breadcrumb
					routeSegments={[
						{ name: "Masters", path: pageRoutes.master.user.user },
						{ name: "User" },
					]}
				/>
			</Box>
			<Box width="100%" overflow="auto">
				<StyledTable>
					<TableHead>
						<TableRow>
							<TableCell align="left" width="30%">
								Name
							</TableCell>
							<TableCell align="left">Email</TableCell>
							<TableCell align="left" width="50px">
								Active
							</TableCell>
							<TableCell align="center" width="100px">
								Image
							</TableCell>
							<TableCell align="center" width="150px">
								Action
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{tableData.map((row, index) => (
							<TableRow key={index}>
								<TableCell align="left">
									{row.firstName} {row.lastName}
								</TableCell>
								<TableCell align="left" style={{ textTransform: "none" }}>
									{row.email}
								</TableCell>
								<TableCell align="left">
									<IconButton onClick={() => handleToggle(row.id)}>
										<Icon color={row.isActive === true ? "success" : "error"} style={{ fontWeight: 700 }}>
											power_settings_new
										</Icon>
									</IconButton>
								</TableCell>
								<TableCell align="center">
									{row.image && row.image !== null && (
										<Box
											component="img"
											sx={{
												height: 50,
												width: 50,
												maxHeight: { xs: 25, md: 50 },
												maxWidth: { xs: 25, md: 50 },
											}}
											src={CONFIG.API_BASE_URL_IMG + row.image}
										/>
									)}
								</TableCell>
								<TableCell align="center">
									<IconButton onClick={(e) => navigate(`${pageRoutes.master.user.userPermissions.split(':')[0]}${row.id}`)}>
										<Icon color="warning">fingerprint</Icon>
									</IconButton>
									<IconButton onClick={(e) => handleEdit(row)}>
										<Icon color="primary">edit</Icon>
									</IconButton>
									<IconButton onClick={(e) => handleDelete(row.id)}>
										<Icon color="error">close</Icon>
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</StyledTable>
				<TablePagination
					sx={{ px: 2 }}
					page={page}
					component="div"
					rowsPerPage={rowsPerPage}
					count={tableDataCount}
					onPageChange={handleChangePage}
					rowsPerPageOptions={[5, 8, 10]}
					onRowsPerPageChange={handleChangeRowsPerPage}
					nextIconButtonProps={{ "aria-label": "Next Page" }}
					backIconButtonProps={{ "aria-label": "Previous Page" }}
				/>
			</Box>
			<Tooltip title="Create" placement="top">
				<StyledAddButton color="secondary" aria-label="Add" className="button" onClick={togglePopup}>
					<Icon>add</Icon>
				</StyledAddButton>
			</Tooltip>
			<UserMasterDetails open={open} togglePopup={togglePopup} userData={selectedUserData} />
		</Container>
	);
};

export default UserMaster;
