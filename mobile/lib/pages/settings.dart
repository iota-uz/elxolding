import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:go_router/go_router.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _SettingsPageState();
  }
}

class _SettingsPageState extends State<SettingsPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(FlutterI18n.translate(context, "settings.title")),
      ),
      body: Center(
        child: Container(
          padding: const EdgeInsets.only(left: 40, right: 30, top: 20),
          child: Column(
            children: [
              ListTile(
                leading: const Icon(Icons.language),
                title: Text(FlutterI18n.translate(context, "settings.language")),
                trailing: const Icon(Icons.arrow_forward_ios),
                onTap: () {
                  context.pushNamed("language-select");
                },
              )
            ],
          ),
        ),
      ),
    );
  }
}
