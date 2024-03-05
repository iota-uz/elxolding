import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/models/order.dart';

class OrderPage extends StatefulWidget {
  final String pk;

  const OrderPage({Key? key, id, required this.pk}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _OrderPageState(pk);
  }
}

class _OrderPageState extends State<OrderPage> {
  Order order = Order(1, "pickup", 8);

  _OrderPageState(id) {
    order = Order(int.parse(id), "pickup", 8);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(order.title(context) ?? ""),
      ),
      body: Center(
        child: Container(
          padding: const EdgeInsets.only(left: 40, right: 30, top: 20),
          child: Column(
            children: [
              Text(order.typeText(context)),
              Text(order.productsCountText(context)),
            ],
          ),
        ),
      ),
    );
  }
}
