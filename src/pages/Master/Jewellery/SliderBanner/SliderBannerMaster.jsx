import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Icon, IconButton, Typography } from "@mui/material";
import Swal from "sweetalert2";
import ReactDragListView from "react-drag-listview";
import _ from "lodash"
import PaginationTable, { usePaginationTable } from "../../../../components/UI/Pagination/PaginationTable";
import { apiConfig, appConfig } from "../../../../config";
import error400cover from "../../../../assets/no-data-found-page.png"
import { API, HELPER } from "../../../../services";
import { Container } from "../../../../components";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";

const SliderBannerMaster = ({ modal, setModal, togglePopup, callBack, sliderId }) => {
    const [rowMoved, setRowMoved] = useState(false);
    const [addressText, setAddressText] = useState("");
    const [textModal, setTextModal] = useState(false);
    // column define
    const COLUMNS = [
        { title: "Drag" },
        { title: "Image" },
        { title: "Banner Title", classNameWidth: "thead-second-width-title-answer" },
        { title: "Sub Title", classNameWidth: "common-thead-second-width-title" },
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
            customClass: {
                container: "custom-swal-container",
            },
            showCancelButton: true,
            confirmButtonColor: "green",
            cancelButtonColor: "red",
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
        // -----------Get Slider Api----------------------

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


    // row is dragged code
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

    // handleSaveButtonClick on click of a drag
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
    // show in subTitle display function
    const showAddressInDialog = (item) => {
        const sub_title = item.Banner.sub_title;
        setAddressText(sub_title); // Set the address text
        textModaltoggle(); // Show the dialog
    };

    const textModaltoggle = () => {
        setTextModal(!textModal);
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
                        <span>{item.title}</span>
                    </div>,
                    <div
                        className="common-thead-second-width-title"
                        style={{ fontWeight: "500", cursor: "pointer" }}
                        onClick={() => showAddressInDialog(item)}
                    >
                        <span>{item.Banner.sub_title}</span>
                    </div>,

                    <span>
                        <IconButton onClick={() => {
                            onClickDelete(item.slider_banner_id);
                        }}>
                            <Icon color="error">delete</Icon>
                        </IconButton>
                    </span>,

                ],
            };
        });
    }, [state.data]);

    return (
        <>
            <ThemeDialog
                title={"Slider Banner List"}
                isOpen={modal}
                maxWidth='lg'
                actionBtns={
                    <Box>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                togglePopup();
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
                            alignItems: "center",
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

                            </div>
                        </div>
                    </Box>

                    {/* pagination and draggble code */}
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
            {/* subTitle display in model code */}
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
        </>


    );
};

export default SliderBannerMaster;
