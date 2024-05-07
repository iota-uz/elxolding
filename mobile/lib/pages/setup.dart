import 'package:device_info_plus/device_info_plus.dart';
import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/constants.dart';

import 'package:network_info_plus/network_info_plus.dart';
import 'package:lan_scanner/lan_scanner.dart';

class SetupPage extends StatefulWidget {
  const SetupPage({Key? key}) : super(key: key);

  @override
  createState() => _SetupPageState();
}

class _SetupPageState extends State<SetupPage> {
  FlutterSecureStorage _storage = FlutterSecureStorage();
  String ipAddr = "";

  Future<void> setupHosts() async {
    DeviceInfoPlugin deviceInfo = DeviceInfoPlugin();
    IosDeviceInfo iosInfo = await deviceInfo.iosInfo;
    if (!iosInfo.isPhysicalDevice) {
      return Future.value();
    }
    final info = NetworkInfo();
    var wifiIP = await info.getWifiIP();
    if (wifiIP == null) {
      throw Exception("No wifi IP found");
    }
    var subnet = ipToCSubnet(wifiIP);
    print(subnet);
    final scanner = LanScanner(
      debugLogging: true,
    );
    final List<Host> hosts = await scanner.quickIcmpScanSync(
      subnet,
      firstIP: 1,
      lastIP: 254,
      timeout: const Duration(milliseconds: 500),
    );
    print(hosts.length);
    hosts.forEach((host) {
      print("${host.internetAddress} ipv4");
      print("${host.pingTime} ms");
    });
    return Future.value();
  }

  @override
  void initState() {
    super.initState();
    _storage.read(key: "ipAddr").then((value) {
      if (value != null) {
        ipAddr = value;
      }
    });
    // setupHosts();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(FlutterI18n.translate(context, "setup.title")),
      ),
      body: Center(
        child: Container(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              TextField(
                controller: TextEditingController()..text = ipAddr,
                decoration: InputDecoration(
                  labelText: FlutterI18n.translate(context, "setup.ipAddr"),
                ),
                onChanged: (v) {
                  ipAddr = v;
                },
                onSubmitted: (v) {
                  setState(() {
                    ipAddr = v;
                  });
                },
              ),
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomAppBar(
        child: ElevatedButton(
          onPressed: () {
            if (ipAddr.isEmpty) {
              return;
            }
            _storage.write(key: "ipAddr", value: ipAddr);
            if (ipAddr.startsWith("https://")) {
              init(ipAddr);
            } else {
              init("http://$ipAddr:3030");
            }
            context.goNamed("login");
          },
          style: ButtonStyle(
            backgroundColor: ipAddr.isEmpty
                ? MaterialStateProperty.all(Colors.grey)
                : MaterialStateProperty.all(Theme.of(context).primaryColor),
          ),
          child: Text(
            FlutterI18n.translate(context, "setup.footer.save"),
            style: const TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.w500,
            ),
          ),
        ),
      ),
    );
  }
}
