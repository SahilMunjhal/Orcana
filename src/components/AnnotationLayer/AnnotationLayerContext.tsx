import React, { createContext, useReducer, useEffect } from 'react';
import { annotationsReducer } from './AnnotationsReducer';

type ContextProps = {
  annotations: any;
  dispatch: any;
};

export const AnnotationContext = createContext<Partial<ContextProps>>({});

const AnnotationContextProvider = (props: any) => {
  const { children } = props;
  const [annotations, dispatch] = useReducer(annotationsReducer, [], () => {
    const savedData = null; //TODO: check if there is a method to save data
    return savedData ? JSON.parse(savedData) : [];
  });

  useEffect(() => {}, [annotations]);

  return <AnnotationContext.Provider value={{ annotations, dispatch }}>{children}</AnnotationContext.Provider>;
};

export default AnnotationContextProvider;
