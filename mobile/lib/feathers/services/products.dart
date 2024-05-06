import 'package:mobile/feathers/services/base.dart';
import 'package:mobile/feathers/types.dart';

import 'package:mobile/feathers/models/product.dart';

class ProductsService extends Service {
  ProductsService() : super("products");

  @override
  Future<PaginateResponse<Product>> find(Map<String, dynamic> params) async {
    return super.find(params).then((response) {
      return PaginateResponse<Product>.fromJson(
        response,
        (json) => Product.fromJson(json),
      );
    });
  }

  @override
  Future<Product> get(int id, [Map? params]) async {
    return super.get(id).then((response) {
      return Product.fromJson(response);
    });
  }

  @override
  Future<Product> create(Map data) async {
    return super.create(data).then((response) {
      return Product.fromJson(response);
    });
  }

  @override
  Future<Product> patch(int id, Map data) async {
    return super.patch(id, data).then((response) {
      return Product.fromJson(response);
    });
  }

  @override
  Future<Product> remove(int id) async {
    return super.remove(id).then((response) {
      return Product.fromJson(response);
    });
  }
}
