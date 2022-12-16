import { useState } from "react";
import { Button, Typography, Pagination, TextField } from "@mui/material";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Result from "../../components/Result";
import ResultContainer from "../../components/ResultContainer";
import FileUpload from "../../components/FileUpload";

const Home = () => {
  const [results, setResults] = useState([
    {
      total: 25,
      title: "Calculation 1",
      id: 1,
      index: 0,
    },
    {
      total: 26,
      title: "Calculation 2",
      id: 2,
      index: 1,
    },
    {
      total: 30,
      title: "Calculation 3",
      id: 3,
      index: 2,
    },
  ]);
  const [showFile, setShowFile] = useState(false);
  const [file, setFile] = useState("");

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setResults((results) => {
        const activeIndex = results.findIndex(
          (result) => result.id === active.id
        );
        const overIndex = results.findIndex((result) => result.id === over.id);
        const reorderedArray = arrayMove(results, activeIndex, overIndex);

        const newActiveIndex = reorderedArray.findIndex(
          (result) => result.id === active.id
        );
        const newOverIndex = reorderedArray.findIndex(
          (result) => result.id === over.id
        );

        reorderedArray[newActiveIndex].index = newActiveIndex;
        reorderedArray[newOverIndex].index = newOverIndex;

        return reorderedArray;
      });
    }
  };

  const onFileUpload = (event) => {
    if (event.target.files !== null && event.target?.files?.length > 0) {
      setShowFile(true);
      setFile(URL.createObjectURL(event.target.files[0]));
    }
  };

  const onFileDrop = (event) => {
    setShowFile(true);
    setFile(URL.createObjectURL(event.dataTransfer.files[0]));
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <ResultContainer variant="outlined" sx={{}}>
        <section style={{ marginBottom: "4rem" }}>
          <Typography variant="h4">Total results: 10</Typography>
          <SortableContext
            items={results}
            strategy={verticalListSortingStrategy}
          >
            {results.map((result) => (
              <Result result={result} key={result.id} />
            ))}
          </SortableContext>
          <Pagination
            count={10}
            color="primary"
            sx={{ width: "fit-content", marginLeft: "auto" }}
          />
        </section>

        <Typography variant="h5">Input your text file</Typography>
        <TextField
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
        >
          Calculate
        </Button>
      </ResultContainer>
    </DndContext>
  );
};

export default Home;
