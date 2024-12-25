import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:mobile/models/product.dart';

class OrderItem {
  final int id;
  final String title;
  final String barcode;
  final String unit;
  final String? photo;
  final List<Product> products;

  OrderItem(
    this.id,
    this.title,
    this.barcode,
    this.unit,
    this.photo,
    this.products,
  );

  static fromJson(Map<String, dynamic> json) {
    Map<String, dynamic> positionJson = json["position"];
    List<dynamic> productsJson = json["products"];
    var products =
        productsJson.map<Product>((e) => Product.fromJson(e)).toList();
    return OrderItem(
      positionJson["id"],
      positionJson["title"],
      positionJson["barcode"],
      // TODO: implement
      "unit",
      // positionJson["unit"],
      positionJson["photo"],
      products,
    );
  }
}

class Order {
  final int id;
  final String type; // delivery, pickup
  final List<Product> products;
  final List<OrderItem> positions;

  Order(this.id, this.type, this.products, this.positions);

  String title(BuildContext context) {
    return "#$id";
  }

  String typeText(BuildContext context) {
    return FlutterI18n.translate(context, "home.orderType.$type");
  }

  String productsCountText(BuildContext context) {
    return FlutterI18n.plural(context, "home.productsCount", products.length);
  }

  String positionsCountText(BuildContext context) {
    return FlutterI18n.plural(context, "home.positionsCount", positions.length);
  }

  static fromJson(Map<String, dynamic> json) {
    List<dynamic> itemsJson = json["items"];
    var items = itemsJson.map<OrderItem>((e) => OrderItem.fromJson(e)).toList();
    var products = items
        .map((e) => e.products)
        .expand((element) => element)
        .toSet()
        .toList();
    return Order(json["id"], json["type"], products, items);
  }
}
