import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Icon,
    IconButton,
    Button,
    Tooltip,
    Typography,
} from "@mui/material";
import { API, HELPER } from "../../../../services";
import PaginationTable, { usePaginationTable } from "../../../../components/UI/Pagination/PaginationTable";
import { apiConfig } from "../../../../config";
import Swal from "sweetalert2";
import _ from "lodash";
import error400cover from "../../../../assets/no-data-found-page.png";
import { Breadcrumb, Container, StyledAddButton } from "../../../../components";
import { pageRoutes } from "../../../../constants/routesList";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";


const ContactUsMaster = () => {
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
        { title: "Name", classNameWidth: "thead-second-width-title-blog" },
        { title: "Email", classNameWidth: "thead-second-width-title" },
        { title: "Mobile Number", classNameWidth: "thead-second-width" },
        { title: "Message", classNameWidth: "thead-second-width" },
        { title: "Is Read", classNameWidth: "thead-second-width-action-index" },
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


        // ----------Get Product Details Group Api------------
        setLoading(true);
        API.get(apiConfig.blog)
            .then((res) => {
                setLoading(false);
                setState({
                    ...state,
                    total_items: res.count,
                    data: res.rows,
                });
            })
            .catch(() => {
                setLoading(false);
                setState({
                    ...state,

                    loader: false,
                });
            });
        // .finally(() => {
        //   if (openSearch == true) {
        //     setOpenSearch(false);
        //   }
        // });
    };

    //------------ Delete Lab --------------

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
                        HELPER.toaster.success("Deleted Successfully");
                        paginate();
                    })
                    .catch(console.error);
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
            .catch((err) => {
                console.error(err);
            });
    }, []);

    const rows = useMemo(() => {
        return state.data.map((item) => {
            return {
                item: item,
                columns: [
                    <div className="common-thead-second-width-title-blog">
                        {/* <span>{item.title}</span> */}
                    </div>,
                    <span>
                        {/* {item.category_name} */}
                    </span>,
                    <span>
                        {/* {item.featured_image && item.featured_image !== null && (
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
                        )} */}
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
                        { name: "Masters", path: pageRoutes.master.blogs.contactUs },
                        { name: "Contact Us" },
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

            {/* <BlogMasterDetails
                open={open}
                togglePopup={() => {
                    togglePopup();
                    // paginate();
                }}
                userData={selectedUserData}
                blogCategoryData={blogCategoryData}
                callBack={() => paginate(true)}

            /> */}

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

export default ContactUsMaster;

