import IState from './../interfaces/IState';
import { auth } from '../firebase';

export const authActions = {
  setAuth(auth: any) {
    return (state: IState): IState => {
      return {
        ...state,
        auth: {
          ...state.auth,
          ...auth,
        },
      };
    };
  },
  async logoff() {
    await auth.signOut();
    return (state: IState): IState => {
      return {
        ...state,
        auth: {
          email: '',
          userId: '',
          isAuthenticated: false,
          failedAutoLogin: false,
        },
      };
    };
  },
};
