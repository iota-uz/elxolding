import 'package:audioplayers/audioplayers.dart';
import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/utils/rfid.dart';
import 'package:rfid_c72_plugin/tag_epc.dart';
import 'package:mobile/constants.dart' as constants;

import 'package:mobile/models/product.dart';

class CustomProduct extends Product {
  CustomProduct.fromJson(Map<String, dynamic> json) : super.fromJson(json);
}

class InventoryPosition {
  final int id;
  final String title;
  final List<CustomProduct> products;
  int matches = 0;

  InventoryPosition(this.id, this.title, this.products);

  InventoryPosition.fromJson(Map<String, dynamic> json)
      : id = json["id"],
        title = json["title"],
        products = (json["products"] as List<dynamic>)
            .map<CustomProduct>((e) => CustomProduct.fromJson(e))
            .toList();
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
  bool _isLoading = true;
  bool _isConnected = false;
  static AudioPlayer player = AudioPlayer();
  RfidWrapper rfid = RfidWrapper();

  @override
  void initState() {
    super.initState();
    rfid.onTagsUpdate = onTagsUpdate;
    rfid.onConnected = (bool connected) {
      if (connected) {
        rfid.readContinuous();
      }
      _isConnected = connected;
    };
    rfid.connect();
    fetchData();
  }

  @override
  void dispose() {
    super.dispose();
    rfid.closeAll();
  }

  void onTagsUpdate(List<TagEpc> newTags) {
    var inventoryRfid = _inventory
        .expand((element) => element.products.map((e) => "EPC:${e.rfid}"))
        .toList();
    for (var tag in newTags) {
      if (scannedTag(tag.epc)) {
        continue;
      }
      if (!inventoryRfid.contains(tag.epc)) {
        continue;
      }
      const alarmAudioPath = "audio/beep.wav";
      player.play(AssetSource(alarmAudioPath));
      tags.add(tag);
    }
    for (var item in _inventory) {
      item.matches = 0;
      for (var product in item.products) {
        for (var tag in tags) {
          var rfid = "EPC:${product.rfid}";
          if (rfid == tag.epc) {
            item.matches++;
          }
        }
      }
    }
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
      _isLoading = false;
    });
  }

  Future<List<InventoryPosition>> fetchInventory() async {
    final response = await constants.feathersApp
        .service('rpc')
        .create({'method': 'GetInventory', 'params': {}});
    if (response["error"] != null) {
      throw Exception(response["error"]);
    }
    var result = response["result"] as Map<String, dynamic>;
    var positions = result["inventory"] as List<dynamic>;
    return positions
        .map<InventoryPosition>((e) => InventoryPosition.fromJson(e))
        .toList();
  }

  Widget mainUI(BuildContext context) {
    if (_isLoading || !_isConnected) {
      return const CircularProgressIndicator();
    }
    return Column(
      children: _inventory.map<Widget>((item) {
        return Card(
          color: Colors.blue.shade50,
          child: Container(
            alignment: Alignment.center,
            padding: const EdgeInsets.all(8.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  item.title,
                  style: const TextStyle(color: Colors.blue),
                ),
                Text(
                  '${item.matches} / ${item.products.length}',
                  style: const TextStyle(color: Colors.blue),
                ),
              ],
            ),
          ),
        );
      }).toList(),
    );
  }

  Future<void> onPressed() async {
    rfid.closeAll();
    List<Map<String, int>> positions = [];
    for (var item in _inventory) {
      if (item.matches > 0) {
        positions.add({"positionId": item.id, "found": item.matches});
      }
    }
    if (positions.isEmpty) {
      return;
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
      ),
    );
  }
}
