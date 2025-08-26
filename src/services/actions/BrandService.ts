import { apiGatewayService } from "../apiService/HttpService";
import { setEndPoint } from "../apiService/SetEndPoint";
import { endPoints } from "../apiService/EndPoints";

export class BrandService {
  //test api
  static getBrands(params: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.brands.getAll, ...extraParams),
      params,
    });
  }

  static getByBrandId(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.brands.getByID, ...extraParams),
    });
  }
  // login user
  static createBrand(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.brands.create, ...extraParams),
      data,
    });
  }
  static updateBrand(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "PUT",
      url: setEndPoint(endPoints.brands.updateByID, ...extraParams),
      data,
    });
  }
  static uploadImage(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.brands.addImageByID, ...extraParams),
      data,
    });
  }
  // Remove category
  static removeProduct(...extraParams: any[]) {
    return apiGatewayService({
      method: "DELETE",
      url: setEndPoint(endPoints.brands.deleteByID, ...extraParams),
    });
  }
  //remove image
  static removeImage(...extraParams: any[]) {
    return apiGatewayService({
      method: "DELETE",
      url: setEndPoint(endPoints.brands.deleteImageByID, ...extraParams),
    });
  }
  // Get category list light API
  static getBrandsList(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.brands.getBrandsLightList, ...extraParams),
    });
  }
}
