import { apiGatewayService } from "../apiService/HttpService";
import { setEndPoint } from "../apiService/SetEndPoint";
import { endPoints } from "../apiService/EndPoints";

export class CouponService {
  //test api
  static getCoupons(params: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.coupons.getAll, ...extraParams),
      params,
    });
  }

  static getByCouponId(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.coupons.getByID, ...extraParams),
    });
  }
  // login user
  static createCoupon(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.coupons.create, ...extraParams),
      data,
    });
  }
  static updateCoupon(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "PUT",
      url: setEndPoint(endPoints.coupons.updateByID, ...extraParams),
      data,
    });
  }
}
