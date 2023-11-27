import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Icon, IconButton, Tooltip, Checkbox } from "@mui/material";
import _ from "lodash";
import Swal from "sweetalert2";
import { API, HELPER } from "../../../../services";
import { apiConfig, appConfig } from "../../../../config";
import PaginationTable, { usePaginationTable } from "../../../../components/UI/Pagination/PaginationTable";
import error400cover from "../../../../assets/no-data-found-page.png";
import ReactDragListView from "react-drag-listview";
import { Breadcrumb, Container } from "../../../../components";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";


const BannerMaster = ({ modal, setModal, toggle, callBack, sliderId }) => {
    const [rowMoved, setRowMoved] = useState(false);

    const COLUMNS = [
        { title: "Drag" },
        { title: "Image", field: "thumbnail", order: true },
        { title: "Banner Title", field: "title", order: true },
        { title: "Sub Title", field: "sub_title", order: true },
        { title: "Action" },
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
                        {item.Banner.thumbnail_image && (

                            <img
                                src={HELPER.getImageUrl(item.Banner.thumbnail_image)}
                                alt=""
                                height={50}
                                width={50}
                            />
                        )}
                    </span>,
                    <span>{item.Banner.title}</span>,
                    <span>{item.Banner.sub_title}</span>,

                    <div>
                        <IconButton onClick={(e) => onClickDelete(item.slider_banner_id)}>
                            <Icon color="error">delete</Icon>
                        </IconButton>
                    </div>,
                ],
            };
        });
    }, [state.data]);

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
                                paddingBottom:"10px"
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
        </>
    );

};

export default BannerMaster;