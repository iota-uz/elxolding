import 'package:mobile/feathers/services/base.dart';
import 'package:mobile/feathers/types.dart';

import 'package:mobile/feathers/models/order.dart';

class OrdersService extends Service {
  OrdersService() : super("orders");

  @override
  Future<PaginateResponse<Order>> find(Map<String, dynamic> params) async {
    return super.find(params).then((response) {
      return PaginateResponse<Order>.fromJson(
        response,
        (json) => Order.fromJson(json),
      );
    });
  }

  @override
  Future<Order> get(int id, [Map? params]) async {
    return super.get(id).then((response) {
      return Order.fromJson(response);
    });
  }

  @override
  Future<Order> create(Map data) async {
    return super.create(data).then((response) {
      return Order.fromJson(response);
    });
  }

  @override
  Future<Order> patch(int id, Map data) async {
    return super.patch(id, data).then((response) {
      return Order.fromJson(response);
    });
  }

  @override
  Future<Order> remove(int id) async {
    return super.remove(id).then((response) {
      return Order.fromJson(response);
    });
  }
}
