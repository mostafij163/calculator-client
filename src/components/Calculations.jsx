import { useContext, useEffect } from "react";
import { Typography, Pagination } from "@mui/material";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Result from "./Result";
import { socketContext } from "../context/socket";

const Calculation = ({
  results,
  paginatedResult,
  dispatchResults,
  setPage,
  page,
  perPage,
}) => {
  const { reordered, socket } = useContext(socketContext);
  const handleChange = (_event, value) => {
    setPage(value);
  };

  useEffect(() => {
    if (reordered) {
      const reroderedResults = results.map((result) => {
        if (reordered[result.id] !== undefined) {
          result.index = reordered[result.id];
        }
        return result;
      });

      dispatchResults(reroderedResults);
    }
  }, [reordered]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
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

      socket.emit("reorder", [
        {
          id: active.id,
          index: newActiveIndex,
        },
        {
          id: over.id,
          index: newOverIndex,
        },
      ]);

      dispatchResults(reorderedArray);
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <section style={{ marginBottom: "4rem" }}>
        <Typography variant="h4">Total results: {results?.length}</Typography>
        <SortableContext items={results} strategy={verticalListSortingStrategy}>
          {paginatedResult.map((result) => (
            <Result result={result} key={result.id} />
          ))}
        </SortableContext>
        <Pagination
          count={Math.ceil(results?.length / perPage)}
          page={page}
          onChange={handleChange}
          color="primary"
          sx={{ width: "fit-content", marginLeft: "auto" }}
        />
      </section>
    </DndContext>
  );
};

export default Calculation;
