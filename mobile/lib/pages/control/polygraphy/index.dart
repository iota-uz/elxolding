import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/constants.dart';
import 'package:mobile/feathers/models/inventory.dart';

class PolygraphyPage extends StatefulWidget {
  const PolygraphyPage({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _PolygraphyPageState();
  }
}

class _PolygraphyPageState extends State<PolygraphyPage> {
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
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: _inventory.map((e) {
        return ListTile(
          title: Text(e.title),
          subtitle: Text("Ожидают одобрения: ${e.tags.length}"),
          onTap: () {
            context.pushNamed("control-polygraphy-scan",
                pathParameters: {"id": e.id.toString()});
          },
        );
      }).toList(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(FlutterI18n.translate(context, "polygraphy.title")),
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
