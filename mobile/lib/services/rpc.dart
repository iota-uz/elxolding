import 'package:mobile/models/inventory.dart';
import 'package:mobile/services/types.dart';

class RPCService {
  Future<RpcResponse> rpc(String method, Map<String, dynamic> params) async {
    var response = <String, dynamic>{};
    return RpcResponse.fromJson(response);
  }

  Future<List<InventoryPosition>> getInventory(
      Map<String, dynamic> params) async {
    final response = await rpc("GetInventory", params);
    if (response.hasError()) {
      throw Exception(response.error);
    }
    var result = response.result as Map<String, dynamic>;
    var positions = result["inventory"] as List<dynamic>;
    return positions
        .map<InventoryPosition>((e) => InventoryPosition.fromJson(e))
        .toList();
  }

  Future<RpcResponse> createProductsFromTags(
      int positionId, List<String> tags) {
    return rpc("CreateProductsFromTags", {
      "positionId": positionId,
      "tags": tags,
    });
  }

  Future<RpcResponse> validateProducts(List<String> tags) {
    return rpc("ValidateProducts", {
      "tags": tags,
    });
  }

  Future<RpcResponse> completeInventoryCheck(List<Map<String, int>> positions) {
    return rpc("CompleteInventoryCheck", {
      "positions": positions,
    });
  }

  Future<RpcResponse> completeOrder(int orderId) {
    return rpc("CompleteOrder", {
      "orderId": orderId,
    });
  }
}
