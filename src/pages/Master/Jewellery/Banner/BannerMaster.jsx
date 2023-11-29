import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Box, Button, Icon, IconButton, Tooltip, Checkbox } from "@mui/material";
import { API, HELPER } from "../../../../services";
import { Breadcrumb, StyledAddButton, Container } from "../../../../components";
import error400cover from "../../../../assets/no-data-found-page.png";
import Swal from "sweetalert2";
import PaginationTable, { usePaginationTable } from "../../../../components/UI/Pagination/PaginationTable";
import { apiConfig, appConfig } from "../../../../config";
import BannerMasterDetail from "./BannerMasterDetail";
import SliderBannerMasterDetail from "../SliderBanner/SliderBannerMasterDetail";

const BannerMaster = () => {
    const [selectedUserData, setSelectedUserData] = useState(null);
    const [open, setOpen] = useState(false);
    const [SliderBannerModal, setSliderBannerModal] = useState("");
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
    const [loading, setLoading] = useState();


    // ----Pagination code------
    const COLUMNS = [
        { title: "Select", classNameWidth: "thead-second-width-discount" },
        { title: "Banner Title", classNameWidth: "thead-second-width-title" },
        { title: "Sub Title", classNameWidth: "thead-second-width-discount" },
        { title: "Image", classNameWidth: "thead-second-width-discount-85" },
        { title: "thumbnail_image", classNameWidth: "thead-second-width-discount-85" },
        { title: "Button Text", classNameWidth: "thead-second-width-discount-85" },
        { title: "Is Clickable", classNameWidth: "thead-second-width-discount-85" },
        { title: "Show Button", classNameWidth: "thead-second-width-discount-85" },
        { title: "Is Collection", classNameWidth: "thead-second-width-discount-85" },
        {
            title: "Action",
            classNameWidth: "thead-second-width-discount",
        },
    ];
    const {
        state,
        setState,
        getInitialStates,
        changeState,
        ...otherTableActionProps
    } = usePaginationTable({
        // shape: "",
        // color: "",
        // sortBy: "newest",
        // intensity: "",
        // origin: "",
        // fromPrice: price.minPrice,
        // toPrice: price.maxPrice,
        // fromCts: carat.minCarat,
        // toCts: carat.maxCarat,
    });
    const paginate = (clear = false, isNewFilter = false) => {
        let filter = {
            page: state.page,
            rowsPerPage: state.rowsPerPage,
        };

        changeState("loader", true);
        API.get(apiConfig.banner, filter)
            .then((res) => {
                setLoading(false);
                setState({
                    ...state,
                    total_items: res.count,
                    data: res.rows,
                });
            })
            .catch((err) => {
                setLoading(false);
                if (
                    err.status === 400 ||
                    err.status === 401 ||
                    err.status === 409 ||
                    err.status === 403
                ) {
                    HELPER.toaster.error(err.errors.message);
                } else {
                    console.error(err);
                }
                setState({
                    ...state,
                    loader: false,
                });
            });
        // .finally(() => {
        //   if (openSearch === true) {
        //     setOpenSearch(false);
        //   }
        // });
    };

    //------------ Delete Colored Diamond --------------

    const onClickDelete = (banner_id) => {
        Swal.fire({
            title: "Are You Sure",
            text: "Are you sure to remove this Banner ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "green",
            cancelButtonColor: "red",
            cancelButtonText: "No",
            confirmButtonText: "Yes",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                API.destroy(`${apiConfig.banner}/${banner_id}`)
                    .then((res) => {
                        HELPER.toaster.success("Deleted Successfully");
                        paginate();
                    })
                    .catch(console.error);
            }
        });
    };

    const handleCheckbox = (item) => {
        setSelectedCheckboxes((prevSelectedCheckboxes) => {
            if (prevSelectedCheckboxes.some((selectedItem) => selectedItem.banner_id === item.banner_id)) {
                return prevSelectedCheckboxes.filter((selectedItem) => selectedItem.banner_id !== item.banner_id);
            } else {
                return [...prevSelectedCheckboxes, item];
            }
        });
    };

    const SliderBannerToggle = useCallback(() => {
        setSliderBannerModal(false);
    }, [SliderBannerModal])

    useEffect(() => {
        paginate();
    }, [state.page, state.rowsPerPage, selectedCheckboxes]);

    const rows = useMemo(() => {
        return state.data.map((item) => {
            return {
                item: item,
                columns: [
                    <span>
                        <Checkbox
                            checked={selectedCheckboxes.some((selectedItem) => selectedItem.banner_id === item.banner_id)}
                            onChange={() => handleCheckbox(item)}
                            color="primary"
                        />
                    </span>,
                    <div className="common-thead-second-width-title">
                        <span>{item.title}</span>
                    </div>,
                    <div className="common-thead-second-width-title">
                        <span>{item.sub_title}</span>
                    </div>,
                    <span className="common-thead-second-width-title">
                        {item.image_url && (

                            <img
                                src={HELPER.getImageUrl(item.image_url)}
                                alt=""
                                height={50}
                                width={50}
                            />
                        )}
                    </span>,
                    <span className="common-thead-second-width-title">
                        {item.thumbnail_image && (

                            <img
                                src={HELPER.getImageUrl(item.thumbnail_image)}
                                alt=""
                                height={50}
                                width={50}
                            />
                        )}
                    </span>,
                    <span>{item.button_txt}</span>,
                    <span>
                        {item.is_clickable == true ? (
                            <span className="badgeSuccess ">
                                True
                            </span>
                        ) : (
                            <span className="badgeFail">
                                False
                            </span>
                        )}
                    </span>,
                    <span>
                        {item.show_button == true ? (
                            <span className="badgeSuccess ">
                                True
                            </span>
                        ) : (
                            <span className="badgeFail">
                                False
                            </span>
                        )}
                    </span>,
                    <span>
                        {item.is_collection == true ? (
                            <span className="badgeSuccess ">
                                True
                            </span>
                        ) : (
                            <span className="badgeFail">
                                False
                            </span>
                        )}
                    </span>,
                    <div>
                        <IconButton onClick={(e) => handleEdit(item)}>
                            <Icon color="primary">create</Icon>
                        </IconButton>
                        <IconButton onClick={(e) => onClickDelete(item.banner_id)}>
                            <Icon color="error">delete</Icon>
                        </IconButton>
                    </div>,
                ],
            };
        });
    }, [state.data]);

    const handleEdit = (data) => {
        setSelectedUserData(data);
        setOpen(true);
    };


    const togglePopup = () => {
        if (open) {
            setSelectedUserData(null);
        }
        setOpen(!open);
    };


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
                                { name: "Banner List" },
                            ]}
                        />
                        <div>
                            <div style={{ display: "flex" }}>
                                <Button
                                    variant="contained"
                                    onClick={togglePopup}
                                    style={{ marginLeft: "20px" }}
                                >
                                    Add Banner
                                </Button>

                                <Button
                                    style={{ marginLeft: "20px" }}
                                    variant="contained"
                                    onClick={() => {
                                        setSliderBannerModal(true);
                                    }}
                                    disabled={selectedCheckboxes.length === 0}
                                >
                                    <i className="ri-add-line align-bottom me-1"></i> Add Slider Banner
                                </Button>
                            </div>
                        </div>
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
                        isLoader={state.loader}
                        emptyTableImg={<img src={error400cover} width="350px" />}
                        {...otherTableActionProps}
                        orderBy={state.orderby}
                        order={state.order}
                    ></PaginationTable>
                    <BannerMasterDetail
                        open={open}
                        togglePopup={() => {
                            togglePopup();
                            paginate();
                        }}
                        userData={selectedUserData}
                        callBack={() => paginate(true)}

                    />

                    {
                        SliderBannerModal && (
                            <SliderBannerMasterDetail
                                modal={SliderBannerModal}
                                togglePopup={SliderBannerToggle}
                                setModal={setSliderBannerModal}
                                selectedCheckboxes={selectedCheckboxes}
                                updateSelectedCheckboxes={setSelectedCheckboxes}
                                callBack={() => paginate(true)}

                            />
                        )
                    }

                </Container>
            </div>
        </>
    );
};

export default BannerMaster;




