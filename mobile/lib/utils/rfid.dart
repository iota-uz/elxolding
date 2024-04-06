import 'package:flutter/services.dart';
import 'package:rfid_c72_plugin/rfid_c72_plugin.dart';
import 'package:rfid_c72_plugin/tag_epc.dart';

class RfidWrapper {
  String _platformVersion = '';
  List<TagEpc> _data = [];
  bool _isConnected = false;
  bool _isLoading = false;

  closeAll() async {
    if (_platformVersion == "IOS") {
      return;
    }
    await RfidC72Plugin.stopScan;
    await RfidC72Plugin.close;
  }

  Future<void> connect() async {
    String platformVersion;
    try {
      platformVersion = (await RfidC72Plugin.platformVersion)!;
    } on PlatformException {
      platformVersion = '-';
    }
    if (platformVersion.contains("android")) {
      _platformVersion = "Android";
    } else if (platformVersion.contains("iOS")) {
      _platformVersion = "IOS";
    } else {
      _platformVersion = platformVersion;
    }
    if (_platformVersion == "Android") {
      RfidC72Plugin.connectedStatusStream
          .receiveBroadcastStream()
          .listen(updateIsConnected);
      RfidC72Plugin.tagsStatusStream
          .receiveBroadcastStream()
          .listen(updateTags);
      await RfidC72Plugin.connect;
    }
    _isLoading = false;
  }

  readContinuous(void Function(List<TagEpc>) callback) async {
    if (_platformVersion == "IOS") {
      callback([
        TagEpc(
          id: '1',
          epc: "E28011606000000000000000",
          rssi: "-50",
          count: '1',
        )
      ]);
      return;
    }
    await RfidC72Plugin.startContinuous;
    RfidC72Plugin.tagsStatusStream.receiveBroadcastStream().listen(
          (event) => callback(TagEpc.parseTags(event)),
        );
  }

  Future<TagEpc> readSingleTag() async {
    if (_platformVersion == "IOS") {
      return TagEpc(
        id: '1',
        epc: "E28011606000000000000000",
        rssi: "-50",
        count: '1',
      );
    }
    bool started = (await RfidC72Plugin.startSingle)!;
    if (!started) {
      throw Exception("Failed to start single read");
    }
    return _data.last;
  }

  void updateTags(dynamic result) {
    _data = TagEpc.parseTags(result);
  }

  void updateIsConnected(dynamic isConnected) {
    _isConnected = isConnected;
  }
}
