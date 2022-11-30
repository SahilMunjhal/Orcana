import React, { createContext, useReducer, useEffect } from 'react';
import { roomReducer } from './RoomReducer';

type ContextProps = {
  room: any;
  roomDispatch: any;
};

export const RoomContext = createContext<Partial<ContextProps>>({});

const RoomContextProvider = (props: any) => {
  const { children } = props;
  const [room, roomDispatch] = useReducer(roomReducer, [], () => {
    const savedData = null; //TODO: check if there is a method to save data
    return savedData ? JSON.parse(savedData) : {};
  });

  useEffect(() => {}, [room]);

  return <RoomContext.Provider value={{ room, roomDispatch }}>{children}</RoomContext.Provider>;
};

export default RoomContextProvider;
