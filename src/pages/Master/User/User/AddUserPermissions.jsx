import React, { useEffect, useState } from "react";
import { API, HELPER } from "../../../../services";
import {
  Box,
  Button,
  Checkbox,
  Icon,
  IconButton,
  Tooltip,
} from "@mui/material";
import { SimpleCard } from "../../../../components";
import { apiConfig } from "../../../../config";
import ThemeSwitch from "../../../../components/UI/ThemeSwitch";
import SimpleTable from "../../../../components/UI/SimpleTable";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import error400cover from "../../../../assets/no-data-found-page.png";
import CommonButton from "../../../../components/UI/CommonButton";

const AddUserPermissions = ({ open, togglePopup, userId, refreshTable }) => {
  const [userPermissions, setUserPermissions] = useState({});
  const [isLoader, setIsLoader] = useState(false);

  const getTableData = () => {
    API.get(`${apiConfig.userPermission}/${userId}/not`).then((response) => {
      const _userPermissions = {};
      for (const group of Object.keys(response)) {
        _userPermissions[group] = response[group].map((permissions) => {
          return {
            permissionMasterId: permissions.id,
            permissionName: permissions.permissionName,
            view: true,
            create: false,
            edit: false,
            delete: false,
          };
        });
      }
      setUserPermissions(_userPermissions);
    });
  };

  useEffect(() => {
    if (userId && open === true) {
      getTableData();
    }
    if (open === false) {
      setUserPermissions({});
    }
  }, [open]);

  const toggleGroupPermissions = (group, value) => {
    const _userPermissions = { ...userPermissions };
    let isAnyUnselected = _userPermissions[group].some((_permission) => {
      return !_permission.create || !_permission.edit || !_permission.delete;
    });

    let hasUserPermission = isAnyUnselected == true;

    for (const permissions of _userPermissions[group]) {
      permissions.view = true;
      permissions.create = hasUserPermission;
      permissions.edit = hasUserPermission;
      permissions.delete = hasUserPermission;
    }
    setUserPermissions(_userPermissions);
  };

  const toggleAllPermissions = (group, permissionMasterId, value) => {
    const _userPermissions = { ...userPermissions };
    const permissionIndex = _userPermissions[group].findIndex(
      (row) => row.permissionMasterId === permissionMasterId
    );
    if (permissionIndex >= 0) {
      _userPermissions[group][permissionIndex].view = true;
      _userPermissions[group][permissionIndex].create = value;
      _userPermissions[group][permissionIndex].edit = value;
      _userPermissions[group][permissionIndex].delete = value;
      setUserPermissions(_userPermissions);
    }
  };

  const togglePermission = (group, permissionMasterId, operation, value) => {
    const _userPermissions = { ...userPermissions };
    const permissionIndex = _userPermissions[group].findIndex(
      (row) => row.permissionMasterId === permissionMasterId
    );
    if (permissionIndex >= 0) {
      _userPermissions[group][permissionIndex][operation] = value;
      setUserPermissions(_userPermissions);
    }
  };

  const addUserPermissions = () => {
    let __userPermissions = Object.values({ ...userPermissions }).flat(1);
    setIsLoader(true);

    let payload = {
      userId: userId,
      permissionDetails: __userPermissions.filter((item) => {
        return item.create || item.delete || item.edit;
      }),
    };

    API.post(apiConfig.userPermission, payload)
      .then(() => {
        HELPER.toaster.success("Permission added!");
        refreshTable();
      })
      .catch((err) => {
        if ([400, 401, 409, 422, 403, 500].includes(err.status)) {
          if (err.errors.permissionDetails) {
            if (err.errors.permissionDetails[0]) {
              HELPER.toaster.error(err.errors.permissionDetails[0]);
            } else if (err.errors.permissionDetails[1]) {
              HELPER.toaster.error(err.errors.permissionDetails[1]);
            } else {
              HELPER.toaster.error(err.errors.message);
            }
          } else {
            HELPER.toaster.error(err.errors.message);
          }
        } else {
          console.error(err);
        }
      })
      .finally(() => {
        setIsLoader(false);
      });
  };

  const userPermissionHeaderColumns = [
    {
      headerCell: ({ group }) => (
        <Tooltip
          title="Add/Remove All"
          style={{
            paddingRight: "0px",
            paddingTop: "0px",
            paddingBottom: "0px",
          }}
        >
          <IconButton
            onClick={(e) => toggleGroupPermissions(group, e.target.checked)}
          >
            <Icon color="error">add</Icon>
          </IconButton>
        </Tooltip>
      ),
      align: "left",
      width: "30%",
      cell: ({ item, group }) => (
        <Checkbox
          color="secondary"
          checked={
            item.create === true && item.edit === true && item.delete === true
          }
          onChange={(e) =>
            toggleAllPermissions(
              group,
              item.permissionMasterId,
              e.target.checked
            )
          }
        />
      ),
    },
    {
      headerCell: "Permission",
      align: "left",
      width: "30%",
      cell: ({ item }) => {
        return item.permissionName;
      },
    },
    {
      headerCell: "View",
      align: "left",
      width: "30%",
      cell: ({ item }) => (
        <ThemeSwitch disabled name="view" checked={item.view} />
      ),
    },
    {
      headerCell: "Create",
      align: "left",
      width: "30%",
      cell: ({ item, group }) => (
        <ThemeSwitch
          name="create"
          checked={item.create}
          color="success"
          onChange={(e) =>
            togglePermission(
              group,
              item.permissionMasterId,
              e.target.name,
              e.target.checked
            )
          }
        />
      ),
    },
    {
      headerCell: "Edit",
      align: "left",
      width: "30%",
      cell: ({ item, group }) => (
        <ThemeSwitch
          name="edit"
          checked={item.edit}
          color="warning"
          onChange={(e) =>
            togglePermission(
              group,
              item.permissionMasterId,
              e.target.name,
              e.target.checked
            )
          }
        />
      ),
    },
    {
      headerCell: "Delete",
      align: "left",
      width: "30%",
      cell: ({ item, group }) => (
        <ThemeSwitch
          name="delete"
          checked={item.delete}
          color="error"
          onChange={(e) =>
            togglePermission(
              group,
              item.permissionMasterId,
              e.target.name,
              e.target.checked
            )
          }
        />
      ),
    },
  ];

  return (
    <>
      <ThemeDialog
        title={`Add Permissions`}
        isOpen={open}
        onClose={togglePopup}
        maxWidth="lg"
        actionBtns={
          <>
            <Box>
              <Button
                variant="outlined"
                color="secondary"
                onClick={togglePopup}
                style={{ marginRight: "20px" }}
              >
                Cancel
              </Button>
              {/* <Button
                type="submit"
                variant="contained"
                color="success"
                onClick={() => addUserPermissions()}
              >
                Save
              </Button> */}
              <CommonButton
                loader={isLoader}
                type="submit"
                variant="contained"
                color="success"
                onClick={() => addUserPermissions()}
              >
                Save
              </CommonButton>
            </Box>
          </>
        }
      >
        {Object.keys(userPermissions).length === 0 ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <img src={error400cover} width="300px" />
          </div>
        ) : (
          Object.keys(userPermissions).map((group, i) => (
            <SimpleCard key={i} title={group} sx={{ mb: 2 }}>
              <SimpleTable
                data={userPermissions[group]}
                headerColumns={userPermissionHeaderColumns}
                extraData={{ group }}
              />
            </SimpleCard>
          ))
        )}
      </ThemeDialog>
    </>
  );
};

export default AddUserPermissions;
