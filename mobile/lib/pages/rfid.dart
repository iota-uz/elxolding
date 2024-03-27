import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:mobile/constants.dart' as constants;
import 'package:mobile/models/position.dart';
import 'package:rfid_c72_plugin/rfid_c72_plugin.dart';
import 'package:rfid_c72_plugin/tag_epc.dart';

class RfidPage extends StatefulWidget {
  const RfidPage({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _RfidPageState();
  }
}

class _RfidPageState extends State<RfidPage> {
  int? positionId;

  String _platformVersion = 'Unknown';
  final List<String> _logs = [];
  List<TagEpc> _data = [];
  bool _isConnected = false;
  bool _isLoading = false;

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
    await RfidC72Plugin.connectBarcode; //connect barcode
    if (!mounted) return;

    setState(() {
      _platformVersion = platformVersion;
      _isLoading = false;
    });
  }

  void log(String msg) {
    setState(() {
      _logs.add(msg);
    });
  }

  void updateTags(dynamic result) {
    log('update tags');
    setState(() {
      _data = TagEpc.parseTags(result);
    });
  }

  void updateIsConnected(dynamic isConnected) {
    log('connected $isConnected');
    //setState(() {
    _isConnected = isConnected;
    //});
  }

  Widget dropdownList(BuildContext context, List<Position> positions) {
    return DropdownButtonFormField<int>(
      isExpanded: true,
      decoration: InputDecoration(
        border: const OutlineInputBorder(),
        hintText: FlutterI18n.translate(context, "rfid.selectPosition"),
      ),
      items: positions.map((value) {
        return DropdownMenuItem<int>(
          value: value.id,
          child: Text(value.title),
        );
      }).toList(),
      onChanged: (v) {
        if (v == null) {
          return;
        }
        setState(() {
          positionId = v;
        });
      },
      value: positionId,
    );
  }

  Future<List<Position>> fetchPositions() async {
    var res = await constants.feathersApp.service("positions").find({});
    List<dynamic> data = res["data"];
    return data.map<Position>((e) => Position.fromJson(e)).toList();
  }

  Widget tagsList(BuildContext context) {
    return _data.isEmpty
        ? const Text('Начните сканирование меток')
        : Column(
            children: _data
                .map(
                  (TagEpc tag) => Card(
                    color: Colors.blue.shade50,
                    child: Container(
                      alignment: Alignment.center,
                      padding: const EdgeInsets.all(8.0),
                      child: Text(
                        tag.epc,
                        style: const TextStyle(color: Colors.blue),
                      ),
                    ),
                  ),
                )
                .toList(),
          );
  }

  Future<void> createProducts() async {
    var res = await constants.feathersApp.service("rpc").create({
      "method": "CreateProductsWithTags",
      "params": {
        "positionId": positionId,
        "tags": _data.map((e) => e.epc).toList(),
      }
    });
  }

  Widget mainUI(BuildContext context) {
    if (_isLoading) {
      return const CircularProgressIndicator();
    }
    return Column(
      children: [
        FutureBuilder(
          future: fetchPositions(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const CircularProgressIndicator();
            }
            if (snapshot.hasError) {
              return Text(snapshot.error.toString());
            }
            var positions = snapshot.data!;
            return dropdownList(context, positions);
          },
        ),
        const SizedBox(height: 20),
        tagsList(context),
        const SizedBox(height: 20),
        ElevatedButton(
          onPressed: () async {
            await RfidC72Plugin.startSingle;
          },
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: 20),
            backgroundColor: Colors.white,
            minimumSize: const Size.fromHeight(36),
            shape: RoundedRectangleBorder(
              side: const BorderSide(color: Colors.black),
              borderRadius: BorderRadius.circular(12),
            ),
            elevation: 0,
          ),
          child: const Text(
            'Сканировать',
            style: TextStyle(
              fontSize: 18,
              color: Colors.black,
            ),
          ),
        ),
        const SizedBox(height: 20),
        ElevatedButton(
          onPressed: () {
            if (positionId == null) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Выберите наименование'),
                ),
              );
            }
            if (_data.isEmpty) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Сначала отсканируйте метки'),
                ),
              );
            }
            createProducts().then((value) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text('Продукты созданы'),
                ),
              );
              setState(() {
                _data.clear();
              });
            });
          },
          style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 20),
              backgroundColor: Theme.of(context).primaryColor,
              minimumSize: const Size.fromHeight(36),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              elevation: 0),
          child: const Text(
            'Создать',
            style: TextStyle(fontSize: 18),
          ),
        )
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Отсканируйте метки'),
      ),
      body: Center(
        child: Container(
          padding: const EdgeInsets.only(left: 20, right: 20, top: 20),
          child: mainUI(context),
        ),
      ),
    );
  }
}
