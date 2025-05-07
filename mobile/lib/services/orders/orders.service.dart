import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:mobile/services/types.dart';

import 'orders.model.dart';
import 'orders.queries.dart';

class OrdersService {
  late GraphQLClient _client;

  void setClient(GraphQLClient client) {
    _client = client;
  }

  Future<PaginateResponse<Order>> find(FindParams params) async {
    final WatchQueryOptions options = WatchQueryOptions(
      document: gql(findOrders),
      variables: {"query": params.toJSON()},
    );
    final response = await _client.query(options);
    if (response.hasException) {
      throw Exception(response.exception.toString());
    }
    return PaginateResponse<Order>.fromJson(
      response.data?["orders"],
      (json) => Order.fromJson(json),
    );
  }

  Future<Order> get(int id) async {
    final WatchQueryOptions options = WatchQueryOptions(
      document: gql(getOrder),
      variables: {"id": id},
    );
    final response = await _client.query(options);
    if (response.hasException) {
      throw Exception(response.exception.toString());
    }
    return Order.fromJson(response.data?["order"]);
  }
}
