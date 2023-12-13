import React, { useEffect, useState } from "react";
import { Box, Icon, IconButton, Tooltip } from "@mui/material";
import {
  Breadcrumb,
  Container,
  SimpleCard,
  StyledAddButton,
} from "../../../../components";
import { pageRoutes } from "../../../../constants/routesList";
import { useParams } from "react-router-dom";
import { API, HELPER } from "../../../../services";
import AddUserPermissions from "./AddUserPermissions";
import SimpleTable from "../../../../components/UI/SimpleTable";
import ThemeSwitch from "../../../../components/UI/ThemeSwitch";
import { apiConfig } from "../../../../config";
import Swal from "sweetalert2";
import { toaster } from "../../../../services/helper";
import error400cover from "../../../../assets/no-data-found-page.png";

const UserPermissionsMaster = () => {
  const params = useParams();
  const [userPermissions, setUserPermissions] = useState({});
  const [open, setOpen] = useState(false);

  const userPermissionHeaderColumns = [
    {
      headerCell: "Permission",
      align: "left",
      width: "30%",
      cell: ({ item }) => {
        return (
          <span style={{ textTransform: "capitalize " }}> {item.permissionName}</span>
        );
      },
    },
    {
      headerCell: "View",
      align: "center",
      cell: ({ item }) => {
        return <ThemeSwitch disabled name="view" checked={item.view} />;
      },
    },
    {
      headerCell: "Create",
      align: "center",
      cell: ({ item }) => (
        <ThemeSwitch
          name="create"
          checked={item.create}
          color="success"
          onChange={(e) =>
            handleToggle(item.id, e.target.name, e.target.checked)
          }
        />
      ),
    },
    {
      headerCell: "Edit",
      cell: ({ item }) => (
        <ThemeSwitch
          name="edit"
          checked={item.edit}
          color="warning"
          onChange={(e) =>
            handleToggle(item.id, e.target.name, e.target.checked)
          }
        />
      ),
    },
    {
      headerCell: "Delete",
      cell: ({ item }) => (
        <ThemeSwitch
          name="delete"
          checked={item.delete}
          color="error"
          onChange={(e) =>
            handleToggle(item.id, e.target.name, e.target.checked)
          }
        />
      ),
    },
    {
      headerCell: "Action",
      width: "75px",
      cell: ({ item }) => (
        <IconButton onClick={(e) => onClickDelete(item.id)}>
          <Icon color="error">delete</Icon>
        </IconButton>
      ),
    },
  ];

  const getTableData = () => {
    API.get(`${apiConfig.userPermission}/${params.id}`).then((response) =>
      setUserPermissions(response)
    );
  };

  useEffect(() => {
    if (params.id) {
      getTableData();
    }
  }, [params]);

  // const handleDelete = (id) => {
  // 	HELPER.sweetAlert.delete().then(() => {
  // 		API.destroy(`${apiConfig.userPermission}/${id}`)
  // 			.then(() => {
  // 				HELPER.toaster.success("Record Deleted");
  // 				getTableData();
  // 			})
  // 			.catch((e) => HELPER.toaster.error("Error " + e));
  // 	});
  // };

  const onClickDelete = (id) => {
    Swal.fire({
      title: "Are You Sure",
      text: "Are you sure you want to remove this Record ?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "green",
      cancelButtonColor: "red",
      cancelButtonText: "No",
      confirmButtonText: "Yes",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        API.destroy(`${apiConfig.userPermission}/${id}`)
          .then((res) => {
            toaster.success("Deleted Successfully");
            getTableData();
          })
          .catch((e) => HELPER.toaster.error(e.errors.message))
      }
    });
  };

  const togglePopup = () => {
    setOpen(!open);
  };

  const handleToggle = (id, name, value) => {
    API.put(`${apiConfig.userPermission}/${id}/toggle`, { [name]: value })
      .then((response) => {
        HELPER.toaster.success(response.message);
        getTableData();
      })
      .catch((e) => HELPER.toaster.error("Error " + e));
  };

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb
          routeSegments={[
            { name: "Masters", path: pageRoutes.master.user.user },
            { name: "User", path: pageRoutes.master.user.user },
            { name: "User Permissions" },
          ]}
        />
      </Box>
      {Object.keys(userPermissions).length === 0 ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <img src={error400cover} width="400px" alt="Error Image" />
        </div>
      ) : (
        Object.keys(userPermissions).map((group, i) => (
          <SimpleCard key={`group_${i}`} title={group} sx={{ mb: 2 }}>
            <SimpleTable
              data={userPermissions[group]}
              headerColumns={userPermissionHeaderColumns}
            />
          </SimpleCard>
        ))
      )}
      {/* {Object.keys(userPermissions).map((group, i) => (
        <SimpleCard key={`group_${i}`} title={group} sx={{ mb: 2 }}>
          <SimpleTable
            data={userPermissions[group]}
            headerColumns={userPermissionHeaderColumns}
          />
        </SimpleCard>
      ))} */}
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
      <AddUserPermissions
        open={open}
        togglePopup={togglePopup}
        userId={params.id}
        refreshTable={() => {
          getTableData();
          togglePopup();
        }}
      />
    </Container>
  );
};

export default UserPermissionsMaster;
