import React from "react";
import { Box, Button } from "@mui/material";
import ThemeDialog from "../../../../components/UI/Dialog/ThemeDialog";
import Textarea from "../../../../components/UI/Textarea";

const FindGemstoneModal = ({ open, togglePopup, gemStoneData }) => {
  const gemstoneInfo = [
    { label: "Title : ", key: "title" },
    { label: "Gemstone Type : ", key: "gemstoneType" },
    { label: "Shape Name : ", key: "shapeName" },
    { label: "Carat : ", key: "carat" },
    { label: "Color : ", key: "color" },
    { label: "Clarity : ", key: "clarity" },
    { label: "Origin : ", key: "origin" },
    { label: "Price : ", key: "price" },
  ];

  return (
    <ThemeDialog
      title={`Gem Stone Details : ${
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
                      alignItems: "center",
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
                        {gemStoneData[info.key] || ""}
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

export default FindGemstoneModal;
