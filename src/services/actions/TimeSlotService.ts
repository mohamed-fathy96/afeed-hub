import { apiGatewayService } from "../apiService/HttpService";
import { setEndPoint } from "../apiService/SetEndPoint";
import { endPoints } from "../apiService/EndPoints";

class TimeSlotService {
  static getManualOrderTimeSlot = async (
    params: any,
    ...extraParams: any[]
  ) => {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(
        endPoints.order.create.getManualOrderTimeSlot,
        ...extraParams
      ),
      params,
    });
  };
  static getTimeSlotList(params: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.timeSlot.getTimeSlotList, ...extraParams),
      params,
    });
  }

  static getTimeSlotById(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.timeSlot.getTimeSlotDetails, ...extraParams),
    });
  }
  static getAvailableTimeSlotByDate(params: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(
        endPoints.timeSlot.getAvaialbleSlotByDate,
        ...extraParams
      ),
      params,
    });
  }

  static updateTimeSlot(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "PUT",
      url: setEndPoint(endPoints.timeSlot.updateTimeSlot, ...extraParams),
      data,
    });
  }

  static addNewTimeSlot(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.timeSlot.createTimeSlot, ...extraParams),
      data,
    });
  }
}

export default TimeSlotService;
