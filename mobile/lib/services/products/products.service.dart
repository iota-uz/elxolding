import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:mobile/services/products/products.model.dart';
import 'package:mobile/services/products/products.queries.dart';
import 'package:mobile/services/types.dart';

class ProductsService {
  late GraphQLClient _client;

  void setClient(GraphQLClient client) {
    _client = client;
  }

  Future<PaginateResponse<Product>> find(Map<String, dynamic> params) async {
    final WatchQueryOptions options = WatchQueryOptions(
      document: gql(findProducts),
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

  Future<Product> validate(List<String> tags) async {
    final MutationOptions options = MutationOptions(
      document: gql(validateProducts),
      variables: {"tags": tags},
    );
    final response = await _client.mutate(options);
    if (response.hasException) {
      throw Exception(response.exception.toString());
    }
    return Product.fromJson(response.data?["validateProducts"]);
  }

  Future<void> createFromTags(int positionId, List<String> tags) async {
    final MutationOptions options = MutationOptions(
      document: gql(createProductsFromTags),
      variables: {"positionId": positionId, "tags": tags},
    );
    final response = await _client.mutate(options);
    if (response.hasException) {
      throw Exception(response.exception.toString());
    }
  }
}
