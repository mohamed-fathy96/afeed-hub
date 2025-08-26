import { apiGatewayService } from "../apiService/HttpService";
import { setEndPoint } from "../apiService/SetEndPoint";
import { endPoints } from "../apiService/EndPoints";

export class ProductService {
  //test api
  static getProducts(params: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.product.getAll, ...extraParams),
      params,
    });
  }

  static getByProductId(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.product.getByID, ...extraParams),
    });
  }
  // login user
  static createProduct(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.product.create, ...extraParams),
      data,
    });
  }
  static updateProduct(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "PUT",
      url: setEndPoint(endPoints.product.updateByID, ...extraParams),
      data,
    });
  }
  static uploadImage(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.product.addImageByID, ...extraParams),
      data,
    });
  }
  // Remove category
  static removeProduct(...extraParams: any[]) {
    return apiGatewayService({
      method: "DELETE",
      url: setEndPoint(endPoints.product.deleteByID, ...extraParams),
    });
  }
  //remove image
  static removeImage(...extraParams: any[]) {
    return apiGatewayService({
      method: "DELETE",
      url: setEndPoint(endPoints.product.deleteImageByID, ...extraParams),
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
  // Get category list light API
  static getAssignedCategory(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(
        endPoints.product.getAssignedCategoryByID,
        ...extraParams
      ),
    });
  }
  // Get product availability
  static getProductAvailability(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(
        endPoints.product.getProductAvailability,
        ...extraParams
      ),
    });
  }
  // Assign category to product
  static assignCategoryToProduct(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(
        endPoints.product.assignCategoryToProduct,
        ...extraParams
      ),
      data,
    });
  }
  // Remove assigned category
  static removeAssignedCategory(...extraParams: any[]) {
    return apiGatewayService({
      method: "DELETE",
      url: setEndPoint(
        endPoints.product.removeAssignedCategory,
        ...extraParams
      ),
    });
  }
  // Store product
  static updateStoreProduct(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "PUT",
      url: setEndPoint(endPoints.product.updateSotreProduct, ...extraParams),
      data,
    });
  }
  // product bulk upload
  static bulkUploadProduct(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.bulk.product.create, ...extraParams),
      data,
    });
  }
  // Bulk assign
  static bulkAssign(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "PUT",
      url: setEndPoint(endPoints.bulk.product.assign, ...extraParams),
      data,
    });
  }
  // Bulk sort
  static bulkSort(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "PUT",
      url: setEndPoint(endPoints.bulk.product.sort, ...extraParams),
      data,
    });
  }
  // Bulk status
  static bulkStatus(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "PUT",
      url: setEndPoint(endPoints.bulk.product.status, ...extraParams),
      data,
    });
  }
  // get e-supplier product
  static getESupplierProduct(...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.product.getESupplierProduct, ...extraParams),
    });
  }
  static getSupplierProducts(params: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.product.getSupplierProduct, ...extraParams),
      params,
    });
  }
  static assignSkuToProduct(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.product.assignSkuToProduct, ...extraParams),
      data,
    });
  }
  static getProductBySku(params: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.product.getAllBySKU, ...extraParams),
      params,
    });
  }
  static updateProductMediaSort(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(
        endPoints.product.updateProductMediaSort,
        ...extraParams
      ),
      data,
    });
  }
  // reorder supplier product
  static reorderSupplierProduct(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "PUT",
      url: setEndPoint(
        endPoints.product.reorderSupplierProduct,
        ...extraParams
      ),
      data,
    });
  }

  // delete e-supplier product
  static deleteESupplierProduct(...extraParams: any[]) {
    return apiGatewayService({
      method: "DELETE",
      url: setEndPoint(
        endPoints.product.deleteESupplierProduct,
        ...extraParams
      ),
    });
  }

  // toggle supplier status
  static toggleSupplierStatus(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "PUT",
      url: setEndPoint(endPoints.product.toggleSupplierStatus, ...extraParams),
      data,
    });
  }
  // get product by id
  static getProductBySearch(params: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "GET",
      url: setEndPoint(endPoints.product.getProductBySearch, ...extraParams),
      params,
    });
  }
  // sync product
  static syncProduct(id: number) {
    return apiGatewayService({
      method: "POST",
      url: setEndPoint(endPoints.product.syncProduct, id),
    });
  }
  // assign thumbnail
  static assignThumbnail(data: any, ...extraParams: any[]) {
    return apiGatewayService({
      method: "PUT",
      url: setEndPoint(endPoints.product.assignThumbnail, ...extraParams),
      data,
    });
  }
}
