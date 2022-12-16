import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";

const label = {
  cursor: "pointer",
  textAlign: "center",
  display: "flex",
  border: "1px dotted",
  borderRadius: "12px",
  padding: "4px",
  "&:hover p,&:hover svg,& img": {
    opacity: 1,
  },
  "& p, svg": {
    opacity: 0.4,
  },
  "&:hover img": {
    opacity: 0.3,
  },
};

const noMouseEvent = {
  pointerEvents: "none",
  display: "flex",
  justifyContent: "center",
};

const iconText = {
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  alignItems: "center",
  position: "absolute",
};

const hidden = {
  display: "none",
};

const onDragOver = {
  "& img": {
    opacity: 0.3,
  },
  "& p, svg": {
    opacity: 1,
  },
};

const FileUpload = ({
  accept,
  showFile = false,
  hoverLabel = "Click or drag to upload file",
  dropLabel = "Drop file here",
  width = "600px",
  height = "100px",
  backgroundColor = "#fff",
  onChange,
  onDrop,
}) => {
  const [file, setFile] = useState({ url: "" });
  const [labelText, setLabelText] = useState(hoverLabel);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const stopDefaults = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const inputLabelStyle = isDragOver ? { ...label, ...onDragOver } : label;

  const dragEvents = {
    onMouseEnter: () => {
      setIsMouseOver(true);
    },
    onMouseLeave: () => {
      setIsMouseOver(false);
    },
    onDragEnter: (e) => {
      stopDefaults(e);
      setIsDragOver(true);
      setLabelText(dropLabel);
    },
    onDragLeave: (e) => {
      stopDefaults(e);
      setIsDragOver(false);
      setLabelText(hoverLabel);
    },
    onDragOver: stopDefaults,
    onDrop: (e) => {
      stopDefaults(e);
      setLabelText(hoverLabel);
      setIsDragOver(false);
      if (e.dataTransfer.files[0] && e.dataTransfer.files[0].length) {
        setFile({
          url: URL.createObjectURL(e.dataTransfer.files[0]),
          name: e.target.files[0]?.name,
        });
      }
      onDrop(e);
    },
  };

  const handleChange = (event) => {
    if (event.target.files[0]) {
      setFile({
        url: URL.createObjectURL(event.target.files[0]),
        name: event.target.files[0]?.name,
      });
    }
    onChange(event);
  };

  return (
    <>
      <input
        onChange={handleChange}
        accept={accept}
        style={hidden}
        id="file-upload"
        type="file"
      />

      <label htmlFor="file-upload" {...dragEvents} style={inputLabelStyle}>
        <Box
          width="100%"
          height={height}
          bgcolor={backgroundColor}
          sx={noMouseEvent}
        >
          <>
            <Box height={height} width={width} sx={iconText}>
              <CloudUploadIcon fontSize="large" />
              <Typography>{labelText}</Typography>
            </Box>
          </>
        </Box>
      </label>

      {showFile && (
        <a href={file.url} target="_blank" download>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            sx={{
              width: "fit-content",
              borderRadius: "12px",
              margin: ".875rem 0",
              textTransform: "capitalize",
            }}
          >
            {file.name}
          </Button>
        </a>
      )}
    </>
  );
};

export default FileUpload;
