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
                  context.pushNamed("order-id",
                      pathParameters: {"id": order.id.toString()});
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
                    Text(order.positionsCountText(context)),
                  ],
                ),
              ),
              const SizedBox(height: 10),
            ],
          ),
      ],
    );
  }

  Future<List<Order>> fetchOrders(String t) async {
    var res = await constants.feathersApp.service("orders").find({
      "type": t,
    });
    List<dynamic> data = res["data"];
    return data.map<Order>((e) => Order.fromJson(e)).toList();
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Заявки'),
          bottom: const TabBar(
            tabs: [
              Tab(
                icon: Icon(Icons.arrow_downward),
                text: "Поступление",
              ),
              Tab(
                icon: Icon(Icons.arrow_upward),
                text: "Отгрузка",
              ),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            Center(
              child: Container(
                padding: const EdgeInsets.only(left: 10, right: 10, top: 20),
                child: SingleChildScrollView(
                  child: FutureBuilder(
                    future: fetchOrders("in"),
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return const CircularProgressIndicator();
                      }
                      if (snapshot.hasError) {
                        return Text(snapshot.error.toString());
                      }
                      var orders = snapshot.data!;
                      if (orders.isEmpty) {
                        return Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Image.asset(
                              "assets/images/empty.png",
                              width: 120,
                            ),
                            const SizedBox(height: 10),
                            const Text("Нет данных"),
                          ],
                        );
                      }
                      return buildList(context, orders: orders);
                    },
                  ),
                ),
              ),
            ),
            Center(
              child: Container(
                padding: const EdgeInsets.only(left: 10, right: 10, top: 20),
                child: SingleChildScrollView(
                  child: FutureBuilder(
                    future: fetchOrders("out"),
                    builder: (context, snapshot) {
                      if (snapshot.connectionState == ConnectionState.waiting) {
                        return const CircularProgressIndicator();
                      }
                      if (snapshot.hasError) {
                        return Text(snapshot.error.toString());
                      }
                      var orders = snapshot.data!;
                      if (orders.isEmpty) {
                        return Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Image.asset(
                              "assets/images/empty.png",
                              width: 120,
                            ),
                            const SizedBox(height: 10),
                            const Text("Нет данных"),
                          ],
                        );
                      }
                      return buildList(context, orders: orders);
                    },
                  ),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }
}
