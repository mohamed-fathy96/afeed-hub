import { apiGatewayService } from "../apiService/HttpService";
import { setEndPoint } from "../apiService/SetEndPoint";
import { endPoints } from "../apiService/EndPoints";

export class CategoryService {
  //test api
  static getCategories(params: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.category.getAll, ...extraParams),
      params,
    });
  }

  static getByCategoryId(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.category.getByID, ...extraParams),
    });
  }
  // login user
  static createCategory(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.category.create, ...extraParams),
      data,
    });
  }
  static updateCategory(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "PUT",
      url: setEndPoint(endPoints.category.updateByID, ...extraParams),
      data,
    });
  }
  static QuickUpdateCategory(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "PUT",
      url: setEndPoint(endPoints.category.QuickupdateByID, ...extraParams),
      data,
    });
  }
  static uploadImage(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.category.addImageByID, ...extraParams),
      data,
    });
  }
  // Remove category
  static removeCategory(...extraParams: any[]) {
    return apiGatewayService({
      method: "DELETE",
      url: setEndPoint(endPoints.category.deleteByID, ...extraParams),
    });
  }
  //remove image
  static removeImage(...extraParams: any[]) {
    return apiGatewayService({
      method: "DELETE",
      url: setEndPoint(endPoints.category.deleteImageByID, ...extraParams),
    });
  }
  // Get category list light API
  static getCategoryList(params: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.category.getCategoryLightList, ...extraParams),
      params,
    });
  }
  static reorderCategories(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "PUT",
      url: setEndPoint(endPoints.category.reorderCategories, ...extraParams),
      data,
    });
  }
  static getLightList(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.category.getLightList, ...extraParams),
    });
  }
  static getChildrenCategories(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.category.getChildrenCategories, ...extraParams),
    });
  }
}
