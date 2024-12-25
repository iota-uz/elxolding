import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:mobile/services/types.dart';

import 'package:mobile/models/order.dart';

String findOrders = """
query Orders(\$offset: Int, \$limit: Int, \$sortBy: String) {
    orders(offset: \$offset, limit: \$limit, sortBy: \$sortBy) {
        total
        data {
            id
            type
            status
            createdAt
            items {
                quantity
                position {
                    id
                    title
                    barcode
                    createdAt
                    updatedAt
                }
                products {
                    id
                    rfid
                    status
                    createdAt
                    updatedAt
                }
            }
        }
    }
}
""";

String getOrder = """
query Order(\$id: ID!) {
    order(id: \$id) {
        id
        type
        status
        createdAt
        items {
            quantity
            position {
                id
                title
                barcode
                createdAt
                updatedAt
            }
            products {
                id
                rfid
                status
                createdAt
                updatedAt
            }
        }
    }
}
""";

class OrdersService {
  late GraphQLClient _client;

  void setClient(GraphQLClient client) {
    _client = client;
  }

  Future<PaginateResponse<Order>> find(Map<String, dynamic> params) async {
    final WatchQueryOptions options = WatchQueryOptions(
      document: gql(findOrders),
      variables: params,
    );
    final response = await _client.query(options);
    if (response.hasException) {
      print(response.source.toString());
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
