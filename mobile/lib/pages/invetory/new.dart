import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/utils/rfid.dart';
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
  List<TagEpc> _data = [];
  List<dynamic> _inventory = [];
  bool _isLoading = true;
  RfidWrapper rfid = RfidWrapper();

  @override
  void initState() {
    super.initState();
    fetchData();
  }

  @override
  void dispose() {
    super.dispose();
    rfid.closeAll();
  }

  Future<void> fetchData() async {
    var inventory = await fetchInventory();
    rfid.connect();
    rfid.readContinuous((t) {
      setState(() {
        _data = t;
      });
    });
    setState(() {
      _inventory = inventory;
      _isLoading = false;
    });
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
        var products = (item['products'] as List<dynamic>)
            .map<Product>((e) => Product.fromJson(e))
            .toList();
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
                ]),
          ),
        );
      }).toList(),
    );
  }

  Future<void> onPressed() async {
    List<Map<String, int>> positions = [];
    for (var item in _inventory) {
      var products = (item['products'] as List<dynamic>)
          .map<Product>((e) => Product.fromJson(e))
          .toList();
      var matches = 0;
      for (var product in products) {
        for (var tag in _data) {
          if ("EPC:${product.rfid}" == tag.epc) {
            matches++;
          }
        }
      }
      if (matches > 0) {
        positions.add({"positionId": item['id'], "found": matches});
      }
    }
    await constants.feathersApp.service('rpc').create({
      'method': 'CompleteInventoryCheck',
      'params': {
        'positions': positions,
      },
    });
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
          child: Container(
            padding: const EdgeInsets.only(left: 20, right: 20, bottom: 20),
            child: ElevatedButton(
              onPressed: () {
                onPressed();
                context.pop();
              },
              style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 20),
                  backgroundColor: Theme.of(context).primaryColor,
                  minimumSize: const Size.fromHeight(40),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(80),
                  ),
                  elevation: 0),
              child: const Text(
                "Завершить",
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ),
        ));
  }
}
