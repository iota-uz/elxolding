import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:mobile/feathers/types.dart';

import 'package:mobile/feathers/models/user.dart';

String findUsers = """
query Users(\$offset: Int, \$limit: Int, \$sortBy: String) {
    users(offset: \$offset, limit: \$limit, sortBy: \$sortBy) {
        total
        data {
            id
        }
    }
}
""";

class UsersService {
  late GraphQLClient _client;

  void setClient(GraphQLClient client) {
    _client = client;
  }

  Future<PaginateResponse<User>> find(Map<String, dynamic> params) async {
    final WatchQueryOptions options = WatchQueryOptions(
      document: gql(findUsers),
      variables: params,
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
}
