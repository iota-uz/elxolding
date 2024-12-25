import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:mobile/services/types.dart';

import 'package:mobile/services/users/users.model.dart';
import 'package:mobile/services/users/users.queries.dart';

class UsersService {
  late GraphQLClient _client;

  void setClient(GraphQLClient client) {
    _client = client;
  }

  Future<PaginateResponse<User>> find(FindParams params) async {
    final WatchQueryOptions options = WatchQueryOptions(
      document: gql(findUsers),
      variables: params.toJSON(),
    );
    final response = await _client.query(options);
    if (response.hasException) {
      throw Exception(response.exception.toString());
    }
    return PaginateResponse<User>.fromJson(
      response.data?["users"],
      (json) => User.fromJson(json),
    );
  }

  Future<User> get(int id) async {
    final QueryOptions options = QueryOptions(
      document: gql(getUser),
      variables: {"id": id},
    );
    final response = await _client.query(options);
    if (response.hasException) {
      throw Exception(response.exception.toString());
    }
    return User.fromJson(response.data?["user"]);
  }
}
