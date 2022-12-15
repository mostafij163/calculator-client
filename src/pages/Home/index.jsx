import { useState } from "react";
import { Paper, Typography, Pagination, TextField } from "@mui/material";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Result from "../../components/Result";
import ResultContainer from "../../components/ResultContainer";

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

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <ResultContainer variant="outlined" sx={{}}>
        <Typography variant="h4">Total results: 10</Typography>
        <SortableContext items={results} strategy={verticalListSortingStrategy}>
          {results.map((result) => (
            <Result result={result} key={result.id} />
          ))}
        </SortableContext>
        <Pagination
          count={10}
          color="primary"
          sx={{ width: "fit-content", marginLeft: "auto" }}
        />

        <Typography variant="h5">Input your text file</Typography>
        <TextField label="Title" placeholder="Input your calculation title" />
      </ResultContainer>
    </DndContext>
  );
};

export default Home;
