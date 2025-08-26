import { FormatString } from "./FormatString";

export const setEndPoint = (endPoint: string, ...extraParamters: any) => {
  if (extraParamters.length > 0) {
    const newEndPoint = FormatString(endPoint, ...extraParamters);
    return newEndPoint;
  } else {
    return endPoint;
  }
};
