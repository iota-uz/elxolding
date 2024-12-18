import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:mobile/feathers/types.dart';

import 'package:mobile/feathers/models/position.dart';

String findPositions = """
query WarehousePositions(\$offset: Int, \$limit: Int, \$sortBy: String) {
    warehousePositions(offset: \$offset, limit: \$limit, sortBy: \$sortBy) {
        total
        data {
            id
            title
            barcode
            createdAt
            updatedAt
        }
    }
}
""";

class PositionsService {
  late GraphQLClient _client;

  void setClient(GraphQLClient client) {
    _client = client;
  }

  Future<PaginateResponse<Position>> find(Map<String, dynamic> params) async {
    final WatchQueryOptions options = WatchQueryOptions(
      document: gql(findPositions),
      variables: params,
    );
    final response = await _client.query(options);
    if (response.hasException) {
      throw Exception(response.exception.toString());
    }
    return PaginateResponse<Position>.fromJson(
      response.data?["warehousePositions"],
      (json) => Position.fromJson(json),
    );
  }
}
