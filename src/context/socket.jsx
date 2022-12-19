import { createContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { calculatorApi } from "../api";

export const socketContext = createContext({});

const SocketContextProvider = (props) => {
  const isSecondRender = useRef(false);
  const [socket, setSocket] = useState();
  const [id, setId] = useState(uuidv4());

  useEffect(() => {
    if (isSecondRender.current) {
      const socket = io(calculatorApi);

      socket.on("connected", (data) => {
        console.log(data);

        socket.emit("register", {
          userId: id,
        });
      });
      setSocket(socket);
    }
    isSecondRender.current = true;
  }, [id]);

  return (
    <socketContext.Provider value={{ socket: socket, id: id, setId: setId }}>
      {props.children}
    </socketContext.Provider>
  );
};

export default SocketContextProvider;
