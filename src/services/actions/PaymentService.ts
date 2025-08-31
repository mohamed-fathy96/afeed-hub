import { apiGatewayService } from "../apiService/HttpService";
import { setEndPoint } from "../apiService/SetEndPoint";
import { endPoints } from "../apiService/EndPoints";

export class PaymentService {
  static getCreatorUserPayments(params: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(
        endPoints.payments.getCreatorUserPayments,
        ...extraParams
      ),
      params,
    });
  }

  static getPendingPayments(params: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.payments.getPendingPayments, ...extraParams),
      params,
    });
  }

  static getSubscriptionBilling(params: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(
        endPoints.payments.getSubscriptionBilling,
        ...extraParams
      ),
      params,
    });
  }
  static getSettlementLog(params: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.payments.settlementLog, ...extraParams),
      params,
    });
  }
  static updatePayouts(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.payments.updatePayouts, ...extraParams),
      data,
    });
  }
}
