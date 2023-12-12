import React, { useState, useMemo, useEffect } from "react";
import {
    Box,
    Icon,
    IconButton,
    Button,
    Typography,
    Checkbox
} from "@mui/material";
import { API, HELPER } from "../../../../services";
import PaginationTable, { usePaginationTable } from "../../../../components/UI/Pagination/PaginationTable";
import { apiConfig, appConfig } from "../../../../config";
import Swal from "sweetalert2";
import _ from "lodash";
import error400cover from "../../../../assets/no-data-found-page.png";
import { Breadcrumb, Container } from "../../../../components";
import { pageRoutes } from "../../../../constants/routesList";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';

const ContactUsMaster = () => {
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
    const [descriptionModal, setDescriptionModal] = useState("");
    const [textModal, setTextModal] = useState(false);
    const [is_read, setIsRead] = useState(false);
    const textModaltoggle = () => {
        setTextModal(!textModal);
    };

    // all select in checkBox
    const handleSelectAll = () => {
        const selectAllChecked = selectedCheckboxes.length === state.data.length;
        const updatedCheckboxes = selectAllChecked
            ? [] // Deselect all checkboxes
            : state.data.map((item) => ({ contact_id: item.contact_id })); // Select all checkboxes
        setSelectedCheckboxes(updatedCheckboxes);
    };

    const { state, setState, changeState, ...otherTableActionProps } =
        usePaginationTable({
            is_read: "false",
            order: "",
            orderBy: "",
        });

    // column define
    const COLUMNS = [
        { title: "Name" },
        { title: "Email" },
        { title: "Mobile Number" },
        { title: "Message" },
        { title: "Is Read", classNameWidth: "thead-second-width-action-index-95" },
    ];

    // paginate code
    const paginate = (clear = false, isNewFilter = false) => {
        changeState("loader", true);
        let clearStates = {
            is_read: "false",
            ...appConfig.default_pagination_state,
        };

        let filter = {
            is_read: is_read,
            page: clear ? clearStates.page : state.page,
            rowsPerPage: clear ? clearStates.rowsPerPage : state.rowsPerPage,
            order: state.order,
            orderBy: state.orderby,
        };

        let newFilterState = { ...appConfig.default_pagination_state };

        if (clear) {
            filter = _.merge(filter, clearStates);
        } else if (isNewFilter) {
            filter = _.merge(filter, newFilterState);
        }

        // --------- Get Contact Us Api ---------------
        API.get(apiConfig.contactUs, filter)
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
                    err.status == 400 ||
                    err.status == 401 ||
                    err.status == 409 ||
                    err.status == 403
                ) {
                    HELPER.toaster.error(err.errors.message);
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
    }, [is_read, state.page, state.rowsPerPage, state.order, state.orderby]);

    // onClickUpdateBulk on a contact us
    const onClickUpdateBulk = () => {
        Swal.fire({
            text: `Are you sure you Read this ${selectedCheckboxes.length} Contact Message ?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "green",
            cancelButtonColor: "red",
            cancelButtonText: "No",
            confirmButtonText: "Yes",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                API.put(apiConfig.contactUsBulk, {
                    contact_data: selectedCheckboxes,
                })
                    .then((res) => {
                        HELPER.toaster.success("Update Successfully");
                        setSelectedCheckboxes([]);
                        paginate();
                    })
                    .catch((error) => {
                        console.error("Delete bulk error:", error);
                    });
            }
        });
    };

    // showDecsription display description

    const showDecsription = (item) => {
        const description = item.message;
        setTextModal(true);
        setDescriptionModal(description);
    };

    // handleCheckbox function
    const handleCheckbox = (item) => {
        const isChecked = selectedCheckboxes.some(
            (selectedItem) => selectedItem.contact_id === item.contact_id
        );
        let updatedCheckboxes;
        if (isChecked) {
            updatedCheckboxes = selectedCheckboxes.filter(
                (selectedItem) => selectedItem.contact_id !== item.contact_id
            );
        } else {
            updatedCheckboxes = [
                ...selectedCheckboxes,
                { contact_id: item.contact_id },
            ];
        }
        setSelectedCheckboxes(updatedCheckboxes);
    };

    // CustomCheckbox all select box in a that function
    const CustomCheckbox = ({ id, checked, onChange }) => {
        return (
            <div>
                <Checkbox checked={checked} onChange={onChange} id={id} />
            </div>
        );
    };

    // selectAllCheckbox all select box
    const selectAllCheckbox = (
        <div className="checkBox">
            {is_read == false ? (
                <Checkbox
                    checked={selectedCheckboxes.length === state.data.length}
                    onChange={handleSelectAll}
                />
            ) : (
                ""
            )}
        </div>
    );
    const handleCheckboxClick = () => {
        setIsRead((isChecked) => !isChecked);
    };
    const rows = useMemo(() => {
        return state.data.map((item) => {
            return {
                item: item,
                columns: [
                    <div className="checkBox">
                        {is_read == false && (
                            <CustomCheckbox
                                id={`checkbox_${item.contact_id}`}
                                checked={selectedCheckboxes.some(
                                    (selectedItem) => selectedItem.contact_id === item.contact_id
                                )}
                                onChange={() => handleCheckbox(item)}
                            />
                        )}
                    </div>,

                    <span>{item.first_name + " " + item.last_name}</span>,
                    <div className="span-permision">
                        <span>{item.email}</span>
                    </div>,
                    <span>{item.mobile_number}</span>,
                    <span
                        className="common-width-three-dot-text"
                        style={{ fontWeight: 500, cursor: "pointer" }}
                        onClick={() => showDecsription(item)}
                    >
                        {item.message}
                    </span>,
                    <IconButton>
                        <Icon color={item.is_read ? "primary" : "error"}>
                            {item.is_read ? <MarkEmailReadOutlinedIcon style={{ fontSize: "24px", color: "green", fontWeight: "bold" }} /> : <MarkEmailUnreadOutlinedIcon style={{ fontSize: "24px", fontWeight: "bold" }} />}
                        </Icon>
                    </IconButton>

                    // <Typography>
                    //     {item.is_read == true ? (
                    //         <span className="badgeSuccess">
                    //             True
                    //         </span>
                    //     ) : (
                    //         <span className="badgeFail">
                    //             False
                    //         </span>
                    //     )}
                    // </Typography>,
                ],
            };
        });
    }, [state.data, selectedCheckboxes]);
    return (
        <>
            <Container>
                <Box
                    className="breadcrumb"
                    sx={{ display: "flex", justifyContent: "space-between" }}
                >
                    <Breadcrumb
                        routeSegments={[
                            { name: "Masters", path: pageRoutes.master.blogs.contactUs },
                            { name: "Contact Us" },
                        ]}
                    />
                </Box>
                <div
                    style={{
                        marginBottom: "10px",
                        display: "flex",
                        justifyContent: "end"
                    }}
                >
                    <div style={{ marginRight: "25px", display: "flex", alignItems: "center" }}>
                        <Checkbox
                            type="checkbox"
                            checked={is_read}
                            onChange={handleCheckboxClick}
                            style={{ fontSize: "15px" }}
                            id="isVisible187"
                        />
                        <Typography
                            htmlFor="isVisible187"
                            style={{
                                fontSize: "15px",
                                fontWeight: 500,
                            }}
                        >
                            Is Read
                        </Typography>
                    </div>
                    <div style={{ marginBottom: "8px" }}>
                        <Button
                            variant="contained"
                            onClick={onClickUpdateBulk}
                            disabled={selectedCheckboxes.length === 0}
                        >
                            <i className="ri-eye-line align-bottom"></i> Read
                        </Button>
                    </div>
                </div>
                {/* pagination code */}
                <div className="contact_checkBox">
                    <PaginationTable
                        header={COLUMNS}
                        rows={rows}
                        totalItems={state.total_items}
                        perPage={state.rowsPerPage}
                        activePage={state.page}
                        checkboxColumn={false}
                        selectedRows={state.selectedRows}
                        enableOrder={true}
                        orderBy={state.orderby}
                        order={state.order}
                        isLoader={state.loader}
                        selectAllCheckbox={selectAllCheckbox}
                        emptyTableImg={<img src={error400cover} width="350px" />}
                        {...otherTableActionProps}
                    >
                    </PaginationTable>
                </div>
            </Container>
            {/* Message display that model */}
            {textModal && (
                <ThemeDialog
                    title="Message"
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
                            {descriptionModal}
                        </Typography>
                    </div>
                </ThemeDialog>
            )}
        </>
    );
};

export default ContactUsMaster;


