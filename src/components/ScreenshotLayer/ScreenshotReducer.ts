export const screenshotReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE_SCREENSHOT':
      return {
        ...state,
        src: action.screenshot.src,
        id: action.screenshot.id,
      };
    case 'UPDATE_DIEMENSIONS':
      return {
        ...state,
        width: action.screenshot.width,
        height: action.screenshot.height,
      };
    case 'IS_DRAWING':
      return {
        ...state,
        isDrawing: true,
      };
    case 'IS_NOT_DRAWING':
      return {
        ...state,
        isDrawing: false,
      };
    default:
      return state;
  }
};
