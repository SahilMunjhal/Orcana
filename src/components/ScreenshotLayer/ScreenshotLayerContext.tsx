import React, { createContext, useReducer, useEffect } from 'react';
import { screenshotReducer } from './ScreenshotReducer';

type ContextProps = {
  screenshot: any;
  screenshotDispatch: any;
};

export const ScreenshotContext = createContext<Partial<ContextProps>>({});

const ScreenshotContextProvider = (props: any) => {
  const { children } = props;
  const [screenshot, screenshotDispatch] = useReducer(screenshotReducer, [], () => {
    const savedData = null; //TODO: check if there is a method to save data
    return savedData ? JSON.parse(savedData) : {};
  });

  useEffect(() => {}, [screenshot]);

  return <ScreenshotContext.Provider value={{ screenshot, screenshotDispatch }}>{children}</ScreenshotContext.Provider>;
};

export default ScreenshotContextProvider;
