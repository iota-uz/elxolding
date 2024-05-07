import 'package:flutter/services.dart';
import 'package:flutter_beep/flutter_beep.dart';
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

  stop() async {
    if (_platformVersion == "IOS") {
      return;
    }
    await RfidC72Plugin.stop;
  }

  void beep() {
    FlutterBeep.beep();
  }

  Future<bool> get isStarted async {
    if (_platformVersion == "IOS") {
      return false;
    }
    var started = await RfidC72Plugin.isStarted;
    return started ?? false;
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
      RfidC72Plugin.isEmptyTags
    } else {
      onConnected!(true);
    }
  }

  Future<void> clear() async {
    if (_platformVersion == "IOS") {
      return;
    }
    await RfidC72Plugin.clearData;
  }

  readContinuous() async {
    if (onTagsUpdate == null) {
      throw Exception("onTagsUpdate is not set");
    }
    if (_platformVersion == "IOS") {
      () async {
        while (true) {
          await Future.delayed(const Duration(milliseconds: 200));
          if (onTagsUpdate == null) {
            return;
          }
          onTagsUpdate!([
            TagEpc(
              id: '1',
              epc: "E28011606000${DateTime.now().millisecondsSinceEpoch}",
              rssi: "-50",
              count: '1',
            )
          ]);
        }
      }();
      return;
    }
    await RfidC72Plugin.startContinuous;
  }

  setPower(int power) async {
    if (_platformVersion == "IOS") {
      return;
    }
    await RfidC72Plugin.setWorkArea('2');
    await RfidC72Plugin.setPowerLevel(power.toString());
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
