import React, { useState } from "react";
import { IconButton, Icon } from "@mui/material";
import { useDropzone } from "react-dropzone";

const FileDrop = ({ onFileSelected, accept, icon, label }) => {
  const [selectedFileName, setSelectedFileName] = useState("");

  const onDrop = (acceptedFiles) => {
    const selectedFile = acceptedFiles[0];
    setSelectedFileName(selectedFile.name);
    onFileSelected(selectedFile);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
  });

  return (
    <div
      className={`text-input-top dropzone ${isDragActive ? "active" : ""}`}
      {...getRootProps()}
    >
      <input {...getInputProps()} />
      {selectedFileName ? (
        <>
          <p style={{ fontSize: "18px", marginBottom: "5px" }}>
            Selected file: {selectedFileName}
          </p>
          <IconButton style={{ padding: 0 }}>
            <Icon style={{ fontSize: "50px" }}>{icon}</Icon>
          </IconButton>
        </>
      ) : (
        <>
          <p style={{ fontSize: "18px", marginBottom: "5px" }}>{label}</p>
          <IconButton style={{ padding: 0 }}>
            <Icon style={{ fontSize: "50px" }}>{icon}</Icon>
          </IconButton>
        </>
      )}
    </div>
  );
};

export default FileDrop;
