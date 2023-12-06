import React, { useEffect, useMemo, useState } from 'react';
import { Breadcrumb, Container } from '../../../../components';
import { API, HELPER } from '../../../../services';
import { apiConfig } from '../../../../config';
import Swal from "sweetalert2";
import error400cover from "../../../../assets/no-data-found-page.png";
import _ from "lodash";
import { pageRoutes } from '../../../../constants/routesList';
import {
    Box,
    Icon,
    IconButton,
    Button

} from "@mui/material";
import { toaster } from '../../../../services/helper';
import ReactDragListView from "react-drag-listview";
import PaginationTable, { usePaginationTable } from '../../../../components/UI/Pagination/PaginationTable';

const OurProductMaster = () => {
    const [loading, setLoading] = useState();
    const [rowMoved, setRowMoved] = useState(false);

    // column define
    const COLUMNS = [
        { title: "Drag", classNameWidth: "thead-second-width-action-50" },
        { title: "Stock No", classNameWidth: "thead-second-width-stone" },
        { title: "Product Title", classNameWidth: "thead-second-width-title" },
        { title: "Price", classNameWidth: "thead-second-width-action-carat" },
        { title: "Position", classNameWidth: "thead-second-width-action-carat" },
        { title: "Action", classNameWidth: "thead-second-width-discount " },
    ];

    // paginate code 
    const {
        state,
        setState,
        getInitialStates,
        changeState,
        ...otherTableActionProps
    } = usePaginationTable({});

    const paginate = (clear = false, isNewFilter = false) => {
        changeState("loader", true);

        setLoading(true);
        API.get(apiConfig.allOurProduct)
            .then((res) => {
                setLoading(false);
                setState({
                    data: res,
                });
            })
            .catch(() => {
                setLoading(false);

            });
    };

    // dragble code define
    const handleDragEnd = (fromIndex, toIndex) => {
        if (fromIndex !== toIndex) {
            const newData = [...state.data];
            const [draggedItem] = newData.splice(fromIndex, 1);
            newData.splice(toIndex, 0, draggedItem);
            setState({ ...state, data: newData });
            HELPER.toaster.success("Row Moved Successfully")
            setRowMoved(true);
        }
    };

    // save button in a draggable 
    const handleSaveButtonClick = () => {
        if (rowMoved) {
            const updatedDataOrder = state.data.map((item, index) => (
                {
                    productVariantId: item.ProductVariant.id,
                    position: index + 1,
                }));

            const payload = {
                products: updatedDataOrder,
            };

            API.put(apiConfig.updateOurProduct, payload)
                .then((res) => {
                    toaster.success('OurProducts updated successfully');
                    setRowMoved(false);
                    paginate();
                })
                .catch((error) => {
                    toaster.error('Error:', error);
                });
        }
    }

    // delete Handler
    const onClickDelete = (id) => {
        Swal.fire({
            title: "Are You Sure",
            text: "Are you sure you want to remove this Our Product ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "green",
            cancelButtonColor: "red",
            cancelButtonText: "No",
            confirmButtonText: "Yes",
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                API.destroy(`${apiConfig.allOurProduct}/${id}`)
                    .then((res) => {
                        toaster.success("Deleted Successfully");
                        paginate();
                    })
                    .catch(console.error);
            }
        });
    };

    useEffect(() => {
        paginate();
    }, []);

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
                    <span>{item.ProductVariant?.Product?.stockId}</span>,
                    <span>{item.ProductVariant.title}</span>,
                    <span>${item.ProductVariant.totalPrice}</span>,
                    <span>{item.position}</span>,
                    <div>
                        <IconButton onClick={(e) => onClickDelete(item.id)}>
                            <Icon color="error">delete</Icon>
                        </IconButton>
                    </div>,
                ],
            };
        });
    }, [state.data]);
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
                        { name: "Masters", path: pageRoutes.master.user.user },
                        { name: "Our Products" },
                    ]}
                />
            </Box>
            <div style={{ display: "flex", justifyContent: "flex-end", paddingBottom: "10px" }}>
                <Button
                    variant="contained"
                    onClick={handleSaveButtonClick}
                    disabled={!rowMoved}
                >
                    Save
                </Button>
            </div>
            <ReactDragListView onDragEnd={handleDragEnd}>
            <PaginationTable
                    header={COLUMNS}
                    rows={rows}
                    totalItems={state.total_items || 0}
                    perPage={10}
                    activePage={0}
                    checkboxColumn={false}
                    selectedRows={state.selectedRows}
                    enableOrder={true}
                    isLoader={loading}
                    footerVisibility={false}
                    emptyTableImg={<img src={error400cover} width="400px" />}
                    {...otherTableActionProps}
                    orderBy={state.orderby}
                    order={state.order}
                ></PaginationTable>
            </ReactDragListView>
        </Container>
    );
}

export default OurProductMaster;
