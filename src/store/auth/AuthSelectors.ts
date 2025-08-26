export const getDecodedToken = ({ state }: { state: any }) =>
  state.auth.decodedToken;
export const getIsLoginLoading = ({ state }: { state: any }) =>
  state.auth.isLoading;
export const getUserPermissions = ({ state }: { state: any }) =>
  state.auth.userPermissions;
