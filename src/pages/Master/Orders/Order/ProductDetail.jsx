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
  Typography,
} from "@mui/material";
import { apiConfig } from "../../../../config";
import { API } from "../../../../services";
// import _, { head } from "lodash";
import error400cover from "../../../../assets/no-data-found-page.png";
import PaginationTable, {
  usePaginationTable,
} from "../../../../components/UI/Pagination/PaginationTable";

const ProductDetail = ({ open, togglePopup, productDetailData }) => {
  const [productDetail, setProductDetail] = useState("");
  const [addressText, setAddressText] = useState("");
  const [gemstoneModel, setGemstoneModel] = useState(false);
  const [textModal, setTextModal] = useState(false);
  const [titleModal, setTitleModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const textModaltoggle = () => {
    setTextModal(!textModal);
  };

  const textTitletoggle = () => {
    setTitleModal(!titleModal);
  };

  // Product variant column define
  const PRODUCTVARIANT = [
    { title: "Stock No", classNameWidth: "thead-second-width" },
    { title: "Title", classNameWidth: "thead-second-width-title" },
    { title: "Description", classNameWidth: "thead-second-width-title" },
    { title: "Metal Weight", classNameWidth: "thead-second-width" },
    { title: "Total Carat", classNameWidth: "thead-second-width" },
    { title: "Gemstone Carat", classNameWidth: "thead-second-width" },
    { title: "Making Price", classNameWidth: "thead-second-width" },
    { title: "Metal Price", classNameWidth: "thead-second-width" },
    { title: "Diamond Price", classNameWidth: "thead-second-width" },
    { title: "Gemstone Price", classNameWidth: "thead-second-width" },
    { title: "Total Price", classNameWidth: "thead-second-width" },
    { title: "Attribute", classNameWidth: "thead-second-width" },
    { title: productDetail?.orderProduct?.engraving !== null && "Engraving Details ", classNameWidth: "thead-second-width1" },
    { title: productDetail?.orderProduct?.engraving?.text !== undefined && "Name", classNameWidth: "thead-second-width" },
    { title: productDetail?.orderProduct?.engraving?.font !== undefined && "Font", classNameWidth: "thead-second-width" },
    { title: productDetail?.orderProduct?.engraving?.price !== undefined && "Price", classNameWidth: "thead-second-width" },
  ];

  const rowsProductVariant = [
    {
      item: productDetail?.productVariant,
      columns: [
        <span key="sr-no">{1}</span>,
        <span
          className="common-width-three-dot-text"
          style={{ fontWeight: "500", cursor: "pointer" }}
          onClick={() => showTitleInDialog(productDetail?.productVariant)}
        >
          {productDetail?.productVariant?.title}
        </span>,
        <span
          className="common-width-three-dot-text"
          style={{ fontWeight: "500", cursor: "pointer" }}
          onClick={() => showAddressInDialog(productDetail?.productVariant)}
        >
          {productDetail?.productVariant?.description}
        </span>,
        <span>{productDetail?.productVariant?.metalWeight}</span>,
        <span>{productDetail?.productVariant?.totalCarat}</span>,
        <span>{productDetail?.productVariant?.totalGemstoneCarat}</span>,
        <span>${productDetail?.productVariant?.makingPrice}</span>,
        <span>${productDetail?.productVariant?.metalPrice}</span>,
        <span>${productDetail?.productVariant?.diamondPrice}</span>,
        <span>${productDetail?.productVariant?.gemstonePrice}</span>,
        <span>${productDetail?.productVariant?.totalPrice}</span>,
        <Button variant="contained" onClick={() => setGemstoneModel(true)}>
          Attribute Detail
        </Button>,
        <br></br>,
        <span>{productDetail?.orderProduct?.engraving?.text !== undefined && productDetail?.orderProduct?.engraving?.text}</span>,
        <span>{productDetail?.orderProduct?.engraving?.font !== undefined && productDetail?.orderProduct?.engraving?.font}</span>,
        <span>
          {productDetail?.orderProduct?.engraving?.price !== undefined && (
            `$${productDetail?.orderProduct?.engraving?.price}`
          )}
        </span>

      ],
    },
  ];

  // gemstone details display

  const GEMSTONE = [
    { title: "Sr No", classNameWidth: "thead-second-width" },
    { title: "Title", classNameWidth: "thead-second-width-title" },
    { title: "Description", classNameWidth: "thead-second-width-title" },
    { title: "Origin", classNameWidth: "thead-second-width" },
    { title: "Color", classNameWidth: "thead-second-width" },
    { title: "MLength", classNameWidth: "thead-second-width" },
    { title: "MWidth", classNameWidth: "thead-second-width" },
    { title: "Clarity", classNameWidth: "thead-second-width" },
    { title: "Price", classNameWidth: "thead-second-width" },
  ];
  const rowsGemstone = [
    {
      item: productDetail?.orderProduct?.Gemstone,
      columns: [
        <div className="thead-second-width">
          <span>{productDetail?.orderProduct?.Gemstone?.stockId}</span>
        </div>,
        <span
          className="common-width-three-dot-text"
          style={{ fontWeight: "500", cursor: "pointer" }}
          onClick={() =>
            showTitleInDialog(productDetail?.orderProduct?.Gemstone)
          }
        > {productDetail?.orderProduct?.Gemstone?.title}</span >,
        <span
          className="common-width-three-dot-text"
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
        <span>{productDetail?.orderProduct?.Gemstone?.clarity}</span>,
        <span>${productDetail?.orderProduct?.Gemstone?.price}</span>,
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
      item: productDetail.orderProduct?.Diamond,
      columns: [
        <div className="common-thead-second-width">
          <span>{productDetail.orderProduct?.Diamond?.stockId}</span>
        </div>,
        <span>{productDetail.orderProduct?.Diamond?.carat}</span>,
        <span>{productDetail.orderProduct?.Diamond?.shapeName}</span>,
        <span>{productDetail.orderProduct?.Diamond?.color}</span>,
        <span>{productDetail.orderProduct?.Diamond?.clarity}</span>,
        <span>{productDetail.orderProduct?.Diamond?.origin}</span>,
        <span>{productDetail.orderProduct?.Diamond?.mLength}</span>,
        <span>{productDetail.orderProduct?.Diamond?.mWidth}</span>,
        <span>{productDetail.orderProduct?.Diamond?.mDepth}</span>,
        <span>{productDetail.orderProduct?.Diamond?.labName}</span>,
        <span>${productDetail.orderProduct?.Diamond?.price}</span>,
      ],
    },
  ];


  // description detail display
  const showAddressInDialog = (productDetail) => {
    const description = productDetail.description;
    setAddressText(description);
    textModaltoggle();
  };

  // title detail display
  const showTitleInDialog = (productDetail) => {
    const title = productDetail.title;
    setAddressText(title);
    textTitletoggle();
  };
  const {
    state,
    setState,
    changeState,
    getInitialStates,
    ...otherTableActionProps
  } = usePaginationTable({});

  // paginate code
  const paginate = (clear = false, isNewFilter = false) => {
    changeState("loader", true);
    setLoading(true);
    API.get(apiConfig.findProductDetail.replace(":id", productDetailData))
      .then((res) => {
        setProductDetail(res);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
      });
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
        {loading ? (
          <div style={{ textAlign: "center" }}>
            <img
              src="../../../../../../assets/loading.gif"
              alt=""
              srcSet=""
              height={28}
              width={28}
            />
          </div>
        ) : (
          <>
            {/* product variant in product detail display */}
            {Object.keys(productDetail).length !== 0 && (
              <Box style={{ display: "flex" }}>
                {Object.keys(productDetail.productVariant).length !== 0 && (
                  <div style={{ width: "50%", padding: "20px" }}>
                    {/* <h3>Product Variant Details</h3> */}
                    {rowsProductVariant[0] &&
                      Object.keys(rowsProductVariant[0]?.columns).length >
                      0 && (
                        <div align="center">
                          <h3>Product Variant Details</h3>
                        </div>
                      )}
                    {PRODUCTVARIANT.map((header, index) => (
                      <>
                        <TableContainer key={index}>
                          <Table>
                            <TableBody>
                              {header?.title !== false && <TableRow>
                                {/* Product Variant Details */}
                                {/* <div style={{ display: "flex" }}> */}
                                <TableCell style={{ fontWeight: "bold" }} >
                                  {header?.title}
                                </TableCell>
                                <TableCell style={{ fontWeight: "bold" }}>
                                  {rowsProductVariant[0]?.columns[index]}
                                </TableCell>
                                {/* </div> */}
                              </TableRow>}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </>
                    ))}
                  </div>)}

                {/* gemstone detail dispaly */}
                {(rowsGemstone[0].item !== undefined && rowsGemstone[0].item !== null) && <div style={{ width: "50%", padding: "20px" }}>
                  {rowsProductVariant[0] &&
                    Object.keys(rowsProductVariant[0]?.columns).length >
                    0 && (
                      <div align="center">
                        <h3>Gemstone Details</h3>
                      </div>
                    )}
                  {GEMSTONE.map((header, index) => (
                    <div key={index}>
                      <TableContainer key={index}>
                        <Table>
                          <TableBody>
                            <TableRow>
                              {/* <div style={{ display: "flex" }}> */}
                              <TableCell style={{ fontWeight: "bold" }} >
                                {/* {rowsGemstone[0] &&
                                  Object.keys(rowsGemstone[0]?.item || {}).length >
                                  0 &&
                                  GEMSTONE[index]?.title &&
                                  `${GEMSTONE[index].title}:`} */}
                                {header?.title}
                              </TableCell>
                              <TableCell style={{ fontWeight: "bold" }}>
                                {rowsGemstone[0]?.columns[index]}
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  ))}
                </div>}

                {/* diamond detail display */}
                {(rowsDiamond[0].item !== undefined && rowsDiamond[0].item !== null) && <div style={{ width: "50%", padding: "20px" }}>
                  {rowsProductVariant[0] &&
                    Object.keys(rowsProductVariant[0]?.columns).length >
                    0 && (
                      <div align="center">
                        <h4>Diamond Details</h4>
                      </div>
                    )}
                  {DIAMOND.map((header, index) => (
                    <div key={index}>
                      <TableContainer key={index}>
                        <Table>
                          <TableBody>
                            <TableRow>
                              {/* <div style={{ display: "flex" }}> */}
                              <TableCell style={{ fontWeight: "bold" }} >
                                {/* {rowsDiamond[0] &&
                                  Object.keys(rowsDiamond[0]?.item || {}).length >
                                  0 &&
                                  DIAMOND[index]?.title &&
                                  `${DIAMOND[index].title}:`} */}
                                {header?.title}
                              </TableCell>
                              <TableCell style={{ fontWeight: "bold" }}>
                                {rowsDiamond[0]?.columns[index]}
                              </TableCell>
                              {/* </div> */}
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  ))}
                </div>}
              </Box>
            )}
          </>
        )}

        {textModal && (
          <ThemeDialog
            title="Description"
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
            <div
              style={{ padding: "0px", margin: "0px", lineBreak: "anywhere" }}
            >
              <Typography variant="body1" style={{ lineHeight: "22px" }}>
                {addressText}
              </Typography>
            </div>
          </ThemeDialog>
        )}

        {titleModal && (
          <ThemeDialog
            title="Title"
            id="showModal"
            isOpen={titleModal}
            toggle={textTitletoggle}
            centered
            maxWidth="sm"
            actionBtns={
              <Button
                variant="contained"
                color="secondary"
                onClick={textTitletoggle}
              >
                Close
              </Button>
            }
          >
            <div
              style={{ padding: "0px", margin: "0px", lineBreak: "anywhere" }}
            >
              <Typography variant="body1" style={{ lineHeight: "22px" }}>
                {addressText}
              </Typography>
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
              isLoader={loading}
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
