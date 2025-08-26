import { endPoints } from "../apiService/EndPoints";
import { apiGatewayService } from "../apiService/HttpService";
import { setEndPoint } from "../apiService/SetEndPoint";

export class GlobalService {
  static getAllStores(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.global.getStoresDDL, ...extraParams),
    });
  }
  static getAllGroups(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.global.getGroupsDDL, ...extraParams),
    });
  }
  static getAllCitiesGroups(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.global.getCityGroupsDDL, ...extraParams),
    });
  }
  static getAllCities(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.global.getCityDDL, ...extraParams),
    });
  }
  static getAllCategories(params: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.global.getCategoriesDDL, ...extraParams),
      params,
    });
  }
  static getAllSupplier(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.global.getSupplierDDL, ...extraParams),
    });
  }
  static getAllBrands() {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.global.getBrandsDDL),
    });
  }
  static getAllFlatCategories() {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.global.getFlatCategoriesDDL),
    });
  }
}

export default GlobalService;
