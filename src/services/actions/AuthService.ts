import { apiGatewayService } from "../apiService/HttpService";
import { setEndPoint } from "../apiService/SetEndPoint";
import { endPoints } from "../apiService/EndPoints";

export class AuthService {
  // login user
  static getLoginUser(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.identity.getLoginUser, ...extraParams),
      data,
    });
  }

  // register new user for a company
  static registerUser(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.identity.registerUser, ...extraParams),
      data,
    });
  }

  // send email to user to reset password
  static forgetPassword(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.identity.forgetPassword, ...extraParams),
      data,
    });
  }
  // reset user password
  static resetPassword(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.identity.resetPassword, ...extraParams),
      data,
    });
  }
  // check if the token for reset password verify or not
  static verifyToken(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.identity.verifyToken, ...extraParams),
      data,
    });
  }

  // check if the token for reset password verify or not
  static sendEmailToVerify(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.identity.sendEmailToVerify, ...extraParams),
    });
  }
}
