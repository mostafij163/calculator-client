import { useContext, useEffect, useReducer, useState } from "react";
import { Button, Typography, TextField } from "@mui/material";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

import ResultContainer from "../../components/ResultContainer";
import FileUpload from "../../components/FileUpload";
import { calculatorApi } from "../../api";
import { socketContext } from "./../../context/socket";

import "react-toastify/dist/ReactToastify.css";
import Calculation from "../../components/Calculations";

const sortByIndex = (results) => {
  return results.sort((firstResult, secondResult) => {
    if (firstResult?.index > secondResult?.index) return 1;
    else if (firstResult?.index < secondResult?.index) return -1;
    else return 0;
  });
};

const resultReducer = (_state, results) => {
  return sortByIndex(results);
};

const Home = () => {
  const { id, socket } = useContext(socketContext);
  const [perPage] = useState(5);
  const [page, setPage] = useState(1);
  const [title, setTitle] = useState("");
  const [results, dispatchResults] = useReducer(resultReducer, []);
  const [paginatedResult, setPaginatedResult] = useState([]);
  const [showFile, setShowFile] = useState(false);
  const [file, setFile] = useState({ data: "", preview: "" });

  useEffect(() => {
    axios
      .get(`${calculatorApi}/calculation`)
      .then((res) => {
        dispatchResults(res.data.data);
      })
      .catch((error) => console.log(error));
  }, []);

  useEffect(() => {
    const begin = (page - 1) * perPage;
    const end = begin + perPage;

    setPaginatedResult(results.slice(begin, end));
  }, [page, results, perPage]);

  socket?.on("result", (data) => {
    const resultIndex = results.findIndex((result) => result.id == data.id);

    let newResults = [];
    if (resultIndex == -1) {
      newResults = [...results, data];
    } else {
      newResults = [...results];
    }

    dispatchResults(newResults);
  });

  const onFileUpload = (event) => {
    if (event.target.files !== null && event.target?.files?.length > 0) {
      setShowFile(true);
      setFile({
        preview: URL.createObjectURL(event.target.files[0]),
        data: event.target.files[0],
      });
    }
  };

  const onFileDrop = (event) => {
    setShowFile(true);
    setFile({
      preview: URL.createObjectURL(event.dataTransfer.files[0]),
      data: event.dataTransfer.files[0],
    });
  };

  const calculate = async () => {
    try {
      const formData = new FormData();
      formData.append("calculation", file.data);
      formData.append("title", title);
      const { data } = await axios.post(
        `${calculatorApi}/calculation`,
        formData,
        {
          headers: {
            Authorization: id,
          },
        }
      );

      setTitle("");
      setShowFile(false);
      URL.revokeObjectURL(file.data);
      toast(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ResultContainer variant="outlined" sx={{}}>
      <ToastContainer autoClose={8000} />
      <Calculation
        results={results}
        paginatedResult={paginatedResult}
        dispatchResults={dispatchResults}
        setPage={setPage}
        page={page}
        perPage={perPage}
      />
      <Typography variant="h5">Input your text file</Typography>
      <TextField
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        size="small"
        label="Title"
        placeholder="Input your calculation title"
        sx={{
          margin: ".875rem 0",
          "& .MuiInputBase-root": {
            borderRadius: "12px",
          },
        }}
      />
      <FileUpload
        accept="text/plain"
        onChange={onFileUpload}
        onDrop={onFileDrop}
        showFile={showFile}
      />
      <Button
        variant="contained"
        sx={{
          width: "100%",
          textTransform: "capitalize",
          boxShadow: "rgba(0, 0, 0, 0.04) 0px 3px 5px",
          marginTop: ".875rem",
        }}
        onClick={calculate}
      >
        Calculate
      </Button>
    </ResultContainer>
  );
};

export default Home;
