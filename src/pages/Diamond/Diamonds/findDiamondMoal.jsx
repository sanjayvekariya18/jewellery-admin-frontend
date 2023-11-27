import React from "react";
import { Box, Button } from "@mui/material";
import ThemeDialog from "../../../components/UI/Dialog/ThemeDialog";
import { appConfig } from "../../../config";
import { HELPER } from "../../../services";

const FindDiamondModal = ({ open, togglePopup, gemDiamondData }) => {
  // Function to retrieve values from a dictionary
  const getDictionaryValue = (dictionary, key) => {
    return dictionary && dictionary[key] ? dictionary[key] : "";
  };

  const gemstoneInfo = [
    { label: "Shape: ", key: gemDiamondData ? gemDiamondData.shapeName : "" },
    { label: "Carat: ", key: gemDiamondData ? gemDiamondData.carat : "" },
    {
      label: "Cut: ",
      key: gemDiamondData
        ? getDictionaryValue(appConfig.D_Cut, gemDiamondData.cut)
        : "",
    },
    {
      label: "Color: ",
      key: gemDiamondData
        ? getDictionaryValue(appConfig.D_Color, gemDiamondData.color)
        : "",
    },
    {
      label: "Clarity: ",
      key: gemDiamondData
        ? getDictionaryValue(appConfig.D_Clarity, gemDiamondData.clarity)
        : "",
    },
    {
      label: "Polish: ",
      key: gemDiamondData
        ? getDictionaryValue(appConfig.D_Polish, gemDiamondData.polish)
        : "",
    },

    {
      label: "Symmetry: ",
      key: gemDiamondData
        ? getDictionaryValue(appConfig.D_Symmetry, gemDiamondData.symmetry)
        : "",
    },
    {
      label: "Origin: ",
      key: gemDiamondData ? gemDiamondData.origin || "" : "",
    },
    { label: "Lab: ", key: gemDiamondData ? gemDiamondData.labName || "" : "" },
    { label: "Price: ", key: gemDiamondData ? gemDiamondData.price || "" : "" },
    {
      label: "Fluorescence: ",
      key: gemDiamondData
        ? getDictionaryValue(
          appConfig.D_Fluorescence,
          gemDiamondData.fluorescence
        )
        : "",
    },
    { label: "M-Length : ", key: gemDiamondData ? gemDiamondData.mLength : "" },
    { label: "M-Width : ", key: gemDiamondData ? gemDiamondData.mWidth : "" },
    { label: "M-Depth : ", key: gemDiamondData ? gemDiamondData.mDepth : "" },
    { label: "Table : ", key: gemDiamondData ? gemDiamondData.table : "" },
    { label: "Depth : ", key: gemDiamondData ? gemDiamondData.depth : "" },
    {
      label: "Girdle: ",
      key: gemDiamondData
        ? getDictionaryValue(appConfig.D_Girdle, gemDiamondData.girdle)
        : "",
    },
    // { label: "Girdle : ", key: gemDiamondData ? gemDiamondData.girdle : "" },

    {
      label: "Culet: ",
      key: gemDiamondData
        ? getDictionaryValue(appConfig.D_Culet, gemDiamondData.culet)
        : "",
    },

    {
      label: "Certificate No: ",
      key: gemDiamondData ? gemDiamondData.certificateNo || "" : "",
    },
  ];

  return (
    <ThemeDialog
      title={`Diamond Stock Id: ${gemDiamondData?.stockId || ""}`}
      isOpen={open}
      onClose={togglePopup}
      maxWidth="lg"
      actionBtns={
        <Box>
          <Button variant="contained" color="secondary" onClick={togglePopup}>
            Close
          </Button>
        </Box>
      }
    >
      <Box>
        <div style={{ marginTop: "0px", marginLeft: "5px" }}>
          {gemDiamondData && (
            <div style={{
              display: "flex",
              gridTemplateColumns: "1fr 1fr",
              gap: "6px",
            }}>
              <div className="left_product">
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "6px",
                  }}
                // className="left_product"
                >

                  {gemstoneInfo.map((info) => (
                    <div
                      key={info.label}
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
                            maxWidth: "140px",
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
                          {info.key}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="right_product">

                {gemDiamondData.images && gemDiamondData.images.length > 0 ? (
                  gemDiamondData.images && gemDiamondData.images.map((item, index) => (
                    <img key={index} src={HELPER.getImageUrl(item.fileUrl)} alt={`Image ${index}`} className="all_product_img" />
                  ))

                ) : (
                  <h1 style={{ textAlign: "center" }}>No Image Found</h1>
                )}
              </div>
            </div>


          )}
        </div>
      </Box>
    </ThemeDialog>
  );
};

export default FindDiamondModal;
