import { apiGatewayService } from "@app/services/apiService/HttpService";
import { setEndPoint } from "@app/services/apiService/SetEndPoint";
import { endPoints } from "@app/services/apiService/EndPoints";

export class UserService {
  // Get all Users
  static getUsers(params: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.user.getAll, ...extraParams),
      params,
    });
  }
  // Get User by ID
  static getUserById(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.user.getByID, ...extraParams),
    });
  }
  // Get User Permissions
  static getUserRoles(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.user.getAssignedRoleByID, ...extraParams),
    });
  }
  // Assign Role by ID
  static assignGroupToStore(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.user.assignGroupToStore, ...extraParams),
      data,
    });
  }
  // remove Role by ID
  static removeRole(...extraParams: any[]) {
    return apiGatewayService({
      method: "DELETE",
      url: setEndPoint(endPoints.user.removeRole, ...extraParams),
    });
  }
  // Get User Transactions
  static getUserTransactions(params: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.user.getUserTransactions, ...extraParams),
      params,
    });
  }
  // Get User Balance
  static getUserBalance(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.user.getUserBalance, ...extraParams),
    });
  }
  // assign user to city
  static assignCityRoleToUser(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.user.assignCityToUser, ...extraParams),
      data,
    });
  }
  // remove assigned city
  static removeAssignedCity(...extraParams: any[]) {
    return apiGatewayService({
      method: "DELETE",
      url: setEndPoint(endPoints.user.removeAssignedCity, ...extraParams),
    });
  }
  // Deduct user balance
  static deductUserBalance(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.user.deductUserBalance, ...extraParams),
      data,
    });
  }
  // Add user balance
  static addUserBalance(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.user.addUserBalance, ...extraParams),
      data,
    });
  }
  // Block/Unblock user
  static blockUser(blocked: boolean, ...extraParams: any[]) {
    return apiGatewayService({
      method: "PUT",
      url: setEndPoint(endPoints.user.blockUser, ...extraParams),
      params: { blocked },
    });
  }
  // Reset password
  static resetPassword(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "PUT",
      url: setEndPoint(endPoints.user.resetPassword, ...extraParams),
      data,
    });
  }
  // Change password
  static changePassword(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "PUT",
      url: setEndPoint(endPoints.user.changePassword, ...extraParams),
      data,
    });
  }
}
