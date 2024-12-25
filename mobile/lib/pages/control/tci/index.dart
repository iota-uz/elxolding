import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/constants.dart';
import 'package:mobile/services/inventory/inventory.model.dart';

class TCIPage extends StatefulWidget {
  const TCIPage({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _TCIPageState();
  }
}

class _TCIPageState extends State<TCIPage> {
  bool _isLoading = true;
  List<InventoryPosition> _inventory = [];

  @override
  void initState() {
    super.initState();
    initPlatformState();
  }

  Future<void> initPlatformState() async {
    var inventory = await fetchInventory();

    setState(() {
      _isLoading = false;
      _inventory = inventory;
    });
  }

  Future<List<InventoryPosition>> fetchInventory() async {
    return rpcService.getInventory({
      "status": "in_development",
    });
  }

  Widget mainUI(BuildContext context) {
    if (_isLoading) {
      return const CircularProgressIndicator();
    }
    List<Widget> children = _inventory.map((e) {
      return ListTile(
        contentPadding: const EdgeInsets.all(0),
        title: Text(
          e.title,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w500,
          ),
        ),
        subtitle: Text(
          FlutterI18n.plural(
            context,
            "tci.awaitingApproval",
            e.tags.length,
          ),
        ),
        trailing: const Icon(Icons.arrow_forward_ios),
        onTap: () {
          context.pushNamed(
            "control-tci-scan",
            pathParameters: {"id": e.id.toString()},
          );
        },
      );
    }).toList();

    var total = _inventory.fold<int>(0, (previousValue, element) => previousValue + element.tags.length);
    children.insert(
      0,
      ListTile(
        contentPadding: const EdgeInsets.all(0),
        title: Text(
          FlutterI18n.translate(context, "tci.all.title"),
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
          ),
        ),
        subtitle: Text(
          FlutterI18n.plural(
            context,
            "tci.awaitingApproval",
            total,
          ),
        ),
        trailing: const Icon(Icons.arrow_forward_ios),
        onTap: () {
          context.pushNamed(
            "control-tci-scan",
            pathParameters: {"id": "all"},
          );
        },
      ),
    );
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: children,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(FlutterI18n.translate(context, "tci.title")),
      ),
      body: SingleChildScrollView(
        child: Center(
          child: Container(
            padding: const EdgeInsets.only(left: 20, right: 20, top: 20),
            child: mainUI(context),
          ),
        ),
      ),
    );
  }
}
