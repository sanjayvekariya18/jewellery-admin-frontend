
import React, { useState, useEffect, useMemo, useCallback } from "react";
import Swal from "sweetalert2";
import { API, HELPER } from "../../../../services";
import { apiConfig, appConfig } from "../../../../config";
import PaginationTable, { usePaginationTable } from "../../../../components/UI/Pagination/PaginationTable";

import _ from "lodash";
import { Breadcrumb, Container } from "../../../../components";
import { Box, Button, Icon, IconButton } from "@mui/material";
import error400cover from "../../../../assets/no-data-found-page.png";
import SliderMasterDetail from "./SliderMasterDetail";
import BannerMaster from "./BannerMaster";


const SliderMaster = () => {
    const [selectedUserData, setSelectedUserData] = useState(null);
    const [open, setOpen] = useState(false);
    const [openBanner, setOpenBanner] = useState(false);
    const [initialState, setInitialState] = useState("");
    const [slider, setSlider] = useState("");
    const [viewBannerModal, setViewBannerModal] = useState(false);

    // const BannerToggle = useCallback(() => {
    //     setViewBannerModal(false)
    // }, [viewBannerModal])

    const BannerToggle = () => {
        if (openBanner) {
          setSelectedUserData(null);
        }
        setOpenBanner(!openBanner);
      };
    //-------------- Delete Silder------------
    const onClickDelete = (slider_id) => {
        Swal.fire({
            title: "Are You Sure",
            text: "Are you sure you want to remove this Slider?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "green",
            cancelButtonColor: "red",
            cancelButtonText: "No",
            confirmButtonText: "Yes",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                API.destroy(`${apiConfig.slider}/${slider_id}`)
                    .then((res) => {
                        HELPER.toaster.success("Deleted Successfully");
                        paginate();
                    })
                    .catch((e) => HELPER.toaster.error(e.errors.message))
            }
        });
    };
    // COLUMNS define
    const COLUMNS = [
        { title: "Name" },
        { title: "Slider Banners" },
        { title: "Action" },
    ];

    const { state, setState, changeState, ...otherTableActionProps } =
        usePaginationTable({
        });

    // paginate code
    const paginate = (clear = false, isNewFilter = false) => {
        changeState("loader", true);
        let clearStates = {
            ...appConfig.default_pagination_state,
        };
        let filter = {
            page: state.page,
            rowsPerPage: state.rowsPerPage,
        };
        let newFilterState = { ...appConfig.default_pagination_state };
        if (clear) {
            filter = _.merge(filter, clearStates);
        } else if (isNewFilter) {
            filter = _.merge(filter, newFilterState);
        }

        // -----------Get Slider Api----------------------
        API.get(apiConfig.slider, filter)
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
    }, [state.page, state.rowsPerPage]);

    // handleEdit data edit function
    const handleEdit = (data) => {
        setSelectedUserData(data);
        setOpen(true);
    };

    const rows = useMemo(() => {
        return state.data.map((item) => {
            return {
                item: item,
                columns: [
                    <span>{item.name}</span>,
                    <div>
                        <Button
                            variant="contained"
                            className="btn btn-success"
                            onClick={() => {
                                setInitialState(item.slider_id);
                                setSlider(item.SliderBanners)
                                setViewBannerModal(true)
                                BannerToggle();
                            }}
                        >
                            View Banner
                        </Button>
                    </div>,
                    <div>
                        <IconButton onClick={(e) => handleEdit(item)}>
                            <Icon color="primary">create</Icon>
                        </IconButton>
                        <IconButton onClick={(e) => onClickDelete(item.slider_id)}>
                            <Icon color="error">delete</Icon>
                        </IconButton>
                    </div>,
                ],
            };
        });
    }, [state.data]);


    const togglePopup = () => {
        if (open) {
            setSelectedUserData(null);
        }
        setOpen(!open);
    };
    document.title = "Slider Page List ";

    return (

        <>
            <div>
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
                                // { name: "Masters", path: pageRoutes.master.user.user },
                                { name: "Slider List" },
                            ]}
                        />
                        <div>
                            <div style={{ display: "flex" }}>
                                <Button
                                    variant="contained"
                                    style={{ marginLeft: "20px" }}
                                    onClick={togglePopup}
                                >
                                    Add
                                    Slider
                                </Button>

                            </div>
                        </div>

                    </Box>
                    {/* pagination code  */}
                    <PaginationTable
                        header={COLUMNS}
                        rows={rows}
                        totalItems={state.total_items || 0}
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
                    <SliderMasterDetail
                        open={open}
                        togglePopup={() => {
                            togglePopup();
                            // paginate();
                        }}
                        userData={selectedUserData}
                        callBack={() => paginate(true)}
                    />
                    {/* BannerMaster details in model dispaly */}
                    {openBanner &&
                        (<BannerMaster
                            model={openBanner}
                            setModal={setViewBannerModal}
                            sliderBanner={slider}
                            togglePopupBanner={() => {
                                BannerToggle();
                                // paginate();
                              }}
                            sliderId={initialState}
                            callBack={() => paginate(true)} />
                        )}
                </Container>
            </div>
        </>
    );
};

export default SliderMaster;

