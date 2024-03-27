import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:mobile/constants.dart' as constants;
import 'package:go_router/go_router.dart';

import 'package:mobile/models/order.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _HomePageState();
  }
}

class _HomePageState extends State<HomePage> {
  Column buildList(BuildContext context, {List<Order> orders = const []}) {
    return Column(
      children: [
        for (var order in orders)
          Column(
            children: [
              ListTile(
                onTap: () {
                  context.pushNamed("order-id", pathParameters: {"id": order.id.toString()});
                },
                shape: RoundedRectangleBorder(
                  side: const BorderSide(color: Colors.grey, width: 1),
                  borderRadius: BorderRadius.circular(5),
                ),
                title: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(order.title(context)),
                    Text(order.typeText(context)),
                    Text(order.productsCountText(context)),
                  ],
                ),
              ),
              const SizedBox(height: 10),
            ],
          ),
      ],
    );
  }

  Future<List<Order>> fetchOrders() async {
    var res = await constants.feathersApp.service("requests").find({});
    List<dynamic> data = res["data"];
    return data.map<Order>((e) => Order.fromJson(e)).toList();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Заявки'),
      ),
      body: Center(
        child: Container(
          padding: const EdgeInsets.only(left: 10, right: 10, top: 20),
          child: FutureBuilder(
            future: fetchOrders(),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const CircularProgressIndicator();
              }
              if (snapshot.hasError) {
                return Text(snapshot.error.toString());
              }
              return buildList(context, orders: snapshot.data!);
            },
          ),
        ),
      ),
    );
  }
}
