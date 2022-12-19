import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SocketContextProvider from "./context/socket";
import CalculationPage from "./pages/Calculation";

function App() {
  return (
    <>
      <SocketContextProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calculation" element={<CalculationPage />} />
          </Routes>
        </Router>
      </SocketContextProvider>
    </>
  );
}

export default App;
