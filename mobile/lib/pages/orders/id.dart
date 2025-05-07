import 'dart:ffi';

import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/constants.dart';
import 'package:mobile/services/orders/orders.model.dart';
import 'package:mobile/utils/rfid.dart';
import 'package:rfid_c72_plugin/tag_epc.dart';

import 'package:mobile/components/footer_button.dart';

class OrderPage extends StatefulWidget {
  final String pk;

  const OrderPage({Key? key, id, required this.pk}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _OrderPageState();
  }
}

class _OrderPageState extends State<OrderPage>
    with SingleTickerProviderStateMixin {
  int orderId = 0;
  Order? order;
  bool isLoading = true;
  bool isConnected = false;
  bool _isScanning = false;
  RfidWrapper rfid = RfidWrapper();
  List<TagEpc> tags = [];
  Set<String> scanned = {};
  List<String> inventoryTags = [];
  late final AnimationController _controller;
  late final Animation<double> _scaleAnimation;
  late final Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat();
    _scaleAnimation = Tween<double>(begin: 0.6, end: 1.2).animate(_controller);
    _fadeAnimation = Tween<double>(begin: 1, end: 0.2).animate(_controller);

    orderId = int.parse(widget.pk);
    ordersService.get(orderId).then((value) {
      setState(() {
        order = value;
        inventoryTags = value.positions
            .expand((e) => e.products.map((e) => e.rfid))
            .toList();
        isLoading = false;
      });
    });
    rfid.connect();
    rfid.onConnected = (bool connected) {
      setState(() {
        isConnected = connected;
      });
    };
    rfid.onTagsUpdate = (List<TagEpc> tags) {
      for (var tag in tags) {
        if (!inventoryTags.contains(tag.epc)) {
          continue;
        }
        if (!scanned.contains(tag.epc)) {
          scanned.add(tag.epc);
          rfid.beep();
        }
      }
      setState(() {
        this.tags = tags;
      });
    };
  }

  @override
  void dispose() {
    super.dispose();
    _controller.dispose();
    rfid.closeAll();
  }

  bool buttonDisabled() {
    var found = 0;
    if (order == null) {
      return true;
    }
    for (var position in order!.positions) {
      var quantity = position.products.length;
      for (var tag in tags) {
        for (var product in position.products) {
          if (tag.epc == product.rfid) {
            found++;
          }
        }
      }
      if (found < quantity) {
        return true;
      }
    }
    return false;
  }

  Widget signalStrengthIcon(double rssi) {
    // return a circle with color based on rssi and the transparency based on the value
    var color = Colors.green;
    if (rssi < -70) {
      color = Colors.red;
    } else if (rssi < -60) {
      color = Colors.orange;
    }
    return Stack(
      alignment: AlignmentDirectional.center,
      children: [
        FadeTransition(
          opacity: _fadeAnimation,
          child: ScaleTransition(
            scale: _scaleAnimation,
            child: Container(
              width: 50 * 1.5,
              height: 50 * 1.5,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: color,
              ),
            ),
          ),
        ),
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: color.withOpacity(1 - (rssi / -100)),
            shape: BoxShape.circle,
          ),
        ),
      ],
    );
  }

  List<Widget> buildProductsList(BuildContext context) {
    var list = <Widget>[];
    for (var position in order!.positions) {
      var quantity = position.products.length;
      var found = 0;
      double minRssi = 0;
      for (var tag in tags) {
        for (var product in position.products) {
          if (tag.epc == product.rfid) {
            found++;
            var rssi = double.parse(tag.rssi);
            if (rssi < minRssi) {
              minRssi = rssi;
            }
          }
        }
      }
      Widget image = position.photo == null
          ? Image.asset("assets/images/placeholder.png")
          : Image.network(position.photo!);
      list.add(
        ListTile(
          contentPadding: const EdgeInsets.all(0),
          title: Column(
            children: [
              image,
              Row(
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        position.title,
                        style: const TextStyle(
                          fontSize: 18
                        )
                      ),
                      Text("$found/$quantity"),
                    ],
                  ),
                  const Spacer(),
                  signalStrengthIcon(minRssi),
                ],
              )
            ],
          ),
        ),
      );
    }
    return list;
  }

  Widget buildMainUI(BuildContext context) {
    if (isLoading) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          order!.typeText(context),
          style: const TextStyle(fontSize: 20),
        ),
        Text(order!.positionsCountText(context)),
        const SizedBox(height: 20),
        ...buildProductsList(context)
      ],
    );
  }

  void _onPressed() {
    if (buttonDisabled()) {
      return;
    }
    rpcService.completeOrder(orderId);
    GoRouter.of(context).goNamed("home");
  }

  void onScanPressed() async {
    if (_isScanning) {
      rfid.stop();
    } else {
      rfid.readContinuous();
    }
    setState(() {
      _isScanning = !_isScanning;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("${FlutterI18n.translate(context, "order.title")}$orderId"),
      ),
      body: SingleChildScrollView(
        child: Container(
          padding: const EdgeInsets.only(left: 20, right: 20, top: 20),
          child: buildMainUI(context),
        ),
      ),
      bottomNavigationBar: BottomAppBar(
        height: 155,
        child: Container(
          padding: const EdgeInsets.only(left: 20, right: 20),
          child: Column(
            children: [
              FooterButton(
                onPressed: onScanPressed,
                secondary: true,
                text: _isScanning
                    ? FlutterI18n.translate(context, "inventory.footer.stop")
                    : FlutterI18n.translate(context, "inventory.footer.start"),
              ),
              const SizedBox(height: 15),
              FooterButton(
                text: order?.type == "in"
                    ? FlutterI18n.translate(context, "order.in")
                    : FlutterI18n.translate(context, "order.out"),
                onPressed: _onPressed,
                disabled: buttonDisabled(),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
