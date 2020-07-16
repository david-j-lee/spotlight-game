export default interface IAuth {
  email: string;
  userId: string;
  isAuthenticated: boolean;
  failedAutoLogin: boolean;
}
