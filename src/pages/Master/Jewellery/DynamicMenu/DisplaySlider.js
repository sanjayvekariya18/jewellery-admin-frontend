
import React, { useEffect, useMemo, useState } from 'react'
import PaginationTable, { usePaginationTable } from '../../../../components/UI/Pagination/PaginationTable';
import { apiConfig, appConfig } from '../../../../config';
import { API, HELPER } from '../../../../services';
import _ from "lodash"
import error400cover from "../../../../assets/no-data-found-page.png";
import { Box, Button, Radio } from "@mui/material";
import ThemeDialog from '../../../../components/UI/Dialog/ThemeDialog';
function DisplaySlider({ modal, setModal, toggle, callBack, linkUp }) {

    const [selectedRowId, setSelectedRowId] = useState(null);

    const COLUMNS = [
        { title: "Select Slider" },
        { title: "Slider Name", field: "title", order: true },
    ];

    const { state, setState, changeState, ...otherTableActionProps } =
        usePaginationTable({
        });
    const paginate = (clear = false, isNewFilter = false) => {
        changeState("loader", true);



        // -----------Get Slider Api----------------------

        API.get(apiConfig.slider)
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


    // const handleCheckbox = (item) => {
    //     setSliderId(item.slider_id);

    // }
    const handleCheckbox = (item) => {
        const sliderId = item.slider_id;
        setSelectedRowId(sliderId);
    };


    const handleUpdate = () => {
        const data = {
            type: "Slider",
            position: linkUp.position,
            slider_id: selectedRowId
        }

        API.put(apiConfig.updateLinkUp.replace(":id", linkUp.page_slider_banner_id), data)
            .then((res) => {
                callBack()
                setModal(false)
                HELPER.toaster.success("Slider Updated SuccessFully")
            })
            .catch((err) => {
                if (
                    err.status == 400 ||
                    err.status == 401 ||
                    err.status == 409 ||
                    err.status == 403 ||
                    err.status == 422
                ) {
                    HELPER.toaster.error(err.errors.message);
                } else {
                    console.error(err);
                }
            });
    }

    const rows = useMemo(() => {
        return state.data.map((item) => {
            const isSelected = item.slider_id === selectedRowId;  // Check if the item's ID matches the selected row ID
            const rowClass = isSelected ? 'selected-row' : '';
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
                            id = {item.slider_id}
                        />

                    </span>,
                    <span>{item.name}</span>,
                ],
            };
        });
    }, [state.data, selectedRowId]);

    return (
        <ThemeDialog
            title={"Slider Modal"}
            isOpen={modal}
            toggle={toggle}
            maxWidth="lg"
            actionBtns={
                <Box>
                    <Button variant="contained" color="secondary" onClick={toggle}>
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
                >
                    Update Slider
                </Button>
            </div>
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
                    selectedRowId={selectedRowId}
                    order={state.order}
                    isLoader={state.loader}
                    emptyTableImg={<img src={error400cover} width="350px" />}
                    {...otherTableActionProps}
                >
                </PaginationTable>
            </div>
        </ThemeDialog>
    )
}

export default DisplaySlider