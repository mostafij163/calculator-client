import { Button, Paper, Typography, Grid } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const paperStyle = {
  margin: "1rem 0",
  boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
  padding: ".875rem",
  borderRadius: "12px",
  cursor: "grab",
};

const btnStyle = {
  boxShadow: "rgba(0, 0, 0, 0.04) 0px 3px 5px",
  borderRadius: "12px",
  textTransform: "capitalize",
};

const Result = ({ result }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: result?.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Paper
      elevation={1}
      sx={{ ...paperStyle }}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid item xs={7} md={9}>
          <Typography variant="subtitle">
            ={result?.total} {result?.title}
          </Typography>
        </Grid>
        <Grid item xs={5} md={3}>
          <Button sx={{ ...btnStyle }} variant="contained">
            See Input
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Result;
