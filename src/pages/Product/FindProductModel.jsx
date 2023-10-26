import React, { useEffect, useMemo } from 'react';
import { Box, Button } from "@mui/material";
import ThemeDialog from '../../components/UI/Dialog/ThemeDialog';
import error400cover from "../../assets/no-data-found-page.png";
import PaginationTable, { usePaginationTable } from '../../components/UI/Pagination/PaginationTable';
import useDidMountEffect from '../../hooks/useDidMountEffect';
import { API, HELPER } from '../../services';
import { apiConfig, appConfig } from '../../config';
import _ from "lodash";


const FindProductModel = ({ open, togglePopup, productData }) => {
    const COLUMNS = [
        { title: "Index" },
        { title: "Title" },
        { title: "Description" },
        { title: "Metal Weight" },
        { title: "Total Carat" },
        { title: "Making Price" },
        { title: "Metal Price" },
        { title: "Diamond Price" },
        { title: "Total Price" },
    ];
    const { state, setState, changeState, ...otherTableActionProps } = usePaginationTable();

    const paginate = () => {
        let filter = {
            page: state.page,
            rowsPerPage: state.rowsPerPage,
        };

        // ----------Get Product Api------------
        API.get(apiConfig.findProduct.replace(":productId", productData), filter)
            .then((res) => {
                setState({
                    ...state,
                    total_items: res.count,
                    data: res.rows,
                    loader: false,
                });
            })
            .catch((err) => {
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
            })
    };
    useDidMountEffect(() => {
        if (productData) {
            paginate();
        }
    }, [state.page, state.rowsPerPage, productData]);

    // useEffect(() => {
    //     // if (productData) {
    //     //     paginate();
    //     // }
    // }, [productData]);
    const rows = useMemo(() => {
        return state.data.map((item, i) => {
            return {
                item: item,
                columns: [
                    <span>{i + 1}</span>,
                    <span>{item.title}</span>,
                    <span>{item.description}</span>,
                    <span>{item.metalWeight}</span>,
                    <span>{item.totalCarat}</span>,
                    <span>{item.makingPrice}</span>,
                    <span>{item.metalPrice}</span>,
                    <span>{item.diamondPrice}</span>,
                    <span>{item.totalPrice}</span>,
                ],
            };
        });
    }, [state.data]);
    return (
        <ThemeDialog
            title={`Product Details : ${productData !== null && productData.productId
                }`}
            isOpen={open}
            onClose={() => {
                togglePopup();
            }}
            actionBtns={
                <Box>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                            togglePopup();
                        }}
                    >
                        Close
                    </Button>
                </Box>
            }
        >
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
                emptyTableImg={<img src={error400cover} width="400px" />}
                {...otherTableActionProps}
                orderBy={state.orderby}
                order={state.order}
            ></PaginationTable>
        </ThemeDialog>
    );
}

export default FindProductModel;
