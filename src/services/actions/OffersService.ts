import { apiGatewayService } from "../apiService/HttpService";
import { setEndPoint } from "../apiService/SetEndPoint";
import { endPoints } from "../apiService/EndPoints";

export class OffersService {
  // get all offers uploads
  static getOffersUploads(params: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.bulk.offers.getAll, ...extraParams),
      params,
    });
  }

  // offers upload by id
  static bulkUploadOffers(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.bulk.offers.create, ...extraParams),
      data,
    });
  }
}
