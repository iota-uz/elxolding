import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:mobile/constants.dart';
import 'package:go_router/go_router.dart';

import 'package:mobile/feathers/models/order.dart';

class HomePage extends StatefulWidget {
  const HomePage({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _HomePageState();
  }
}

class _HomePageState extends State<HomePage> {
  Column buildList(BuildContext context, {List<Order> orders = const []}) {
    if (orders.isEmpty) {
      return Column(
        children: [
          emptyWidget(context),
        ],
      );
    }
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
    return ordersService.find({"type": t}).then((res) => res.data);
  }

  Widget emptyWidget(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Image.asset(
          "assets/images/empty.png",
          width: 120,
        ),
        const SizedBox(height: 10),
        Text(FlutterI18n.translate(context, "home.noOrders")),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: Text(FlutterI18n.translate(context, "home.title")),
          bottom: TabBar(
            tabs: [
              Tab(
                icon: const Icon(Icons.arrow_downward),
                text: FlutterI18n.translate(context, "home.orderType.in"),
              ),
              Tab(
                icon: const Icon(Icons.arrow_upward),
                text: FlutterI18n.translate(context, "home.orderType.out"),
              ),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            FutureBuilder(
              future: fetchOrders("in"),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(
                    child: CircularProgressIndicator(),
                  );
                }
                if (snapshot.hasError) {
                  return Center(
                    child: Text(snapshot.error.toString()),
                  );
                }
                return Container(
                  padding: const EdgeInsets.only(left: 10, right: 10, top: 20),
                  child: SingleChildScrollView(
                    child: buildList(context, orders: snapshot.data!),
                  ),
                );
              },
            ),
            FutureBuilder(
              future: fetchOrders("out"),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(
                    child: CircularProgressIndicator(),
                  );
                }
                if (snapshot.hasError) {
                  return Center(
                    child: Text(snapshot.error.toString()),
                  );
                }
                return Container(
                  padding: const EdgeInsets.only(left: 10, right: 10, top: 20),
                  child: SingleChildScrollView(
                    child: buildList(context, orders: snapshot.data!),
                  ),
                );
              },
            )
          ],
        ),
      ),
    );
  }
}
