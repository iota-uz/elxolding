import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:mobile/models/product.dart';

class OrderPosition {
  final int id;
  final String title;
  final String barcode;
  final String unit;
  final String? photo;
  final List<Product> products;

  OrderPosition(this.id, this.title, this.barcode, this.unit, this.photo, this.products);

  static fromJson(Map<String, dynamic> json) {
    Map<String, dynamic> positionJson = json["position"];
    List<dynamic> productsJson = json["products"];
    var products =
        productsJson.map<Product>((e) => Product.fromJson(e)).toList();
    return OrderPosition(
      positionJson["id"],
      positionJson["title"],
      positionJson["barcode"],
      positionJson["unit"],
      positionJson["photo"],
      products,
    );
  }
}

class Order {
  final int id;
  final String type; // delivery, pickup
  final List<Product> products;
  final List<OrderPosition> positions;

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
    List<dynamic> productsJson = json["products"];
    List<dynamic> positionsJson = json["positions"];
    var products =
        productsJson.map<Product>((e) => Product.fromJson(e)).toList();
    var positions = positionsJson
        .map<OrderPosition>((e) => OrderPosition.fromJson(e))
        .toList();
    return Order(json["id"], json["type"], products, positions);
  }
}
