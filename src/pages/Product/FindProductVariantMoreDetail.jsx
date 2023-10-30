import React, { useEffect, useMemo, useState } from "react";
import PaginationTable, {
  usePaginationTable,
} from "../../components/UI/Pagination/PaginationTable";
import { Navigate, useNavigate, useParams } from "react-router-dom/dist";
import { apiConfig } from "../../config";
import { API, HELPER } from "../../services";
import { Box, Button } from "@mui/material";
import { Breadcrumb } from "../../components";
import { pageRoutes } from "../../constants/routesList";
import ThemeDialog from "../../components/UI/Dialog/ThemeDialog";
import error400cover from "../../assets/no-data-found-page.png";

const FindProductVariantMoreDetail = () => {
  const gemstoneInfo = [
    { label: "Title : ", key: "title" },
    { label: "Metal Weight : ", key: "metalWeight" },
    { label: "Total Carat : ", key: "totalCarat" },
    { label: "Total Gemstone Carat : ", key: "totalGemstoneCarat" },
    { label: "Making Price : ", key: "makingPrice" },
    { label: "Metal Price : ", key: "metalPrice" },
    { label: "Diamond Price : ", key: "diamondPrice" },
    { label: "Gemstone Price : ", key: "gemstonePrice" },
    { label: "Total Price : ", key: "totalPrice" },
  ];
  const { productVariantId } = useParams();
  const [diamondModel, setDiamondModel] = useState(false);
  const [gemstoneModel, setGemstoneModel] = useState(false);
  const [attributesModel, setAttributeModel] = useState(false);
  const [variantModel, setVariantMOdel] = useState(false);
  const [productData, setProductData] = useState([]);
  const navigate = useNavigate();
  const { state, setState, changeState, ...otherTableActionProps } =
    usePaginationTable();

  useEffect(() => {
    API.get(
      apiConfig.findProductVariant.replace(
        ":productVariantId",
        productVariantId
      )
    )
      .then((res) => {
        setProductData(res);
        // setProductData(res.rows);
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
      });
  }, []);

  // diamond
  const COLUMNSDIAMOND = [
    { title: "StockId" },
    { title: "Shape" },
    { title: "Carat" },
    { title: "Color" },
    { title: "Clarity" },
    { title: "Price" },
  ];
  // row in data in diamond
  const productVariantDiamond = productData.ProductVariantDiamonds;
  const rowsDiamond = useMemo(() => {
    return (
      productVariantDiamond &&
      productVariantDiamond.map((item) => {
        return {
          item: item,
          columns: [
            <span>{item.stockId}</span>,
            <span>{item.shape}</span>,
            <span>{item.carat}</span>,
            <span>{item.color}</span>,
            <span>{item.clarity}</span>,
            <span>{item.price}</span>,
          ],
        };
      })
    );
  }, [productVariantDiamond]);

  // gemstone
  const COLUMNSGEMSTONE = [
    { title: "StockId" },
    { title: "Type" },
    { title: "Shape" },
    { title: "Carat" },
    { title: "Color" },
    { title: "Clarity" },
    { title: "Origin" },
    { title: "MLength" },
    { title: "MWidth" },
    { title: "MDepth" },
    { title: "Price" },
  ];
  const productVariantGemstone = productData.ProductVariantGemstones;
  const rowsGemstone = useMemo(() => {
    return (
      productVariantGemstone &&
      productVariantGemstone.map((item) => {
        return {
          item: item,
          columns: [
            <span style={{ whiteSpace: "nowrap" }}>{item.stockId}</span>,
            <span style={{ whiteSpace: "nowrap" }}>{item.gemstoneType}</span>,
            <span>{item.shape}</span>,
            <span>{item.carat}</span>,
            <span>{item.color}</span>,
            <span>{item.clarity}</span>,
            <span>{item.origin}</span>,
            <span>{item.mLength}</span>,
            <span>{item.mWidth}</span>,
            <span>{item.mDepth}</span>,
            <span>{item.price}</span>,
          ],
        };
      })
    );
  }, [productVariantGemstone]);

  // Attributes
  const COLUMNATTRIBUTES = [
    { title: "Index" },
    { title: "Attribute" },
    { title: "Option" },
  ];
  const productVariantAttributes = productData.ProductAttributes;
  const rowsAttributes = useMemo(() => {
    return (
      productVariantAttributes &&
      productVariantAttributes.map((item, i) => {
        const attribute = item.Attribute;
        const option = item.Option;
        return {
          item: item,
          columns: [
            <span>{i + 1}</span>,
            <span>{attribute.name}</span>,
            <span>{option.name}</span>,
          ],
        };
      })
    );
  }, [productVariantAttributes]);

  // product variant Detail
  const COLUMNVARIANT = [
    { title: "Index" },
    { title: "Value" },
    { title: "DetailName" },
    { title: "Description" },
    { title: "LogoUrl" },
    { title: "ProductDetailsGroupName" },
  ];
  const productVariant = productData.productVariantDetails;
  const rowsVariant = useMemo(() => {
    return (
      productVariant &&
      productVariant.map((item, i) => {
        const productDetail = item.ProductDetail;
        return {
          item: item,
          columns: [
            <span>{i + 1}</span>,
            <span>{item.value}</span>,
            <span>{productDetail.detailName}</span>,
            <span>
              {productDetail.description === ""
                ? "-"
                : productDetail.description}
            </span>,
            <span>
              {productDetail.logoUrl === null ? "-" : productDetail.logoUrl}
            </span>,
            <span>{productDetail.ProductDetailsGroup.groupName}</span>,
          ],
        };
      })
    );
  }, [productVariant]);

  const handleProductVariantClick = () => {
    console.log("hello");
    window.history.back(); // Use this to go back to the previous page
  };
  return (
    <>
      <Box
        className="breadcrumb"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px 0px 10px 10px",
        }}
      >
        <Breadcrumb
          routeSegments={[
            { name: "Masters", path: pageRoutes.diamond },
            { name: "Product", path: pageRoutes.product },
            {
              name: "Product Variant",
              onClick: handleProductVariantClick,
              style: { cursor: "pointer" },
            },
            { name: "Product Details" },
          ]}
        />
      </Box>
      <Box>
        <div style={{ marginLeft: "5px" }}>
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "auto auto",
                gap: "6px",
              }}
            >
              {gemstoneInfo.map((info) => (
                <div
                  key={info.key}
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "flex-start",
                    border: "1px solid #3736363b",
                  }}
                >
                  <div style={{ marginRight: "10px" }}>
                    <h3
                      style={{
                        fontSize: "17px",
                        fontWeight: "500",
                        color: "#373636de",
                        padding: "9px 0px 9px 8px",
                        margin: 0,
                        maxWidth: "190px",
                      }}
                    >
                      {info.label}
                    </h3>
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: "16px",
                        fontWeight: "400",
                      }}
                    >
                      {productData[info.key] || ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                border: "1px solid #3736363b",
                marginTop: "5px",
                padding: "4px 8px 10px 8px",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "500",
                  color: "#373636de",
                  margin: "9px 8px 10px 0",
                }}
              >
                Description :
              </h3>
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "400",
                }}
              >
                {productData.description}
              </span>
            </div>
          </>
        </div>
      </Box>

      <Box style={{ padding: "20px 10px" }}>
        {productVariantDiamond !== undefined &&
          productVariantDiamond.length !== 0 && (
            <Button variant="contained" onClick={() => setDiamondModel(true)}>
              Product Variant Diamonds
            </Button>
          )}
      </Box>

      {/* ThemeDialog Component */}
      <ThemeDialog
        isOpen={diamondModel}
        onClose={() => setDiamondModel(false)}
        title="Product Variant Diamonds Details"
        maxWidth="sm"
        actionBtns={
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setDiamondModel(false);
            }}
          >
            Okay
          </Button>
        }
      >
        <div>
          <PaginationTable
            header={COLUMNSDIAMOND}
            rows={rowsDiamond}
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
        </div>
      </ThemeDialog>

      <Box style={{ padding: "20px 10px" }}>
        {productVariantGemstone !== undefined &&
          productVariantGemstone.length > 0 && (
            <Button variant="contained" onClick={() => setGemstoneModel(true)}>
              Product Variant Gemstone
            </Button>
          )}
      </Box>

      <ThemeDialog
        isOpen={gemstoneModel}
        onClose={() => setGemstoneModel(false)}
        title="Product Variant Gemstone Details"
        maxWidth="md"
        actionBtns={
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setGemstoneModel(false);
            }}
          >
            Okay
          </Button>
        }
      >
        <div>
          <PaginationTable
            header={COLUMNSGEMSTONE}
            rows={rowsGemstone}
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
        </div>
      </ThemeDialog>

      <Box style={{ padding: "20px 10px" }}>
        {productVariantAttributes !== undefined &&
          productVariantAttributes.length > 0 && (
            <Button variant="contained" onClick={() => setAttributeModel(true)}>
              Product Variant Attributes
            </Button>
          )}
      </Box>
      <ThemeDialog
        isOpen={attributesModel}
        onClose={() => setAttributeModel(false)}
        title="Product Variant Attributes Details"
        maxWidth="md"
        actionBtns={
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setAttributeModel(false);
            }}
          >
            Okay
          </Button>
        }
      >
        <div>
          <PaginationTable
            header={COLUMNATTRIBUTES}
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
        </div>
      </ThemeDialog>

      <Box style={{ padding: "20px 10px" }}>
        {productVariant !== undefined && productVariant.length > 0 && (
          <Button variant="contained" onClick={() => setVariantMOdel(true)}>
            Product Variant Details
          </Button>
        )}
      </Box>
      <ThemeDialog
        isOpen={variantModel}
        onClose={() => setVariantMOdel(false)}
        title="Product Variant Details"
        maxWidth="md"
        actionBtns={
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              setVariantMOdel(false);
            }}
          >
            Cancel
          </Button>
        }
      >
        <div>
          <PaginationTable
            header={COLUMNVARIANT}
            rows={rowsVariant}
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
        </div>
      </ThemeDialog>
    </>
  );
};

export default FindProductVariantMoreDetail;
