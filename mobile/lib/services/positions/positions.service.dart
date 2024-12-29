import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:mobile/services/positions/positions.model.dart';
import 'package:mobile/services/positions/positions.queries.dart';
import 'package:mobile/services/types.dart';

class PositionsService {
  late GraphQLClient _client;

  void setClient(GraphQLClient client) {
    _client = client;
  }

  Future<PaginateResponse<Position>> find(FindParams params) async {
    final WatchQueryOptions options = WatchQueryOptions(
      document: gql(findPositions),
      variables: params.toJSON(),
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
