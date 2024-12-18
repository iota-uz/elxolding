import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:mobile/feathers/services/base.dart';
import 'package:mobile/feathers/types.dart';

import 'package:mobile/feathers/models/product.dart';

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
}
