import 'package:device_info_plus/device_info_plus.dart';
import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/constants.dart';

import 'package:network_info_plus/network_info_plus.dart';
import 'package:lan_scanner/lan_scanner.dart';
import 'package:dart_ping/dart_ping.dart';
import 'package:graphql_flutter/graphql_flutter.dart';

class SetupPage extends StatefulWidget {
  const SetupPage({Key? key}) : super(key: key);

  @override
  createState() => _SetupPageState();
}

class _SetupPageState extends State<SetupPage> {
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  bool _isLoading = true;
  String uri = "";

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

  Future<(String, bool)> checkIpAddress() async {
    var ip = await _storage.read(key: "server-uri");
    if (ip == null) {
      return ("", false);
    }
    final ping = Ping(ip, count: 1);
    final result = await ping.stream.first;
    return (ip, result.error == null);
  }

  @override
  void initState() {
    super.initState();
    checkIpAddress().then((value) {
      var (ip, connected) = value;
      if (connected) {
        context.goNamed("login");
        init(ip);
      } else {
        setState(() {
          _isLoading = false;
        });
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
              if (_isLoading)
                const CircularProgressIndicator()
              else
                TextField(
                  controller: TextEditingController()..text = uri,
                  decoration: InputDecoration(
                    labelText: FlutterI18n.translate(context, "setup.address"),
                  ),
                  onChanged: (v) {
                    uri = v;
                  },
                  onSubmitted: (v) {
                    setState(() {
                      uri = v;
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
            if (uri.isEmpty) {
              return;
            }
            _storage.write(key: "server-uri", value: uri);

            init(uri);
            context.goNamed("login");
          },
          style: ButtonStyle(
            backgroundColor: uri.isEmpty
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
