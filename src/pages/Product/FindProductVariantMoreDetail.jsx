import React, { useEffect, useMemo, useState } from "react";
import {
  usePaginationTable,
} from "../../components/UI/Pagination/PaginationTable";
import { useNavigate, useParams } from "react-router-dom/dist";
import ScaleIcon from '@mui/icons-material/Scale';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import { apiConfig } from "../../config";
import { API, HELPER } from "../../services";
import { Breadcrumb } from "../../components";
import { pageRoutes } from "../../constants/routesList";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Icon,


} from '@mui/material';


const FindProductVariantMoreDetail = () => {
  const { productVariantId } = useParams();
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(false);


  // paginate code

  const { state, setState, changeState, ...otherTableActionProps } =
    usePaginationTable();

  useEffect(() => {
    setLoading(true);
    API.get(
      apiConfig.findProductVariant.replace(
        ":productVariantId",
        productVariantId
      )
    )
      .then((res) => {
        setLoading(false);
        setProductData(res);
        setState({
          ...state,
          total_items: res.count,
          data: res.rows,
          loader: false,
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
          HELPER.toaster.error(err)
        }
      });
  }, []);

  const navigate = useNavigate();
  const handleOnClick = () => {
    navigate(-1);
  };
  // Calculate total carat and total price for diamonds
  const totalDiamondCarat = (
    productData?.VariantSkuDiamondLinks?.reduce((acc, diamond) => acc + diamond.ProductVariantDiamond.carat, 0) || 0
  ).toFixed(2);

  const totalDiamondPrice = (
    productData?.VariantSkuDiamondLinks?.reduce((acc, diamond) => acc + diamond.ProductVariantDiamond.price, 0) || 0
  );

  // Calculate total carat and total price for gemstones
  const totalGemstoneCarat = (
    productData?.VariantSkuGemstoneLinks?.reduce((acc, gemstone) => acc + gemstone?.ProductVariantGemstone?.carat, 0) || 0
  ).toFixed(2);

  const totalGemstonePrice = (
    productData?.VariantSkuGemstoneLinks?.reduce((acc, gemstone) => acc + gemstone?.ProductVariantGemstone?.price, 0) || 0
  );

  return (
    <>
      <Box
        className="breadcrumb"
        sx={{
          display: "flex",
          justifyContent: "space-between",
          padding: "30px 0px 0px 40px",
        }}
      >
        <Breadcrumb
          routeSegments={[
            { name: "Masters", path: pageRoutes.diamond },
            { name: "Product", path: pageRoutes.product },
            {
              name: "Product Variant",
              onClick: handleOnClick,
            },
            { name: "Product Details" },
          ]}
        />
      </Box>

      <section className="box">
        <div className="content">
          <div className="right">
            <div className="product_description">
              <div style={{ display: "flex" }}>
                <div style={{ width: "100%" }}>
                  <h2>{productData.title}</h2>
                  <p style={{ textAlign: "justify", marginRight: "20px" }}>{productData.description}</p>
                  <h4> STOCK ID :  <span style={{ color: "#808080" }}>{productData?.Product?.stockId}</span></h4>
                  <h4 style={{ paddingTop: "15px" }}>SKU :  <span style={{ color: "#808080" }}>{productData.sku}</span></h4>
                  <div style={{ display: 'flex', paddingTop: "15px" }}>
                    <div style={{ display: "flex", alignItems: "baseline", marginRight: "20px" }}>
                      <h4 style={{ marginRight: "10px" }}>VISIBLE</h4>
                      {productData.isVisible ? (
                        <div style={{ backgroundColor: "#daf4f0", color: "#0ab39c", padding: "2px 15px", textTransform: "uppercase", width: "max-content" }}>true
                        </div>
                      ) : (
                        <div style={{ backgroundColor: "#fde8e4", color: "#e74c3c", padding: "2px 15px", width: "max-content", textTransform: "uppercase" }}>false
                        </div>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "baseline" }}>
                      <h4 style={{ marginRight: "10px" }}>DEFAULT</h4>
                      {productData.isDefault ? (
                        <div style={{ backgroundColor: "#daf4f0", color: "#0ab39c", padding: "2px 15px", width: "max-content", textTransform: "uppercase" }}>true
                        </div>
                      ) : (
                        <div style={{ backgroundColor: "#fde8e4", color: "#e74c3c", padding: "2px 15px", width: "max-content", textTransform: "uppercase" }}>false
                        </div>
                      )}
                    </div>
                  </div>
                  <h4 style={{ paddingTop: "15px" }}>Total Price :  <span style={{ color: "#808080" }}>${productData.totalPrice}</span></h4>
                </div>
                <Card style={{ width: "40%", marginTop: 30, marginRight: 17, height: "50%" }}>
                  <CardContent>
                    <div style={{ marginTop: "10px", borderBottom: "1px dashed #dddddd", paddingBottom: "10px", display: "flex", alignItems: "center" }} >
                      <Icon style={{ fontSize: "25px", color: "gray" }}>diamondIcon</Icon>
                      <div style={{ marginLeft: "15px" }}>
                        <h4>Making Price</h4>
                        <div style={{ display: "flex", alignItems: "flex-start" }}>
                          <span><MonetizationOnOutlinedIcon style={{ fontSize: "18px" }} /></span>
                          <span style={{ marginLeft: "4px" }}>{productData.makingPrice}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: "10px", borderBottom: "1px dashed #dddddd", paddingBottom: "10px", display: "flex", alignItems: "center" }} >
                      <Icon style={{ fontSize: "25px", color: "#BC3E3E" }}>diamondIcon</Icon>
                      <div style={{ marginLeft: "15px" }}>
                        <h4>Metal</h4>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span><MonetizationOnOutlinedIcon style={{ fontSize: "18px" }} /></span><span style={{ marginLeft: "5px" }}>{productData.metalPrice}</span>
                          <span style={{ marginLeft: "20px" }}><ScaleIcon style={{ fontSize: "18px" }} /></span><span style={{ marginLeft: "5px" }}>{productData.metalWeight}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: "10px", borderBottom: "1px dashed #dddddd", paddingBottom: "10px", display: "flex", alignItems: "center" }} >
                      <Icon style={{ fontSize: "25px" }}>diamondIcon</Icon>
                      <div style={{ marginLeft: "15px" }}>
                        <h4>Diamond</h4>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span><MonetizationOnOutlinedIcon style={{ fontSize: "18px" }} /></span><span style={{ marginLeft: "5px" }}>{productData.diamondPrice}</span>
                          <span style={{ marginLeft: "20px" }}><ScaleIcon style={{ fontSize: "18px" }} /></span><span style={{ marginLeft: "5px" }}>{productData.totalCarat}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: "10px", display: "flex", alignItems: "center" }} >
                      <Icon style={{ fontSize: "25px", color: "green" }}>diamondIcon</Icon>
                      <div style={{ marginLeft: "15px" }}>
                        <h4>Gemstone</h4>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span><MonetizationOnOutlinedIcon style={{ fontSize: "18px" }} /></span><span style={{ marginLeft: "5px" }}>{productData.gemstonePrice}</span>
                          <span style={{ marginLeft: "20px" }}><ScaleIcon style={{ fontSize: "18px" }} /></span><span style={{ marginLeft: "5px" }}>{productData.totalGemstoneCarat}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div>
                <div className="card-wrapper">
                  <Card sx={{ marginTop: 2, marginRight: 2, width: "100%" }}>
                    <CardHeader title="Attribute" style={{ paddingBottom: "0px" }} />
                    <CardContent>
                      <div style={{ display: "flex", flexWrap: "wrap" }} className="card_product">
                        {productData?.ProductAttributes?.map((item, index) => (

                          <Card key={index} sx={{ width: "14%", margin: " 10px " }}>
                            <CardContent>
                              <h4 style={{ fontWeight: "bold" }}>{item?.Attribute?.name}</h4>
                              <p>{item?.Option?.name}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div>
                  <div className="card-wrapper">
                    <Card sx={{ marginTop: 2, marginRight: 2, width: "100%" }}>
                      <CardHeader title="Variant Detail" style={{ paddingBottom: "0px" }} />
                      <CardContent style={{ display: "flex", flexWrap: "wrap" }} >
                        {productData?.productVariantDetails?.map((group, index) => (
                          <Card key={index} sx={{ marginTop: 2, width: "30%", margin: "10px" }}>
                            <CardContent>
                              <div className="card_variant">
                                <TableContainer>
                                  <Table>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell colSpan={2} style={{ fontWeight: "bold" }}>{group.groupName}</TableCell>
                                      </TableRow>
                                      {group.details.map((detail, idx) => (
                                        <TableRow key={idx}>
                                          <TableCell>{detail.detailName}</TableCell>
                                          <TableCell>{detail.value}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </TableContainer>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Card sx={{ marginTop: 2, marginRight: 2, width: "50%" }}>
                    <CardHeader title="Diamond" style={{ paddingBottom: "0px" }} />
                    <CardContent>
                      <TableContainer>
                        {productData.VariantSkuDiamondLinks && productData.VariantSkuDiamondLinks.length > 0 ? (
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell>Stock No</TableCell>
                                <TableCell>Shape</TableCell>
                                <TableCell>Carat</TableCell>
                                <TableCell>Color</TableCell>
                                <TableCell>Clarity</TableCell>
                                <TableCell>Qty</TableCell>
                                <TableCell style={{ width: "40px" }}>Price</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {productData.VariantSkuDiamondLinks && productData.VariantSkuDiamondLinks.map((item, index) =>
                              (

                                <TableRow key={index}>
                                  <TableCell>{item.ProductVariantDiamond.stockId}</TableCell>
                                  <TableCell style={{ padding: "2px" }}>{item.ProductVariantDiamond.shape}</TableCell>
                                  <TableCell style={{ paddingLeft: "15px" }}>{item.ProductVariantDiamond.carat}</TableCell>
                                  <TableCell>{item.ProductVariantDiamond.color}</TableCell>
                                  <TableCell>{item.ProductVariantDiamond.clarity}</TableCell>

                                  <TableCell>{item.noOfDiamond}</TableCell>
                                  <TableCell style={{ textAlign: "right" }}>${item.ProductVariantDiamond.price}</TableCell>
                                </TableRow>
                              ))}
                              <TableRow>
                                <TableCell>
                                  <strong>Total:-</strong>
                                </TableCell>
                                <TableCell>
                                  <strong>{productData?.VariantSkuDiamondLinks?.length}</strong>
                                </TableCell>

                                <TableCell style={{ textAlign: "right" }}>
                                  <strong style={{ textAlign: "right" }}>{totalDiamondCarat}</strong>
                                </TableCell>
                                <TableCell>
                                </TableCell>
                                <TableCell>
                                </TableCell>
                                <TableCell>
                                </TableCell>

                                <TableCell style={{ textAlign: "right" }}>
                                  <div style={{ width: "max-content", fontWeight: "bold" }}>${totalDiamondPrice}</div>
                                </TableCell>


                              </TableRow>
                            </TableBody>
                          </Table>
                        ) : (
                          <p>Diamond Data is Not Available</p>
                        )}

                      </TableContainer>
                    </CardContent>
                  </Card>
                  <Card sx={{ marginTop: 2, marginRight: 2, width: "50%" }}>
                    <CardHeader title="Gemstone" style={{ paddingBottom: "0px" }} />
                    <CardContent>
                      {productData.VariantSkuGemstoneLinks && productData.VariantSkuGemstoneLinks.length > 0 ? (
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow>

                                <TableCell style={{ width: "70px" }}>Stock No</TableCell>
                                <TableCell style={{ width: "60px" }}>Shape</TableCell>
                                <TableCell >Carat</TableCell>
                                <TableCell>Color</TableCell>
                                <TableCell>Clarity</TableCell>
                                <TableCell>Origin</TableCell>
                                <TableCell>Qty</TableCell>
                                <TableCell style={{ width: "49px" }}>Price</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {productData?.VariantSkuGemstoneLinks?.map((item, index) => (
                                <TableRow key={index}>

                                  <TableCell>{item.ProductVariantGemstone.stockId}</TableCell>
                                  <TableCell>{item.ProductVariantGemstone.shape}</TableCell>
                                  <TableCell style={{ paddingLeft: "15px" }}>{item.ProductVariantGemstone.carat}</TableCell>
                                  <TableCell>{item.ProductVariantGemstone.color}</TableCell>
                                  <TableCell>{item.ProductVariantGemstone.clarity}</TableCell>
                                  <TableCell>{item.ProductVariantGemstone.origin}</TableCell>
                                  <TableCell>{item.noOfGemstone}</TableCell>
                                  <TableCell>${item.ProductVariantGemstone.price}</TableCell>
                                </TableRow>
                              ))}
                              <TableRow>
                                <TableCell>
                                  <strong>Total:-</strong>
                                </TableCell>
                                <TableCell>
                                  <strong>{productData?.VariantSkuGemstoneLinks?.length}</strong>
                                </TableCell>

                                <TableCell>
                                  <strong style={{ paddingLeft: "7px" }}>{totalGemstoneCarat}</strong>
                                </TableCell>
                                <TableCell>
                                </TableCell>
                                <TableCell>
                                </TableCell>
                                <TableCell>
                                </TableCell>
                                <TableCell>
                                </TableCell>
                                <TableCell style={{ textAlign: "right" }}>
                                  <strong>${totalGemstonePrice}</strong>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      ) : (
                        <p>Gemstone Data is not Available</p>
                      )}
                    </CardContent>
                  </Card>


                </div>

              </div>
            </div>
          </div>
          <div className="left">
            <div>
              {productData.images && productData.images.length > 0 ? (

                productData.images && productData.images.map((item, index) => (
                  item.fileType === "image" ?
                    <img key={index} src={HELPER.getImageUrl(item.fileUrl)} alt={`Image ${index}`} className="product_img" />
                    :
                    
                    <video autoPlay loop muted className="video_url" controls>
                      <source src={HELPER.getImageUrl(item.fileUrl)} type="video/mp4"/>
                    </video>
                  // <img key={index} src={HELPER.getImageUrl(item.fileUrl)} alt={`Image ${index}`} className="product_img" />
                ))

              ) : (
                <h1 style={{ textAlign: "center" }}>No Image Found</h1>
              )}
            </div>
          </div>
        </div >
      </section >
    </>
  );
};

export default FindProductVariantMoreDetail;
