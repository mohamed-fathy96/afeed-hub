import { apiGatewayService } from "../apiService/HttpService";
import { setEndPoint } from "../apiService/SetEndPoint";
import { endPoints } from "../apiService/EndPoints";

export class DropboxService {
  //test api
  static getDropboxFile(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.dropbox.processFolder, ...extraParams),
      headers: {
        "Content-Type": "application/json",
      },
      data,
    });
  }
  // get dropbox temp images
  static getDropboxTempImage(params: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.dropbox.getImages, ...extraParams),
      params,
    });
  }
  // export folder
  static selectFiles(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.dropbox.selectFiles, ...extraParams),
      data,
    });
  }
}
