import { apiGatewayService } from "../apiService/HttpService";
import { setEndPoint } from "../apiService/SetEndPoint";
import { endPoints } from "../apiService/EndPoints";

export class StoreService {
  // Get all store
  static getStores(params: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.store.getAll, ...extraParams),
      params,
    });
  }

  static getByStoreById(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.store.getByID, ...extraParams),
    });
  }
  // Create Slider
  static createStore(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.store.create, ...extraParams),
      data,
    });
  }
  static updateStore(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "PUT",
      url: setEndPoint(endPoints.store.updateByID, ...extraParams),
      data,
    });
  }
  static uploadImage(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.store.addImageByID, ...extraParams),
      data,
    });
  }
  // Remove Slider
  static removeSlider(...extraParams: any[]) {
    return apiGatewayService({
      method: "DELETE",
      url: setEndPoint(endPoints.store.deleteByID, ...extraParams),
    });
  }
  //remove image
  static removeImage(...extraParams: any[]) {
    return apiGatewayService({
      method: "DELETE",
      url: setEndPoint(endPoints.store.deleteImageByID, ...extraParams),
    });
  }
}