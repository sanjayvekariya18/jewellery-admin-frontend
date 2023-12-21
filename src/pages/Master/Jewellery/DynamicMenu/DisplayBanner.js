
import React, {  useEffect, useMemo, useState } from 'react'
import { apiConfig } from '../../../../config';
import { Box, Button, Radio, Typography } from "@mui/material";
import { API, HELPER } from '../../../../services';
import PaginationTable, { usePaginationTable } from '../../../../components/UI/Pagination/PaginationTable';
import ThemeDialog from '../../../../components/UI/Dialog/ThemeDialog';
import error400cover from "../../../../assets/no-data-found-page.png";


const DisplayBanner = ({ open, setModal, togglePopup, callBack, linkUp }) => {

    const [selectedRowId, setSelectedRowId] = useState(null);
    const [addressText, setAddressText] = useState("");
    const [textModal, setTextModal] = useState(false);

    const handleButtonClick = (item) => {
    };

    const COLUMNS = [
        { title: "Select Banner" },
        { title: "Image" },
        { title: "Banner Title" },
        { title: "Sub Title", classNameWidth: "common-width-three-dot-text" },
    ];
    const { state, setState, changeState, ...otherTableActionProps } =
        usePaginationTable({
        });
    const paginate = (clear = false, isNewFilter = false) => {
        changeState("loader", true);


        let filter = {
            page: state.page,
            rowsPerPage: state.rowsPerPage,
        };
        // -----------Get Slider Api----------------------

        API.get(apiConfig.banner, filter)
            .then((res) => {
                setState({
                    ...state,
                    total_items: res.count,
                    data: res.rows,
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

    useEffect(() => {
        paginate();
    }, [state.page, state.rowsPerPage, state.order, state.orderby]);

    // handleCheckbox function define
    const handleCheckbox = (item) => {
        const bannerId = item.banner_id;
        setSelectedRowId(bannerId);
    };

    //   handleUpdate banner update function
    const handleUpdate = () => {
        const data = {
            type: "Banner",
            position: linkUp.position,
            banner_id: selectedRowId
        }

        API.put(apiConfig.updateLinkUp.replace(":id", linkUp.page_slider_banner_id), data)
            .then((res) => {
                callBack()
                setModal(false)
                HELPER.toaster.success("Banner Updated SuccessFully")
                togglePopup();
            })
            .catch((err) => {
                if (
                    err.status === 400 ||
                    err.status === 401 ||
                    err.status === 409 ||
                    err.status === 403 ||
                    err.status === 422
                ) {
                    HELPER.toaster.error(err.errors.message);
                } else {
                    HELPER.toaster.error(err)
                }
            });
    }

    const rows = useMemo(() => {
        return state.data.map((item) => {
            const isSelected = item.banner_id === selectedRowId;
            return {
                item: item,
                columns: [
                    <span>
                        <Radio
                            checked={isSelected}
                            onChange={() => handleCheckbox(item)}
                            value="a"
                            name="radio-buttons"
                            inputProps={{ 'aria-label': 'A' }}
                            id={item.banner_id}
                        />
                    </span>,
                    <span>
                        {item.image_url && item.image_url.toLowerCase().match(/\.(mp4|3gpp|3gpp2|3gp2|mov|ogg|wmv|qt|avi)$/) ? (
                            <button
                                type="button"
                                className="btn btn-primary "
                                onClick={() => {
                                    // setVideoModal(true);
                                    handleButtonClick(item);
                                }}
                            >
                                View
                            </button>
                        ) : (
                            <img
                                className="table-image-display"
                                src={HELPER.getImageUrl(item.image_url)}
                                alt=""
                            />
                        )}
                    </span>,
                    <span>
                        {HELPER.isEmpty(item.title) ? "" : item.title}
                    </span>,

                    <div
                        className="common-width-three-dot-text"
                        style={{ fontWeight: "500", cursor: "pointer" }}
                        onClick={() => showAddressInDialog(item)}
                    >
                        <span>{HELPER.isEmpty(item.sub_title) ? "" : item.sub_title}</span>
                    </div>,
                ],
            };
        });
    }, [state.data, selectedRowId]);

    // subTitle display in model
    const showAddressInDialog = (item) => {
        const sub_title = item.sub_title;
        setAddressText(sub_title); // Set the address text
        textModaltoggle(); // Show the dialog
    };
    const textModaltoggle = () => {
        setTextModal(!textModal);
    };

    document.title = "Banner Page List ";

    return (
        <ThemeDialog
            title={"Banner Modal"}
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
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                
                    <Button
                    variant="contained"
                    style={{ marginBottom: "10px" }}
                    onClick={handleUpdate}
                    disabled={!selectedRowId}
                >
                    Update Banner
                </Button>
            </div>
            {/* pagination code */}
            <div>
                <PaginationTable
                    header={COLUMNS}
                    rows={rows}
                    totalItems={state.total_items || 0}
                    perPage={state.rowsPerPage}
                    activePage={state.page}
                    checkboxColumn={false}
                    isSelected={true}
                    selectedRows={state.selectedRows}
                    enableOrder={true}
                    isLoader={state.loader}
                    emptyTableImg={<img src={error400cover} width="400px" />}
                    {...otherTableActionProps}
                    orderBy={state.orderby}
                    selectedRowId={selectedRowId}
                    order={state.order}
                ></PaginationTable>
            </div>

            {/* subTitle model in display */}
            {textModal && (
                <ThemeDialog
                    title="Sub Title"
                    isOpen={textModal}
                    toggle={textModaltoggle}
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
        </ThemeDialog>
    )
}

export default DisplayBanner