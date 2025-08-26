import { endPoints } from "../apiService/EndPoints";
import { apiGatewayService } from "../apiService/HttpService";
import { setEndPoint } from "../apiService/SetEndPoint";

class PermissionsService {
  // static getPagesList(params: any, ...extraParams: any[]) {
  //   return apiGatewayService({
  //     method: "GET",
  //     url: setEndPoint(endPoints.permissions.getPagesList, ...extraParams),
  //     params,
  //   });
  // }
  static getAllPermissions(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.permissions.getAllPermissions, ...extraParams),
    });
  }

  static addNewPermission(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.permissions.addNewPermission, ...extraParams),
      data,
    });
  }

  static getGroupsList(params: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.permissions.getGroupsList, ...extraParams),
      params,
    });
  }

  static addNewGroup(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.permissions.getGroupsList, ...extraParams),
      data,
    });
  }

  static getGroupNameById(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.permissions.getGroupNameById, ...extraParams),
    });
  }

  static getGroupDetails(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(
        endPoints.permissions.getGroupDetailsById,
        ...extraParams
      ),
    });
  }

  static assignActionsToGroup(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(
        endPoints.permissions.assignActionsToGroup,
        ...extraParams
      ),
      data,
    });
  }

  static updateGroup(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "PUT",
      url: setEndPoint(endPoints.permissions.getGroupNameById, ...extraParams),
      data,
    });
  }

  static getUserPermissions(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(
        endPoints.permissions.getCurrentUserPermissions,
        ...extraParams
      ),
    });
  }

  static deletePageById(...extraParams: any[]) {
    return apiGatewayService({
      method: "DELETE",
      url: setEndPoint(endPoints.permissions.removePermission, ...extraParams),
    });
  }

  static deleteGroupById(...extraParams: any[]) {
    return apiGatewayService({
      method: "DELETE",
      url: setEndPoint(endPoints.permissions.getGroupNameById, ...extraParams),
    });
  }
}

export default PermissionsService;
