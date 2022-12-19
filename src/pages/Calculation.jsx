import { useState, useEffect, useContext, useReducer } from "react";
import axios from "axios";
import Calculation from "../components/Calculations";
import { socketContext } from "../context/socket";
import { calculatorApi } from "../api";
import ResultContainer from "../components/ResultContainer";

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

const CalculationPage = () => {
  const { socket } = useContext(socketContext);
  const [perPage] = useState(10);
  const [page, setPage] = useState(1);
  const [results, dispatchResults] = useReducer(resultReducer, []);
  const [paginatedResult, setPaginatedResult] = useState([]);

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

  return (
    <ResultContainer variant="outlined">
      <Calculation
        results={results}
        paginatedResult={paginatedResult}
        dispatchResults={dispatchResults}
        setPage={setPage}
        page={page}
        perPage={perPage}
      />
    </ResultContainer>
  );
};

export default CalculationPage;
