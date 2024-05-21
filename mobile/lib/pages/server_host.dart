import 'package:device_info_plus/device_info_plus.dart';
import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/constants.dart';

import 'package:network_info_plus/network_info_plus.dart';
import 'package:lan_scanner/lan_scanner.dart';
import 'package:dart_ping/dart_ping.dart';

class ServerHostPage extends StatefulWidget {
  const ServerHostPage({Key? key}) : super(key: key);

  @override
  createState() => _ServerHostPageState();
}

class _ServerHostPageState extends State<ServerHostPage> {
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  String ipAddr = "";

  Future<bool> checkAndSaveAddress(String uri) async {
    final uriParsed = Uri.parse(uri);
    final ip = uriParsed.host;
    final ping = Ping(ip, count: 1);
    final result = await ping.stream.first;
    print(result);
    print(ip);
    if (result.error != null) {
      return false;
    }
    await _storage.write(key: "server-uri", value: uri);
    init(uri);
    return true;
  }

  @override
  void initState() {
    super.initState();
    _storage.read(key: "server-uri").then((value) {
      if (value != null) {
        setState(() {
          ipAddr = value;
        });
      }
    });
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
                  labelText: FlutterI18n.translate(context, "setup.address"),
                ),
                onChanged: (v) {
                  ipAddr = v;
                },
                onSubmitted: (v) {
                  setState(() {
                    ipAddr = v;
                  });
                },
              )
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
            checkAndSaveAddress(ipAddr).then((value) {
              if (value) {
                context.goNamed("settings");
              } else {
                showDialog(
                  context: context,
                  builder: (context) {
                    return AlertDialog(
                      title: Text(FlutterI18n.translate(
                        context,
                        "setup.errors.default.title",
                      )),
                      content: Text(FlutterI18n.translate(
                        context,
                        "setup.errors.default.message",
                      )),
                      actions: [
                        TextButton(
                          onPressed: () {
                            Navigator.of(context).pop();
                          },
                          child: Text(FlutterI18n.translate(
                            context,
                            "setup.errors.default.ok",
                          )),
                        ),
                      ],
                    );
                  },
                );
              }
            });
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
