import React, { useEffect, useMemo, useState } from 'react';
import ThemeDialog from '../../../../components/UI/Dialog/ThemeDialog';
import { Box, Button, Table, TableBody, TableHead, TableRow, TableCell } from '@mui/material';
import { apiConfig, appConfig } from '../../../../config';
import { API } from '../../../../services';
import _ from "lodash";
import error400cover from "../../../../assets/no-data-found-page.png";
import PaginationTable, { usePaginationTable } from '../../../../components/UI/Pagination/PaginationTable';
import Textarea from "../../../../components/UI/Textarea";


const ProductDetail = ({ open, togglePopup, productDetailData }) => {
    const [productDetail, setProductDetail] = useState("");
    const [addressText, setAddressText] = useState("");
    const [gemstoneModel, setGemstoneModel] = useState(false);
    const [textModal, setTextModal] = useState(false);

    const textModaltoggle = () => {
        setTextModal(!textModal);
    };
    const TITLE = [
        { title: "Stock No", classNameWidth: "thead-second-width" },
        { title: "Description", classNameWidth: "thead-second-width-title" },
        { title: "Title", classNameWidth: "thead-second-width-title" },
        { title: "Metal Weight", classNameWidth: "thead-second-width" },
        { title: "Total Carat", classNameWidth: "thead-second-width" },
        { title: "Gemstone Carat", classNameWidth: "thead-second-width" },
        { title: "Making Price", classNameWidth: "thead-second-width" },
        { title: "Metal Price", classNameWidth: "thead-second-width" },
        { title: "Diamond Price", classNameWidth: "thead-second-width" },
        { title: "GemstonePrice", classNameWidth: "thead-second-width" },
        { title: "Total Price", classNameWidth: "thead-second-width" },
        { title: "Attribute", classNameWidth: "thead-second-width" },
    ];
    const GEMSTONE = [
        { title: "Sr no", classNameWidth: "thead-second-width" },
        { title: "Title", classNameWidth: "thead-second-width-title" },
        { title: "Description", classNameWidth: "thead-second-width-title" },
        { title: "Origin", classNameWidth: "thead-second-width" },
        { title: "Color", classNameWidth: "thead-second-width" },
        { title: "MLength", classNameWidth: "thead-second-width" },
        { title: "MWidth", classNameWidth: "thead-second-width" },
        { title: "MDepth", classNameWidth: "thead-second-width" },
        { title: "Clarity", classNameWidth: "thead-second-width" },
        { title: "Price", classNameWidth: "thead-second-width" },
    ];
    const gemstone = [
        {
            item: productDetail?.orderProduct?.Gemstone,
            columns: [
                <span key="sr-no">{1}</span>,
                <div className="common-thead-second-width-title">
                    <span>{productDetail?.orderProduct?.Gemstone?.title}</span>
                </div>,
                <span
                    className="common-thead-second-width-title-answer"
                    style={{ fontWeight: "500", cursor: "pointer" }}
                    onClick={() => showAddressInDialog(productDetail?.orderProduct?.Gemstone)}
                >
                    {productDetail?.orderProduct?.Gemstone?.description}
                </span>,
                <span>{productDetail?.orderProduct?.Gemstone?.origin}</span>,
                <span>{productDetail?.orderProduct?.Gemstone?.color}</span>,
                <span>{productDetail?.orderProduct?.Gemstone?.mLength}</span>,
                <span>{productDetail?.orderProduct?.Gemstone?.mWidth}</span>,
                <span>{productDetail?.orderProduct?.Gemstone?.mDepth}</span>,
                <span>{productDetail?.orderProduct?.Gemstone?.clarity}</span>,
                <span>{productDetail?.orderProduct?.Gemstone?.price}</span>,
            ],
        },
    ];
    const showAddressInDialog = (productDetail) => {
        const description = productDetail.description;
        setAddressText(description);
        textModaltoggle();
    };

    const {
        state,
        setState,
        changeState,
        getInitialStates,
        ...otherTableActionProps
    } = usePaginationTable({});

    const paginate = (clear = false, isNewFilter = false) => {
        changeState("loader", true);
        API.get(apiConfig.findProductDetail.replace(":id", productDetailData))
            .then((res) => {
                setProductDetail(res); // Update this line
            })
    };

    useEffect(() => {
        paginate();
    }, [state.page, state.rowsPerPage]);
    const rows = [
        {
            item: productDetail?.productVariant,
            columns: [
                <span key="sr-no">{productDetail?.productVariant?.Product?.stockId}</span>,
                <span
                    className="common-thead-second-width-title-answer"
                    style={{ fontWeight: "500", cursor: "pointer" }}
                    onClick={() => showAddressInDialog(productDetail?.productVariant)}
                >
                    {productDetail?.productVariant?.description}
                </span>,
                <div className="common-thead-second-width-title">
                    <span>{productDetail?.productVariant?.title}</span>
                </div>,
                <span>{productDetail?.productVariant?.metalWeight}</span>,
                <span>{productDetail?.productVariant?.totalCarat}</span>,
                <span>{productDetail?.productVariant?.totalGemstoneCarat}</span>,
                <span>{productDetail?.productVariant?.makingPrice}</span>,
                <span>{productDetail?.productVariant?.metalPrice}</span>,
                <span>{productDetail?.productVariant?.diamondPrice}</span>,
                <span>{productDetail?.productVariant?.gemstonePrice}</span>,
                <span>{productDetail?.productVariant?.totalPrice}</span>,
                <Button
                    variant="contained"
                    onClick={() => setGemstoneModel(true)}
                >
                    Attribute Detail
                </Button>
            ],
        },
    ];
    const productVariantGemstone = productDetail?.productVariant?.attributes;
    const COLUMNSATTRIBUTES = [
        { title: "Index" },
        { title: "Attribute" },
        { title: "Option" },
    ];
    const rowsAttributes = useMemo(() => {
        return (
            productVariantGemstone &&
            productVariantGemstone.map((item, i) => {
                return {
                    item: item,
                    columns: [
                        <span>{i + 1}</span>,
                        <span>{item.attributesName}</span>,
                        <span>{item.optionsName}</span>,
                    ],
                };
            })
        );
    }, [productVariantGemstone]);
    return (
        <>
            <ThemeDialog
                title={`Product Details: ${productDetailData?.productVariant?.Product?.stockId || ""}`}
                isOpen={open}
                maxWidth="lg"
                onClose={togglePopup}
                actionBtns={
                    <Box>
                        <Button variant="contained" color="secondary" onClick={togglePopup}>
                            Close
                        </Button>
                    </Box>
                }
            >
                {Object.keys(productDetail).length !== 0 && (
                    <>
                        <h3>Product Variant Detail</h3>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {/* Render Table Headers */}
                                    {TITLE.map((header, index) => (
                                        <TableCell key={index} className={header.classNameWidth} style={{ backgroundColor: '#f0f0f0' }}>
                                            {header.title}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.map((row, index) => (
                                    <TableRow key={index}>
                                        {row.columns.map((cell, cellIndex) => (
                                            <TableCell key={cellIndex}>
                                                {cell}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </>
                )}

                {Object.keys(productDetail).length !== 0 && (
                    <>
                        <h3>Gemstone detail</h3>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {/* Render Table Headers */}
                                    {GEMSTONE.map((header, index) => (
                                        <TableCell key={index} className={header.classNameWidth} style={{ backgroundColor: '#f0f0f0' }}>
                                            {header.title}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {gemstone.map((row, index) => (
                                    <TableRow key={index}>
                                        {row.columns.map((cell, cellIndex) => (
                                            <TableCell key={cellIndex}>
                                                {cell}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </>
                )}

                {textModal && (
                    <ThemeDialog
                        title="FAQ Answer"
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
                        <div style={{ padding: "0px", margin: "0px" }}>
                            <Textarea
                                className="form-control"
                                rows="10"
                                value={addressText}
                                readOnly
                            ></Textarea>
                        </div>
                    </ThemeDialog>
                )}
            </ThemeDialog>
            <ThemeDialog
                isOpen={gemstoneModel}
                onClose={() => setGemstoneModel(false)}
                title="Product Attribute Details"
                maxWidth="sm"
                actionBtns={
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                            setGemstoneModel(false);
                        }}
                    >
                        Close
                    </Button>
                }
            >
                <div>
                    {rowsAttributes && rowsAttributes.length > 0 ? (
                        <PaginationTable
                            header={COLUMNSATTRIBUTES}
                            rows={rowsAttributes}
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
                            footerVisibility={false}
                        ></PaginationTable>
                    ) : (
                        <p>No data available</p>
                    )}
                </div>
            </ThemeDialog>
        </>



    );
}

export default ProductDetail;
