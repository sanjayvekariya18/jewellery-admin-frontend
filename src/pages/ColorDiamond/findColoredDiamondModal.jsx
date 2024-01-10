import React from "react";
import { Box, Button } from "@mui/material";
import ThemeDialog from "../../components/UI/Dialog/ThemeDialog";
import { HELPER } from "../../services";
// import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";

const FindColoredModal = ({ open, togglePopup, gemStoneData }) => {
  const gemstoneInfo = [
    // { label: "Title : ", key: gemStoneData ? gemStoneData.title : "" },
    { label: "Gemstone Type : ", key: gemStoneData ? gemStoneData.gemstoneType?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') : "" },
    { label: "Shape Name : ", key: gemStoneData ? gemStoneData.shapeName : "" },
    { label: "Carat : ", key: gemStoneData ? gemStoneData.carat : "" },
    { label: "Color : ", key: gemStoneData ? gemStoneData.color.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') : "" },
    { label: "Color Name : ", key: gemStoneData ? gemStoneData.colorName : "" },
    { label: "Clarity : ", key: gemStoneData ? gemStoneData.clarity : "" },
    { label: "Origin : ", key: gemStoneData ? gemStoneData.origin : "" },
    { label: "Intensity : ", key: gemStoneData ? gemStoneData.intensity.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ') : "" },
    { label: "M-Length : ", key: gemStoneData ? gemStoneData.mLength : "" },
    { label: "M-Width : ", key: gemStoneData ? gemStoneData.mWidth : "" },
    { label: "M-Depth : ", key: gemStoneData ? gemStoneData.mDepth : "" },
    { label: "Price : ", key: gemStoneData ? gemStoneData.price : "" },
  ];

  return (
    <ThemeDialog
      title={`Colored Diamond Stock Id : ${gemStoneData !== null && gemStoneData.stockId
        }`}
      isOpen={open}
      maxWidth="lg"
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
              <div style={{ display: "flex" }}>
                <div className="left_product">
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
                      gridTemplateColumns: "auto auto",
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
                </div>
                <div className="right_product">

                  {gemStoneData.images && gemStoneData.images.length > 0 ? (
                    gemStoneData.images && gemStoneData.images.map((item, index) => (
                      <img key={index} src={HELPER.getImageUrl(item.fileUrl)} alt={`Image ${index}`} className="all_product_img" />
                    ))

                  ) : (
                    <h1 style={{ textAlign: "center" }}>No Image Found</h1>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </Box>
    </ThemeDialog>
  );
};

export default FindColoredModal;
