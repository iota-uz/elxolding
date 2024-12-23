import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:mobile/models/product.dart';
import 'package:mobile/services/types.dart';

enum ProductStatus implements Comparable<ProductStatus> {
  inStock(status: "in_stock"),
  inDevelopment(status: "in_development"),
  approved(status: "approved");

  const ProductStatus({
    required this.status,
  });

  final String status;

  @override
  int compareTo(ProductStatus other) => status.compareTo(other.status);
}

String findProducts = """
query Products(\$offset: Int, \$limit: Int, \$sortBy: String) {
    products(offset: \$offset, limit: \$limit, sortBy: \$sortBy) {
        total
        data {
            id
            rfid
            status
            createdAt
            updatedAt
        }
    }
}
""";

String validateProducts = """
mutation ValidateProducts(\$tags: [String!]!) {
    validateProducts(tags: \$tags) {
      id
    }
}
""";

String createProductsFromTags = """
mutation CreateProductsFromTags(\$positionId: Int!, \$tags: [String!]!) {
    createProductsFromTags(positionId: \$positionId, tags: \$tags) {
        id
    }
}
""";

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

  Future<Product> createFromTags(int positionId, List<String> tags) async {
    final MutationOptions options = MutationOptions(
      document: gql(createProductsFromTags),
      variables: {"positionId": positionId, "tags": tags},
    );
    final response = await _client.mutate(options);
    if (response.hasException) {
      throw Exception(response.exception.toString());
    }
    return Product.fromJson(response.data?["createProductsFromTags"]);
  }
}
