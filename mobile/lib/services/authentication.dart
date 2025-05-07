import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:mobile/services/products/products.model.dart';
import 'package:mobile/services/types.dart';

String authenticateQ = """
mutation Authenticate(\$userId: Int!, \$password: String!) {
    authenticateWithUserID(userID: \$userId, password: \$password) {
        token
        userId
        ip
        userAgent
        expiresAt
        createdAt
    }
}
""";

class AuthenticationService {
  late GraphQLClient _client;
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  void setClient(GraphQLClient client) {
    _client = client;
  }

  Future<PaginateResponse<Product>> find(Map<String, dynamic> params) async {
    final WatchQueryOptions options = WatchQueryOptions(
      document: gql(authenticateQ),
      variables: params,
    );
    final response = await _client.query(options);
    if (response.hasException) {
      throw Exception(response.exception.toString());
    }
    return PaginateResponse<Product>.fromJson(
      response.data?["products"],
      (json) => Product.fromJson(json),
    );
  }

  Future<void> authenticate(int userId, String password) async {
    final MutationOptions options = MutationOptions(
      document: gql(authenticateQ),
      variables: {"userId": userId, "password": password},
    );
    final response = await _client.mutate(options);
    if (response.hasException) {
      throw Exception(response.exception.toString());
    }
    await _storage.write(
      key: "sid",
      value: response.data?["authenticateWithUserID"]["token"],
    );
    return;
  }
}
