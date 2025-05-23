import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:rfid_c72_plugin/rfid_c72_plugin.dart';
import 'package:rfid_c72_plugin/tag_epc.dart';

class RfidScanner extends StatefulWidget {
  const RfidScanner({Key? key}) : super(key: key);

  @override
  State<RfidScanner> createState() => _RfidScannerState();
}

class _RfidScannerState extends State<RfidScanner> {
  String _platformVersion = 'Unknown';
  final bool _isHaveSavedData = false;
  final bool _isStarted = false;
  final bool _isEmptyTags = false;
  bool _isConnected = false;
  bool _isLoading = true;
  int _totalEPC = 0, _invalidEPC = 0, _scannedEPC = 0;

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

// Platform messages are asynchronous, so we initialize in an async method.
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
    if (!mounted) return;

    setState(() {
      _platformVersion = platformVersion;
      _isLoading = false;
    });
  }

  List<TagEpc> _data = [];
  final List<String> _EPC = [];

  void updateTags(dynamic result) async {
    setState(() {
      _data = TagEpc.parseTags(result);
      _totalEPC = _data.toSet().toList().length;
    });
  }

  void updateIsConnected(dynamic isConnected) {
//setState(() {
    _isConnected = isConnected;
//});
  }

  bool _isContinuousCall = false;
  bool _is2dscanCall = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Rfid Reader C72'),
      ),
      body: SingleChildScrollView(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            const Card(
              child: Padding(
                padding: EdgeInsets.all(3.0),
                child: Icon(
                  Icons.barcode_reader,
                  size: 100,
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 12.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: <Widget>[
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(29.0),
                      ),
                    ),
                    child: const Text(
                      'Start Single Reading',
                      style: TextStyle(color: Colors.white),
                    ),
                    onPressed: () async {
                      var started = await RfidC72Plugin.startSingle;
                      print('Started: $started');
                    },
                  ),
                  ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor:
                            _isContinuousCall ? Colors.red : Colors.green,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(29.0),
                        ),
                      ),
                      child: _isContinuousCall
                          ? const Text(
                              'Stop Continuous Reading',
                              style: TextStyle(color: Colors.white),
                            )
                          : const Text(
                              'Start Continuous Reading',
                              style: TextStyle(color: Colors.white),
                            ),
                      onPressed: () async {
                        bool? isStarted = _isContinuousCall == true
                            ? await RfidC72Plugin.stop
                            : await RfidC72Plugin.startContinuous;
                        setState(() {
                          _isContinuousCall = !_isContinuousCall;
                        });
                      }),
                ],
              ),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.blueAccent,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(29.0),
                ),
              ),
              child: const Text(
                'Clear Data',
                style: TextStyle(color: Colors.white),
              ),
              onPressed: () async {
                await RfidC72Plugin.clearData;
                setState(() {
                  _data.clear();
                });
              },
            ),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: <Widget>[
                ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor:
                          _is2dscanCall ? Colors.red : Colors.green,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(29.0),
                      ),
                    ),
                    child: Text(
                      _is2dscanCall
                          ? 'Stop 2D Barcode scan'
                          : 'Start 2D Barcode scan',
                      style: const TextStyle(color: Colors.white),
                    ),
                    onPressed: () async {
                      setState(() {
                        _is2dscanCall = !_is2dscanCall;
                      });
                      if (_is2dscanCall) {
                        await RfidC72Plugin.scanBarcode;
                        String? scannedCode = await RfidC72Plugin.readBarcode;
                        setState(() {
                          _data.add(TagEpc(
                            epc: scannedCode ?? "N/A",
                            id: '',
                            count: '',
                            rssi: '',
                          ));
                          _totalEPC = _data.toSet().toList().length;
                        });
                      } else {
                        await RfidC72Plugin.stopScan;
                      }
                    }),
              ],
            ),
            Container(
              width: MediaQuery.of(context).size.width,
              height: 50,
              color: Colors.blue[400],
              child: Center(
                child: Text(
                  'Total EPC: $_totalEPC',
                ),
              ),
            ),
            const SizedBox(height: 10),
            ..._data.map(
              (TagEpc tag) {
                _EPC.add(tag.epc.replaceAll(RegExp('EPC:'), ''));
                return Card(
                  color: Colors.blue.shade50,
                  child: Container(
                    width: 330,
                    alignment: Alignment.center,
                    padding: const EdgeInsets.all(8.0),
                    child: Text(
                      'Tag: ${tag.epc.replaceAll(RegExp('EPC:'), '')}',
                      style: TextStyle(color: Colors.blue.shade800),
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: 22),
          ],
        ),
      ),
    );
  }
}
