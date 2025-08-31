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
}
