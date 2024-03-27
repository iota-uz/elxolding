import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/constants.dart' as constants;
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
  int orderID = 0;

  _OrderPageState(id) {
    orderID = int.parse(id);
  }

  Future<Order> fetchOrder(int id) async {
    var res = await constants.feathersApp.service("requests").get(id);
    return Order.fromJson(res);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
          title: Text(
              "${FlutterI18n.translate(context, "order.title")}$orderID")),
      body: SingleChildScrollView(
        child: Container(
            padding: const EdgeInsets.only(left: 40, right: 30, top: 20),
            child: FutureBuilder(
              future: fetchOrder(orderID),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const CircularProgressIndicator();
                }
                if (snapshot.hasError) {
                  return Text(snapshot.error.toString());
                }
                var order = snapshot.data!;
                return Column(
                  children: [
                    Text(order.typeText(context)),
                    Text(order.productsCountText(context)),
                    Column(
                      children: [
                        for (var product in order.products)
                          ListTile(
                            title: Text(product.rfid),
                            subtitle: Text(product.status),
                          )
                      ],
                    )
                  ],
                );
              },
            ),
        ),
      ),
      bottomNavigationBar: BottomAppBar(
        child: ElevatedButton(
          onPressed: () {
            context.goNamed("order-edit", pathParameters: {"id": orderID.toString()});
          },
          style: ButtonStyle(
            padding: MaterialStateProperty.all(const EdgeInsets.only(top: 25, bottom: 25)),
          ),
          child: Text(FlutterI18n.translate(context, "order.in"))
        )
      ),
    );
  }
}
