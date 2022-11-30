export const roomReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'UPDATE_DIEMENSIONS':
      return {
        ...state,
        width: action.room.width,
        height: action.room.height,
      };
    default:
      return state;
  }
};
