import IState from './../interfaces/IState';

export const authActions = {
  setAuth(auth: any) {
    return (state: IState) => {
      return {
        ...state,
        auth: {
          ...state.auth,
          ...auth,
        },
      };
    };
  },
};
