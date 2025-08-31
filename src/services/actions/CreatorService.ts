import { apiGatewayService } from "../apiService/HttpService";
import { setEndPoint } from "../apiService/SetEndPoint";
import { endPoints } from "../apiService/EndPoints";

export class CreatorService {
  static getCreators(params: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.creators.getAll, ...extraParams),
      params,
    });
  }
  static getCreatorById(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.creators.getById, ...extraParams),
    });
  }

  static getCreatorProducts(params: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.creators.getCreatorProduct, ...extraParams),
      params,
    });
  }
  static getCreatorCustomers(params: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.creators.getCreatorCustomers, ...extraParams),
      params,
    });
  }
  static impersonateCreator(...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.creators.impersonateCreator, ...extraParams),
    });
  }
}
