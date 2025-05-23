import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/utils/rfid.dart';
import 'package:rfid_c72_plugin/tag_epc.dart';
import 'package:mobile/constants.dart';

import 'package:mobile/services/products/products.model.dart';

import 'package:mobile/services/inventory/inventory.model.dart';

import 'package:mobile/components/footer_button.dart';

class CustomProduct extends Product {
  CustomProduct.fromJson(Map<String, dynamic> json) : super.fromJson(json);
}

class NewInventoryPage extends StatefulWidget {
  const NewInventoryPage({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _NewInventoryPageState();
  }
}

class _NewInventoryPageState extends State<NewInventoryPage> {
  List<TagEpc> tags = [];
  List<InventoryPosition> _inventory = [];
  List<InventoryPosition> inventoryPreview = [];
  Set<String> inventoryTags = {};
  bool _isScanning = false;
  bool _isLoading = true;
  bool _isConnected = false;
  RfidWrapper rfid = RfidWrapper();

  @override
  void initState() {
    super.initState();
    rfid.onTagsUpdate = onTagsUpdate;
    rfid.onConnected = (bool connected) {
      if (connected) {
        // rfid.setPower(30);
      }
      setState(() {
        _isConnected = connected;
      });
    };
    rfid.connect();
    fetchData();
  }

  @override
  void dispose() {
    super.dispose();
    rfid.closeAll();
  }

  int get totalFound {
    return _inventory.fold(
        0, (previousValue, element) => previousValue + element.matches);
  }

  void onTagsUpdate(List<TagEpc> newTags) async {
    int changes = 0;
    for (var tag in newTags) {
      if (scannedTag(tag.epc)) {
        continue;
      }
      tags.add(tag);
      if (inventoryTags.contains(tag.epc)) {
        rfid.beep();
        changes++;
      }
    }
    if (changes == 0) {
      return;
    }
    for (var item in _inventory) {
      item.matches = 0;
      for (var productTag in item.tags) {
        for (var tag in tags) {
          if (productTag == tag.epc) {
            item.matches++;
          }
        }
      }
    }
    _inventory.sort((a, b) => b.matches.compareTo(a.matches));
    inventoryPreview = _preview();
    setState(() {});
  }

  bool scannedTag(String rfid) {
    for (var tag in tags) {
      if (tag.epc == rfid) {
        return true;
      }
    }
    return false;
  }

  Future<void> fetchData() async {
    var inventory = await fetchInventory();
    setState(() {
      _inventory = inventory;
      inventoryPreview = _preview();
      inventoryTags = inventory.expand((element) => element.tags).toSet();
      _isLoading = false;
    });
  }

  Future<List<InventoryPosition>> fetchInventory() async {
    return rpcService.getInventory({});
  }

  List<InventoryPosition> _preview() {
    if (_inventory.length < 200) {
      return _inventory;
    }
    var result = _inventory
        .where((element) => element.matches < element.tags.length)
        .toList();
    return result.take(200).toList();
  }

  Widget mainUI(BuildContext context) {
    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: inventoryPreview.length,
      prototypeItem: ListTile(
        contentPadding: const EdgeInsets.all(0),
        title: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              FlutterI18n.translate(context, "inventory.list.position.title"),
              style: const TextStyle(color: Colors.blue),
            ),
            Text(
              FlutterI18n.translate(context, "inventory.list.position.matches"),
              style: const TextStyle(color: Colors.blue),
            ),
          ],
        ),
      ),
      itemBuilder: (context, index) {
        var item = inventoryPreview[index];
        return ListTile(
          contentPadding: const EdgeInsets.all(0),
          title: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(item.title),
              Text(
                "${item.matches}/${item.tags.length}",
                style: TextStyle(
                  color: item.matches == item.tags.length
                      ? Colors.green
                      : Colors.red,
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Future<void> onPressed() async {
    List<Map<String, int>> positions = [];
    for (var item in _inventory) {
      if (item.matches > 0) {
        positions.add({"positionId": item.id, "found": item.matches});
      }
    }
    if (positions.isEmpty) {
      return;
    }
    await rpcService.completeInventoryCheck(positions);
  }

  Widget body(BuildContext context) {
    if (_isLoading || !_isConnected) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            alignment: Alignment.center,
            child: const CircularProgressIndicator(),
          )
        ],
      );
    }
    return SingleChildScrollView(
      child: Center(
        child: Container(
          alignment: Alignment.center,
          padding: const EdgeInsets.only(left: 20, right: 20, top: 20),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "${FlutterI18n.translate(context, "inventory.header.total")}: ${tags.length}",
                style: const TextStyle(fontSize: 18),
              ),
              Text(
                "${FlutterI18n.translate(context, "inventory.header.matches")}: $totalFound/${inventoryTags.length}",
                style: const TextStyle(fontSize: 14),
              ),
              const SizedBox(height: 20),
              mainUI(context),
            ],
          ),
        ),
      ),
    );
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
        title: Text(FlutterI18n.translate(context, "inventory.title")),
      ),
      body: body(context),
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
                text: FlutterI18n.translate(context, "inventory.footer.complete"),
                onPressed: () {
                  onPressed();
                  context.pop();
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
