import { apiGatewayService } from "../apiService/HttpService";
import { setEndPoint } from "../apiService/SetEndPoint";
import { endPoints } from "../apiService/EndPoints";

export class InvnetoryService {
  // get all inventory uploads
  static getInvnentoryUploads(params: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.bulk.inventory.getAll, ...extraParams),
      params,
    });
  }

  // inventory upload by id
  static bulkUploadInventory(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.bulk.inventory.create, ...extraParams),
      data,
    });
  }
  static getInvnetoryList(params: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.inventory.getAll, ...extraParams),
      params,
    });
  }
  // Get payment transactions
  static getInventoryTransactions(params: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(
        endPoints.inventory.inventoryTransactions,
        ...extraParams
      ),
      params,
    });
  }
  // export inventory
  static exportInventory(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.inventory.exportInventory, ...extraParams),
    });
  }
}
