import { apiGatewayService } from "../apiService/HttpService";
import { setEndPoint } from "../apiService/SetEndPoint";
import { endPoints } from "../apiService/EndPoints";

export class OrderService {
  //test api
  static getOrders(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.order.getAll, ...extraParams),
      data,
    });
  }
  // Get not confirmed orders
  static getNotConfirmedOrders(params: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.order.getNotConfirmed, ...extraParams),
      params,
    });
  }

  static getBreakDownStatus(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.order.statusBreakdown, ...extraParams),
    });
  }
  // get distance by id
  static getDistanceById(...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.order.getDistanceById, ...extraParams),
    });
  }
  // refund order
  static refundOrder(data: any, ...extraParams: any[]): Promise<any> {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.order.refund, ...extraParams),
      data,
    });
  }
  // reissue order
  static reissueOrder(...extraParams: any[]): Promise<any> {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.order.reissue, ...extraParams),
    });
  }
  // update Auth Code
  static addAuthCode(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.order.addAuthCode, ...extraParams),
      data,
    });
  }
  // update payment method (legacy)
  static updatePaymentMethod(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.order.selectPaymentMethod, ...extraParams),
      data,
    });
  }

  // update payment method (new endpoint)
  static updateOrderPaymentMethod(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "PUT",
      url: setEndPoint(endPoints.order.updatePaymentMethod, ...extraParams),
      data,
    });
  }
  //get by id
  static getOrderById(params: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.order.getByID, ...extraParams),
      params,
    });
  }
  // Get order details
  static getOrderItems(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.order.getOrderItems, ...extraParams),
    });
  }
  // Update order
  static updateOrderProduct(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "PUT",
      url: setEndPoint(endPoints.order.updateOrderProduct, ...extraParams),
      data,
    });
  }
  // Add product to order
  static addProductToOrder(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.order.addProductToOrder, ...extraParams),
      data,
    });
  }
  static removeProductFromOrder(...extraParams: any[]) {
    return apiGatewayService({
      method: "PUT",
      url: setEndPoint(endPoints.order.updateOrderProduct, ...extraParams),
      data: {
        quantity: 0,
      },
    });
  }
  //assign provider
  static assignProvider(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.order.assignProvider, ...extraParams),
      data,
    });
  }
  // update payment method
  static updateStatus(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.order.updateStatus, ...extraParams),
      data,
    });
  }
  // Get track order
  static getTrackOrder(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.order.trackOrder, ...extraParams),
    });
  }
  // Get track order
  static getOrderIpInfo(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.order.getOrderIpInfo, ...extraParams),
    });
  }
  // Manual Verify order
  static manualVerifyOrder(...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.order.manualVerify, ...extraParams),
    });
  }
  static resendOrder(...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.order.resend, ...extraParams),
    });
  }
  static getOrderTransactions(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.order.orderTransactions, ...extraParams),
    });
  }
  static getPaymentLogs(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.order.getPaymentLogs, ...extraParams),
    });
  }
  static getInvoice(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      responseType: "blob",
      url: setEndPoint(endPoints.order.invoice, ...extraParams),
    });
  }
  static createOrder(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.order.create.createOrder, ...extraParams),
      data,
    });
  }

  // save order address
  static saveOrderAddress(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.order.create.saveOrderAddress, ...extraParams),
      data,
    });
  }

  // generate payment link
  static generatePaymentLink(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.order.generatePaymentLink, ...extraParams),
    });
  }

  // apply coupon to order
  static applyCoupon(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.order.applyCoupon, ...extraParams),
      data,
    });
  }
}
