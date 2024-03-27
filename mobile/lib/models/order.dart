import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:mobile/models/product.dart';

class Order {
  final int id;
  final String type; // delivery, pickup
  final List<Product> products;

  Order(this.id, this.type, this.products);

  String title(BuildContext context) {
    return "${FlutterI18n.translate(context, "home.order")} #$id";
  }

  String typeText(BuildContext context) {
    return FlutterI18n.translate(context, "home.orderType.$type");
  }

  String productsCountText(BuildContext context) {
    return FlutterI18n.plural(context, "home.productsCount", products.length);
  }

  static fromJson(Map<String, dynamic> json) {
    List<dynamic> productsJson = json["products"];
    var products = productsJson.map<Product>((e) => Product.fromJson(e)).toList();
    return Order(json["id"], json["type"], products);
  }
}
