import React, { useCallback, useEffect, useMemo, useState } from "react";
import PaginationTable, {
    usePaginationTable,
} from "../../../../components/UI/Pagination/PaginationTable";
import Swal from "sweetalert2";
import _ from 'lodash'
import error400cover from "../../../../assets/no-data-found-page.png";
import { API, HELPER } from "../../../../services";
import { apiConfig } from "../../../../config";
import { Box, Button, Icon, IconButton, } from "@mui/material";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import DisplayBanner from "./DisplayBanner";
import DisplaySlider from "./DisplaySlider";

const LinkUpModal = ({ open, togglePopup, menuId }) => {
    const [selectedLinkId, setSelectedLinkId] = useState("");
    const [bannerModal, setBannerModal] = useState(false);
    const [selectedUserData, setSelectedUserData] = useState(null);
    const [openBanner, setOpenBanner] = useState(false);
    const [openSlider, setOpenSlider] = useState(false);
    const [sliderModal, setSliderModal] = useState(false);

    // Banner Toggle model in a function
    // const bannerToggle = useCallback(() => {
    //     setBannerModal(false);
    // }, [bannerModal]);

    const togglePopupBanner = () => {
        if (openBanner) {
            setSelectedUserData(null);
        }
        setOpenBanner(!openBanner);
    };

    const togglePopupSlider = () => {
        if (openSlider) {
            setSelectedUserData(null);
        }
        setOpenSlider(!openSlider);
    };
    // Slider Toggle model in a function
    const sliderToggle = useCallback(() => {
        setSliderModal(false);
    }, [sliderModal]);

    // Columns Define
    const COLUMNS = [
        { title: "Position" },
        { title: "Type" },
        { title: "Banner Image" },
        { title: "Slider Name" },
        { title: "Action" }
    ];


    const { state, setState, changeState, ...otherTableActionProps } =
        usePaginationTable({

        });
    // Paginate
    const paginate = (clear = false, isNewFilter = false) => {
        changeState("loader", true);
        // -------------Get Banner Api-----------------
        API.get(`${apiConfig.linkUp}?menuURL=${menuId}`)
            .then((res) => {
                setState({
                    ...state,
                    // total_items: res.count,
                    data: res,
                    loader: false,
                });
            })
            .catch(() => {
                setState({
                    ...state,
                    loader: false,
                });
            });
    };

    // ---------------Delete Link Up--------------------

    const onClickDelete = (link_up_id) => {
        Swal.fire({
            title: "Are You Sure",
            text: "Are you sure you want to remove this Link Up?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "green",
            cancelButtonColor: "red",
            cancelButtonText: "No",
            confirmButtonText: "Yes",
            customClass: {
                container: "custom-swal-container",
            },
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                API.destroy(`${apiConfig.deleteLinkUp}/${link_up_id}`)
                    .then((res) => {
                        HELPER.toaster.success("Deleted Successfully");
                        paginate();
                    })
                    .catch((e) => HELPER.toaster.error(e.errors.message))
            }
        });
    };

    useEffect(() => {
        paginate();
    }, [state.page, state.rowsPerPage, state.order, state.orderby, openBanner, openSlider]);

    const rows = useMemo(() => {
        return state.data.map((item) => {
            return {
                item: item,
                columns: [
                    <span>{item.position}</span>,
                    <span>{item.type}</span>,
                    <span>
                        {
                            item.Banner === null ? (
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        togglePopupBanner();
                                        // setOpenBanner(true)  
                                        setSelectedLinkId(item);
                                    }}
                                >
                                    Select Banner
                                </Button>

                            ) : (
                                <div onClick={() => { togglePopupBanner(); setSelectedLinkId(item); }}>
                                    <img
                                        className="table-image-display"
                                        src={HELPER.getImageUrl(item.Banner.image_url ? item.Banner.image_url : "")}
                                        alt=""
                                    />
                                    {/* {item.Banner.image_url && item.Banner.image_url.toLowerCase().match(/\.(mp4|3gpp|3gpp2|3gp2|mov|ogg|wmv|qt|avi)$/) ? (
                                    <video className="table-media-display" controls height={90} width={90}>
                                        <source src={HELPER.getImageUrl(item.Banner.image_url)} type="video/mp4" />
                                    </video>
                                ) : (
                                    <img
                                        className="table-image-display"
                                        src={HELPER.getImageUrl(item.Banner.image_url)}
                                        alt=""
                                    />
                                )} */}
                                </div>

                            )
                        }

                    </span >,
                    <div>
                        {
                            item.Slider === null ? (
                                <Button
                                    variant="contained"
                                    onClick={() => { togglePopupSlider(); setSelectedLinkId(item); }}
                                >
                                    Select Slider
                                </Button>
                            ) : (<div onClick={() => { togglePopupSlider(); setSelectedLinkId(item) }}>{HELPER.isEmpty(item.Slider) ? "" : item.Slider.name}</div>)
                        }

                    </div>,
                    <IconButton onClick={(e) => onClickDelete(item.page_slider_banner_id)}>
                        <Icon color="error">delete</Icon>
                    </IconButton>
                ],
            };
        });
    }, [state.data]);

    document.title = "Link Up Page List ";
    return (
        <>
            <ThemeDialog
                title={"Link Up Model"}
                isOpen={open}
                onClose={() => {
                    togglePopup();
                }}
                maxWidth="lg"
                actionBtns={
                    <Box>
                        <Button variant="contained" color="secondary" onClick={() => {
                            togglePopup();
                        }}>
                            Close
                        </Button>
                    </Box>
                }
            >
                <div>
                    <PaginationTable
                        header={COLUMNS}
                        rows={rows}
                        totalItems={state.total_items || 0}
                        perPage={state.rowsPerPage}
                        activePage={state.page}
                        footerVisibility={false}
                        checkboxColumn={false}
                        selectedRows={state.selectedRows}
                        enableOrder={true}
                        isLoader={state.loader}
                        emptyTableImg={<img src={error400cover} width="400px" />}
                        {...otherTableActionProps}
                        orderBy={state.orderby}
                        order={state.order}
                    ></PaginationTable>
                </div>
            </ThemeDialog>

            {openBanner &&
                (<DisplayBanner
                    open={openBanner}
                    setModal={setBannerModal}
                    togglePopup={() => {
                        togglePopupBanner();
                        // paginate();
                    }}
                    callBack={() => paginate(true)}
                    linkUp={selectedLinkId}
                />
                )}
            {openSlider &&
                (<DisplaySlider
                    open={openSlider}
                    setModal={setSliderModal}
                    togglePopup={() => {
                        togglePopupSlider();
                        // paginate();
                    }}
                    callBack={() => paginate(true)}
                    linkUp={selectedLinkId} />
                )}

        </>


    );
}

export default LinkUpModal
