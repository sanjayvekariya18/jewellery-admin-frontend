import React, { useEffect, useMemo, useState, useCallback } from "react";
import {  Button, Typography, Checkbox } from "@mui/material";
import { API, HELPER } from "../../../../services";
import error400cover from "../../../../assets/no-data-found-page.png";
import PaginationTable, { usePaginationTable } from "../../../../components/UI/Pagination/PaginationTable";
import { apiConfig } from "../../../../config";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";

const BannerMaster = ({ open, togglePopup2, userData, sliderBanner }) => {
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
    const [loading, setLoading] = useState();
    const [addressText, setAddressText] = useState("");
    const [textModal, setTextModal] = useState(false);
    // ----Pagination code------
    const COLUMNS = [
        { title: "Select", classNameWidth: "thead-second-width-discount" },
        { title: "Banner Title", classNameWidth: "thead-second-width-title-answer" },
        { title: "Sub Title", classNameWidth: "thead-second-width-title-answer" },
        { title: "Image", classNameWidth: "thead-second-width-discount-85" },
        { title: "Button Text", classNameWidth: "thead-second-width-stone" },
        { title: "Is Clickable", classNameWidth: "thead-second-width-discount-85" },
        { title: "Show Button", classNameWidth: "thead-second-width-discount-85" },
     
    ];
    const showAddressInDialog = (item) => {
        const sub_title = item.sub_title;
        setAddressText(sub_title); // Set the address text
        textModaltoggle(); // Show the dialog
    };
    const {
        state,
        setState,
        getInitialStates,
        changeState,
        ...otherTableActionProps
    } = usePaginationTable({
        
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
        
    };

    //------------ Delete Colored Diamond --------------

    
    const handleCheckbox = (item) => {
        setSelectedCheckboxes((prevSelectedCheckboxes) => {
            if (prevSelectedCheckboxes.some((selectedItem) => selectedItem.banner_id === item.banner_id)) {
                return prevSelectedCheckboxes.filter((selectedItem) => selectedItem.banner_id !== item.banner_id);
            } else {
                return [...prevSelectedCheckboxes, item];
            }
        });
    };

   
    useEffect(() => {
        paginate();
    }, [state.page, state.rowsPerPage]);

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
                    <div
                        className="common-thead-second-width-title"
                        style={{ fontWeight: "500", cursor: "pointer" }}
                        onClick={() => showAddressInDialog(item)}
                    >
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

                  
                ],
            };
        });
    }, [state.data, selectedCheckboxes]);
    const bannerDataFromAPI = sliderBanner.map((item, i) => ({
        banner_id: item.banner_id,
        position: item.position,
    }))
    const maxPositionFromAPI = bannerDataFromAPI.reduce((max, item) => Math.max(max, item.position || 0), 0);
    let positionCounter = maxPositionFromAPI + 1;

    const selectedCheckboxesWithPosition = selectedCheckboxes.map(item => ({
        ...item,
        position: positionCounter++
    }));

    const mergedData = [
        ...selectedCheckboxesWithPosition,
        ...bannerDataFromAPI
    ];
   
    const handleSubmit = () => {
        const data = {
            slider_id: userData,
            slider_banner: mergedData
        }
        API.post(apiConfig.sliderBanner, data)
            .then((res) => {
                HELPER.toaster.success("Slider Banner added successfully")
                setSelectedCheckboxes([]);
                // togglePopup2();
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
            })
           
    };

   

    const textModaltoggle = () => {
        setTextModal(!textModal);
    };
    return (
        <>
            <ThemeDialog
                title="Add Slider Banner"
                id="showModal"
                isOpen={open}
                toggle={togglePopup2}
                centered
                maxWidth="xl"
                actionBtns={
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={togglePopup2}
                    >
                        Close
                    </Button>
                }
            >
                <div style={{ display: "flex", justifyContent: "end",marginBottom:"10px" }}>

                    <Button
                        style={{ marginLeft: "20px" }}
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={selectedCheckboxes.length === 0}
                    >
                        <i className="ri-add-line align-bottom me-1"></i> Add Slider Banner
                    </Button>
                </div>
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

            </ThemeDialog>
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

export default BannerMaster;





