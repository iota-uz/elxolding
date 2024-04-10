import 'package:flutter/services.dart';
import 'package:rfid_c72_plugin/rfid_c72_plugin.dart';
import 'package:rfid_c72_plugin/tag_epc.dart';

class RfidWrapper {
  String _platformVersion = '';

  Function(List<TagEpc>)? onTagsUpdate;
  Function(bool)? onConnected;

  closeAll() async {
    if (_platformVersion == "IOS") {
      return;
    }
    onTagsUpdate = null;
    onConnected = null;
    await RfidC72Plugin.stop;
    await RfidC72Plugin.close;
  }

  Future<void> connect() async {
    String platformVersion;
    try {
      platformVersion = (await RfidC72Plugin.platformVersion)!;
    } on PlatformException {
      platformVersion = '-';
    }
    if (platformVersion.contains("Android")) {
      _platformVersion = "Android";
    } else if (platformVersion.contains("iOS")) {
      _platformVersion = "IOS";
    } else {
      _platformVersion = platformVersion;
    }
    if (_platformVersion == "Android") {
      RfidC72Plugin.connectedStatusStream
          .receiveBroadcastStream()
          .listen((event) {
        if (onConnected == null) {
          return;
        }
        onConnected!(event);
      });
      RfidC72Plugin.tagsStatusStream.receiveBroadcastStream().listen((event) {
        if (onTagsUpdate == null) {
          return;
        }
        onTagsUpdate!(TagEpc.parseTags(event));
      });
      await RfidC72Plugin.connect;
    }
  }

  readContinuous() async {
    if (onTagsUpdate == null) {
      throw Exception("onTagsUpdate is not set");
    }
    if (_platformVersion == "IOS") {
      onTagsUpdate!([
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
  }

  Future<void> readSingleTag() async {
    if (onTagsUpdate == null) {
      throw Exception("onTagsUpdate is not set");
    }
    if (_platformVersion == "IOS") {
      onTagsUpdate!([
        TagEpc(
          id: '1',
          epc: "E28011606000000000000000",
          rssi: "-50",
          count: '1',
        )
      ]);
      return;
    }
    bool started = (await RfidC72Plugin.startSingle)!;
    if (!started) {
      throw Exception("Failed to start single read");
    }
  }
}
