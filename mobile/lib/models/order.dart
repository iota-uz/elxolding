import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';

class Order {
  final int id;
  final String type; // delivery, pickup
  final int productsCount;

  Order(this.id, this.type, this.productsCount);

  String title(BuildContext context) {
    return "${FlutterI18n.translate(context, "home.order")} #$id";
  }

  String typeText(BuildContext context) {
    return FlutterI18n.translate(context, "home.orderType.$type");
  }

  String productsCountText(BuildContext context) {
    return FlutterI18n.plural(context, "home.productsCount", productsCount);
  }
}
