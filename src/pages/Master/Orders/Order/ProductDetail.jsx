import React, { useEffect, useMemo, useState } from "react";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TableCell,
} from "@mui/material";
import { apiConfig, appConfig } from "../../../../config";
import { API } from "../../../../services";
import _ from "lodash";
import error400cover from "../../../../assets/no-data-found-page.png";
import PaginationTable, {
  usePaginationTable,
} from "../../../../components/UI/Pagination/PaginationTable";
import Textarea from "../../../../components/UI/Textarea";

const ProductDetail = ({ open, togglePopup, productDetailData }) => {
  const [productDetail, setProductDetail] = useState("");
  const [addressText, setAddressText] = useState("");
  const [gemstoneModel, setGemstoneModel] = useState(false);
  const [textModal, setTextModal] = useState(false);

  const textModaltoggle = () => {
    setTextModal(!textModal);
  };
  const PRODUCTVARIANT = [
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
  const rowsProductVariant = [
    {
      item: productDetail?.productVariant,
      columns: [
        <span key="sr-no">{1}</span>,
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
        <Button variant="contained" onClick={() => setGemstoneModel(true)}>
          Attribute Detail
        </Button>,
      ],
    },
  ];

  // gemstone details display

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
  const rowsGemstone = [
    {
      item: productDetail?.orderProduct?.Gemstone,
      columns: [
        <div className="common-thead-second-width-title">
          <span>{productDetail?.orderProduct?.Gemstone?.title}</span>
        </div>,
        <span
          className="common-thead-second-width-title-answer"
          style={{ fontWeight: "500", cursor: "pointer" }}
          onClick={() =>
            showAddressInDialog(productDetail?.orderProduct?.Gemstone)
          }
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

  // attributes detail
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
            <div className="span-permision">
              <span>{item.attributesName}</span>
            </div>,
            <span>{item.optionsName}</span>,
          ],
        };
      })
    );
  }, [productVariantGemstone]);

  // diamond detail

  const DIAMOND = [
    { title: "StockId", classNameWidth: "thead-second-width" },
    { title: "Carat", classNameWidth: "thead-second-width-title" },
    { title: "ShapeName", classNameWidth: "thead-second-width-title" },
    { title: "Color", classNameWidth: "thead-second-width" },
    { title: "Clarity", classNameWidth: "thead-second-width" },
    { title: "Origin", classNameWidth: "thead-second-width" },
    { title: "MLength", classNameWidth: "thead-second-width" },
    { title: "MWidth", classNameWidth: "thead-second-width" },
    { title: "MDepth", classNameWidth: "thead-second-width" },
    { title: "LabName", classNameWidth: "thead-second-width" },
    { title: "Price", classNameWidth: "thead-second-width" },
  ];
  const rowsDiamond = [
    {
      item: productDetail?.diamond,
      columns: [
        <div className="common-thead-second-width-title">
          <span>{productDetail?.diamond?.stockId}</span>
        </div>,
        <span>{productDetail?.diamond?.carat}</span>,
        <span>{productDetail?.diamond?.shapeName}</span>,
        <span>{productDetail?.diamond?.color}</span>,
        <span>{productDetail?.diamond?.clarity}</span>,
        <span>{productDetail?.diamond?.origin}</span>,
        <span>{productDetail?.diamond?.mLength}</span>,
        <span>{productDetail?.diamond?.mWidth}</span>,
        <span>{productDetail?.diamond?.mDepth}</span>,
        <span>{productDetail?.diamond?.labName}</span>,
        <span>{productDetail?.diamond?.price}</span>,
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
    API.get(apiConfig.findProductDetail.replace(":id", productDetailData)).then(
      (res) => {
        setProductDetail(res);
      }
    );
  };

  useEffect(() => {
    paginate();
  }, [state.page, state.rowsPerPage]);

  return (
    <>
      <ThemeDialog
        title={"Product Details"}
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
          <TableContainer style={{ overflow: "hidden" }}>
            <Table>
              <TableBody>
                <TableRow>
                  {/* Product Variant Details */}
                  {rowsProductVariant[0] &&
                    Object.keys(rowsProductVariant[0]?.item || {}).length >
                      0 && (
                      <TableCell colSpan={8} align="center">
                        <h3>Product Variant Details</h3>
                      </TableCell>
                    )}
                  {/* Gemstone Details */}
                  {rowsGemstone[0] &&
                    Object.keys(rowsGemstone[0]?.item || {}).length > 0 && (
                      <TableCell colSpan={4} align="center">
                        <h3>Gemstone Details</h3>
                      </TableCell>
                    )}
                  {/* Diamond Details */}
                  {rowsDiamond[0] &&
                    Object.keys(rowsDiamond[0]?.item || {}).length > 0 && (
                      <TableCell colSpan={4} align="center">
                        <h3>Diamond Details</h3>
                      </TableCell>
                    )}
                </TableRow>
                {/* Displaying details for each section */}
                {PRODUCTVARIANT.map((header, index) => (
                  <TableRow key={index}>
                    {/* Product Variant Details */}
                    <TableCell style={{ fontWeight: "bold" }} colSpan={2}>
                      {header?.title}:
                    </TableCell>
                    <TableCell colSpan={2}>
                      {rowsProductVariant[0]?.columns[index]}
                    </TableCell>
                    {/* Gemstone Details */}
                    <TableCell style={{ fontWeight: "bold" }} colSpan={2}>
                      {rowsGemstone[0] &&
                        Object.keys(rowsGemstone[0]?.item || {}).length > 0 &&
                        GEMSTONE[index]?.title &&
                        `${GEMSTONE[index].title}:`}
                    </TableCell>
                    <TableCell colSpan={2}>
                      {rowsGemstone[0]?.columns[index]}
                    </TableCell>
                    {/* Diamond Details */}
                    <TableCell style={{ fontWeight: "bold" }} colSpan={2}>
                      {rowsDiamond[0] &&
                        Object.keys(rowsDiamond[0]?.item || {}).length > 0 &&
                        DIAMOND[index]?.title &&
                        `${DIAMOND[index].title}:`}
                    </TableCell>
                    <TableCell colSpan={2}>
                      {rowsDiamond[0]?.columns[index]}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
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
};

export default ProductDetail;
