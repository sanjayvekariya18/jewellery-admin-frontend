import React from "react";
import { Box, Button } from "@mui/material";
import ThemeDialog from "../../components/UI/Dialog/ThemeDialog";
import { appConfig } from "../../config";
// import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
// import Textarea from "../../../../components/UI/Textarea";

const FindColoredModal = ({ open, togglePopup, gemStoneData }) => {
  // Function to retrieve values from a dictionary
  const getDictionaryValue = (dictionary, key) => {
    return dictionary && dictionary[key] ? dictionary[key] : "";
  };

  const gemstoneInfo = [
    // { label: "Title : ", key: gemStoneData ? gemStoneData.title : "" },
    {
      label: "Gemstone Type : ",
      key: gemStoneData ? gemStoneData.gemstoneType : "",
    },
    { label: "Shape Name : ", key: gemStoneData ? gemStoneData.shapeName : "" },
    { label: "Carat : ", key: gemStoneData ? gemStoneData.carat : "" },
    { label: "Color : ", key: gemStoneData ? gemStoneData.color : "" },
    { label: "Color Name : ", key: gemStoneData ? gemStoneData.colorName : "" },
    {
      label: "Clarity: ",
      key: gemStoneData
        ? getDictionaryValue(appConfig.D_Clarity, gemStoneData.clarity)
        : "",
    },

    { label: "Origin : ", key: gemStoneData ? gemStoneData.origin : "" },
    { label: "Intensity : ", key: gemStoneData ? gemStoneData.intensity : "" },
    { label: "M-Length : ", key: gemStoneData ? gemStoneData.mLength : "" },
    { label: "M-Width : ", key: gemStoneData ? gemStoneData.mWidth : "" },
    { label: "M-Depth : ", key: gemStoneData ? gemStoneData.mDepth : "" },
    { label: "Price : ", key: gemStoneData ? gemStoneData.price : "" },
  ];

  return (
    <ThemeDialog
      title={`Colored Diamond Details : ${
        gemStoneData !== null && gemStoneData.stockId
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
      <Box>
        <div style={{ marginTop: "0px", marginLeft: "5px" }}>
          {gemStoneData && (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  justifyContent: "flex-start",
                  border: "1px solid #3736363b",
                  marginBottom: "6px",
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
                    Title :
                  </h3>
                </div>
                <div>
                  <span
                    style={{
                      fontSize: "16px",
                      fontWeight: "400",
                    }}
                  >
                    {gemStoneData.title}
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto auto auto",
                  gap: "6px",
                }}
              >
                {gemstoneInfo.map((info, index) => (
                  <div
                    key={index}
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
                  {gemStoneData.description}
                </span>
              </div>
            </>
          )}
        </div>
      </Box>
    </ThemeDialog>
  );
};

export default FindColoredModal;
