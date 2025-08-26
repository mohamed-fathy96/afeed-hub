import { apiGatewayService } from "../apiService/HttpService";
import { setEndPoint } from "../apiService/SetEndPoint";
import { endPoints } from "../apiService/EndPoints";

export class SliderService {
  // Get all sliders
  static getSliders(params: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.slider.getAll, ...extraParams),
      params,
    });
  }

  static getBySliderById(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.slider.getByID, ...extraParams),
    });
  }
  // Create Slider
  static createSlider(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.slider.create, ...extraParams),
      data,
    });
  }
  static updateSlider(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "PUT",
      url: setEndPoint(endPoints.slider.updateByID, ...extraParams),
      data,
    });
  }
  static uploadImage(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.slider.addImageByID, ...extraParams),
      data,
    });
  }
  // Remove Slider
  static removeSlider(...extraParams: any[]) {
    return apiGatewayService({
      method: "DELETE",
      url: setEndPoint(endPoints.slider.deleteByID, ...extraParams),
    });
  }
  //remove image
  static removeImage(...extraParams: any[]) {
    return apiGatewayService({
      method: "DELETE",
      url: setEndPoint(endPoints.slider.deleteImageByID, ...extraParams),
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
}
