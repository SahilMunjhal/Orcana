import _ from 'lodash';

export const annotationsReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'ADD_ANNOTATION':
      let newAnnotations = _.cloneDeep(state) || [];
      let newAnnotation = _.clone(action.annotation);
      newAnnotations.push(newAnnotation);
      return newAnnotations;
    case 'UPDATE_ANNOTATION':
      return state.map((annotation: any) => {
        if (annotation.id === action.annotation.id) {
          return {
            ...annotation,
            ...action.annotation,
          };
        } else {
          return annotation;
        }
      });
    case 'REMOVE_ANNOTATION':
      return state.filter((annotation: any) => annotation.id !== action.annotation.id);
    case 'RESTART_ANNOTATION':
      return [];
    default:
      return state;
  }
};
