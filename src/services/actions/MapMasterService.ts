import { apiGatewayService } from "../apiService/HttpService";
import { setEndPoint } from "../apiService/SetEndPoint";
import { endPoints } from "../apiService/EndPoints";

export class MapMasterService {
  // Get stores with polygon
  static getStoresWithPolygon(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(
        endPoints.mapMaster.getStoresWithPolygon,
        ...extraParams
      ),
    });
  }
  static updateStoresWithPolygon(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "PUT",
      url: setEndPoint(
        endPoints.mapMaster.updateStoresWithPolygon,
        ...extraParams
      ),
      data,
    });
  }
}
