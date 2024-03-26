import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:rfid_c72_plugin/rfid_c72_plugin.dart';
import 'package:rfid_c72_plugin/tag_epc.dart';

class InventoryPage extends StatefulWidget {
  const InventoryPage({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _InventoryPageState();
  }
}

class _InventoryPageState extends State<InventoryPage> {
  String _platformVersion = 'Unknown';
  final List<String> _logs = [];
  bool _isConnected = false;
  bool _isLoading = true;

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

//Hopefully we free memory in the device.
  closeAll() {
    RfidC72Plugin.stopScan;
    RfidC72Plugin.close;
  }

  Future<void> initPlatformState() async {
    String platformVersion;
// Platform messages may fail, so we use a try/catch PlatformException.
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

  List<TagEpc> _data = [];

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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(FlutterI18n.translate(context, "inventory.title")),
      ),
      body: Center(
        child: Container(
          padding: const EdgeInsets.only(left: 40, right: 40, top: 20),
          child: Column(
            children: [
              ..._logs.map((String msg) => Card(
                    color: Colors.blue.shade50,
                    child: Container(
                      width: 330,
                      alignment: Alignment.center,
                      padding: const EdgeInsets.all(8.0),
                      child: Text(
                        'Log: $msg',
                        style: TextStyle(color: Colors.blue.shade800),
                      ),
                    ),
                  )),
              ..._data.map(
                (TagEpc tag) => Card(
                  color: Colors.blue.shade50,
                  child: Container(
                    width: 330,
                    alignment: Alignment.center,
                    padding: const EdgeInsets.all(8.0),
                    child: Text(
                      'Tag ${tag.epc} Count:${tag.count}',
                      style: TextStyle(color: Colors.blue.shade800),
                    ),
                  ),
                ),
              ),
              ElevatedButton(
                onPressed: () async {
                  bool? isStarted = await RfidC72Plugin.startSingle;
                  log('Start signle $isStarted');
                },
                style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 20),
                    backgroundColor: Theme.of(context).primaryColor,
                    minimumSize: const Size.fromHeight(40),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                    elevation: 0),
                child: Text(
                  FlutterI18n.translate(context, "inventory.new"),
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.w500,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
