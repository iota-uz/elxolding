import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:go_router/go_router.dart';
import 'package:rfid_c72_plugin/rfid_c72_plugin.dart';
import 'package:rfid_c72_plugin/tag_epc.dart';
import 'package:mobile/constants.dart' as constants;

import '../../models/product.dart';

class NewInventoryPage extends StatefulWidget {
  const NewInventoryPage({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _NewInventoryPageState();
  }
}

class _NewInventoryPageState extends State<NewInventoryPage> {
  String _platformVersion = 'Unknown';
  bool _isConnected = false;
  bool _isLoading = true;
  List<TagEpc> _data = [];
  List<dynamic> _inventory = [];

  @override
  void initState() {
    super.initState();
    initPlatformState();
  }

  @override
  void dispose() {
    super.dispose();
    closeAll();
  }

  closeAll() {
    RfidC72Plugin.stopScan;
    RfidC72Plugin.close;
  }

  Future<void> initPlatformState() async {
    String platformVersion;
    try {
      platformVersion = (await RfidC72Plugin.platformVersion)!;
    } on PlatformException {
      platformVersion = 'Failed to get platform version.';
    }
    RfidC72Plugin.connectedStatusStream
        .receiveBroadcastStream()
        .listen(updateIsConnected);
    RfidC72Plugin.tagsStatusStream.receiveBroadcastStream().listen(updateTags);
    await RfidC72Plugin.connect;
// await UhfC72Plugin.setWorkArea('2');
// await UhfC72Plugin.setPowerLevel('30');
// If the widget was removed from the tree while the asynchronous platform
// message was in flight, we want to discard the reply rather than calling
// setState to update our non-existent appearance.

    await RfidC72Plugin.connectBarcode; //connect barcode
    var inventory = await fetchInventory();
    await RfidC72Plugin.startContinuous;
    if (!mounted) return;

    setState(() {
      _platformVersion = platformVersion;
      _isLoading = false;
      _inventory = inventory;
    });
  }

  void updateTags(dynamic result) {
    setState(() {
      _data = TagEpc.parseTags(result);
    });
  }

  void updateIsConnected(dynamic isConnected) {
    //setState(() {
    _isConnected = isConnected;
    //});
  }

  Future<List<dynamic>> fetchInventory() async {
    final response = await constants.feathersApp
        .service('rpc')
        .create({'method': 'GetInventory', 'params': {}});
    if (response["error"] != null) {
      throw Exception(response["error"]);
    }
    var result = response["result"] as Map<String, dynamic>;
    return result["inventory"];
  }

  Widget mainUI(BuildContext context) {
    if (_isLoading) {
      return const CircularProgressIndicator();
    }
    return Column(
      children: _inventory.map<Widget>((dynamic item) {
        var products = (item['products'] as List<dynamic>).map<Product>((e) => Product.fromJson(e)).toList();
        var matches = 0;
        for (var product in products) {
          for (var tag in _data) {
            if ("EPC:${product.rfid}" == tag.epc) {
              matches++;
            }
          }
        }
        return Card(
          color: Colors.blue.shade50,
          child: Container(
            alignment: Alignment.center,
            padding: const EdgeInsets.all(8.0),
            child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    item['title'],
                    style: const TextStyle(color: Colors.blue),
                  ),
                  Text(
                    '$matches / ${products.length}',
                    style: const TextStyle(color: Colors.blue),
                  ),
                ]
            ),
          ),
        );
      }).toList(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(FlutterI18n.translate(context, "inventory.title")),
      ),
      body: Center(
        child: Container(
          padding: const EdgeInsets.only(left: 20, right: 20, top: 20),
          child: Column(
            children: [
              mainUI(context),
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomAppBar(
        child: ElevatedButton(
          onPressed: () {
            closeAll();
            context.pop();
          },
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: 20),
            backgroundColor: Theme.of(context).primaryColor,
            minimumSize: const Size.fromHeight(40),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            elevation: 0
          ),
          child: const Text(
            "Завершить",
            style: TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      )
    );
  }
}
