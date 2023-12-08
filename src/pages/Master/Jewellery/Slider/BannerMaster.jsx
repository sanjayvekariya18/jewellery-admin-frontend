import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Icon, IconButton, Tooltip, Checkbox, Typography } from "@mui/material";
import _ from "lodash";
import Swal from "sweetalert2";
import { API, HELPER } from "../../../../services";
import { apiConfig, appConfig } from "../../../../config";
import PaginationTable, { usePaginationTable } from "../../../../components/UI/Pagination/PaginationTable";
import error400cover from "../../../../assets/no-data-found-page.png";
import ReactDragListView from "react-drag-listview";
import { Breadcrumb, Container } from "../../../../components";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import BannerMaster2 from "../Banner/BannerMaster";

const BannerMaster = ({ modal, setModal, toggle, callBack, sliderId, sliderBanner }) => {
    const [rowMoved, setRowMoved] = useState(false);
    const [addressText, setAddressText] = useState("");
    const [textModal, setTextModal] = useState(false);
    const [selectedUserData, setSelectedUserData] = useState(null);
    const [open, setOpen] = useState(false);
    // column data display
    const COLUMNS = [
        { title: "Drag" },
        { title: "Image" },
        { title: "Banner Title", classNameWidth: "thead-second-width-title-answer" },
        { title: "Sub Title", classNameWidth: "thead-second-width-title-answer" },
        {
            title: "Action",
            classNameWidth: "thead-second-width-discount",
        },
    ];


    //-------------- Delete Silder Banner------------
    const onClickDelete = (banner_id) => {
        Swal.fire({
            title: "Are You Sure",
            text: "Are you sure you want to remove this Slider Banner?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "green",
            cancelButtonColor: "red",
            customClass: {
                container: "custom-swal-container",
            },
            cancelButtonText: "No",
            confirmButtonText: "Yes",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                API.destroy(`${apiConfig.SlideBanner}/${banner_id}`)
                    .then((res) => {
                        HELPER.toaster.success("Deleted Successfully");
                        paginate();
                    })
                    .catch(console.error);
            }
        });
    };

    const { state, setState, changeState, ...otherTableActionProps } =
        usePaginationTable({
            order: "",
            orderBy: "",
        });

    // paginate code
    const paginate = (clear = false, isNewFilter = false) => {
        changeState("loader", true);
        let clearStates = {
            ...appConfig.default_pagination_state,
        };
        let filter = {
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
        // -----------Get SlideBanner Api----------------------

        API.get(`${apiConfig.SlideBanner}?sliderId=${sliderId}`, filter)
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
            });
    };

    useEffect(() => {
        paginate();
    }, [state.page, state.rowsPerPage, state.order, state.orderby]);


    // handleDragEnd rows to move
    const handleDragEnd = (fromIndex, toIndex) => {
        if (fromIndex !== toIndex) {
            const newData = [...state.data];
            const [draggedItem] = newData.splice(fromIndex, 1);
            newData.splice(toIndex, 0, draggedItem);

            setState({ ...state, data: newData });

            HELPER.toaster.success("Row Moved Successfully");
            setRowMoved(true);
        }
    };

    // handleSaveButtonClick that draggeble row in save
    const handleSaveButtonClick = () => {
        if (rowMoved) {
            const updatedDataOrder = state.data.map((item, index) => ({
                banner_id: item.banner_id,
                position: index + 1,
            }));

            const payload = {
                slider_id: sliderId,
                slider_banner: updatedDataOrder,
            };

            API.post(apiConfig.sliderBanner, payload)
                .then((res) => {
                    HELPER.toaster.success("Slider Banner updated successfully");
                    setRowMoved(false);
                })
                .catch((error) => {
                    HELPER.toaster.error("Error:", error);
                });
        }
    };

    const rows = useMemo(() => {
        return state.data.map((item) => {
            return {
                item: item,
                columns: [
                    <span>
                        <IconButton>
                            <Icon>drag_indicator</Icon>
                        </IconButton>
                    </span>,
                    <span className="common-thead-second-width-title">
                        {item.Banner.image_url && (
                            <img
                                src={HELPER.getImageUrl(item.Banner.image_url)}
                                alt=""
                                height={50}
                                width={50}
                            />
                        )}
                    </span>,
                    <div className="common-thead-second-width-title">
                        <span>{item.Banner.title}</span>
                    </div>,
                    <div
                        className="common-width-three-dot-text"
                        style={{ fontWeight: "500", cursor: "pointer" }}
                        onClick={() => showAddressInDialog(item)}
                    >
                        <span>{item.Banner.sub_title}</span>
                    </div>,
                    <div>
                        <IconButton onClick={(e) => onClickDelete(item.slider_banner_id)}>
                            <Icon color="error">delete</Icon>
                        </IconButton>
                    </div>,
                ],
            };
        });
    }, [state.data]);
    const showAddressInDialog = (item) => {
        const sub_title = item.Banner.sub_title;
        setAddressText(sub_title); // Set the address text
        textModaltoggle(); // Show the dialog
    };
    const textModaltoggle = () => {
        setTextModal(!textModal);
    };
    const togglePopup = () => {
        if (open) {
            setSelectedUserData(null);
        }
        setOpen(!open);
    };
    return (
        <>
            <>
                <ThemeDialog
                    title={"Slider Banner List"}
                    isOpen={modal}
                    toggle={toggle}
                    maxWidth='lg'
                    actionBtns={
                        <Box>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => {
                                    toggle();
                                }}
                            >
                                Cancel
                            </Button>
                        </Box>
                    }
                >
                    <Container>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                paddingBottom: "10px"
                            }}
                        >
                            <div>
                                <div style={{ display: "flex" }}>

                                    <Button
                                        style={{ marginLeft: "20px" }}
                                        variant="contained"
                                        onClick={handleSaveButtonClick}
                                        disabled={!rowMoved}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        style={{ marginLeft: "20px" }}
                                        variant="contained"
                                        onClick={togglePopup}
                                    >
                                        Add Slider Banner
                                    </Button>
                                </div>
                            </div>
                        </Box>

                        {/* PaginationTable and handel draggble */}
                        <div className="card-body pt-0">
                            <ReactDragListView onDragEnd={handleDragEnd}>
                                <div>
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
                                        emptyTableImg={<img src={error400cover} width="350px" />}
                                        {...otherTableActionProps}
                                    ></PaginationTable>
                                </div>
                            </ReactDragListView>
                        </div>                                                                          
                    </Container>
                </ThemeDialog >
            </>
            {textModal && (
                <ThemeDialog
                    title="Sub Title"
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
            <BannerMaster2
                open={open}
                togglePopup2={() => {
                    togglePopup();
                    paginate();
                }}
                userData={sliderId}
                sliderBanner={sliderBanner}

            />
        </>
    );

};

export default BannerMaster;