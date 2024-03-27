import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/constants.dart' as constants;

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
          padding: const EdgeInsets.only(left: 30, right: 30, top: 80),
          child: Column(
            children: [
              const CircleAvatar(
                radius: 70,
                backgroundImage: AssetImage("assets/images/user-profile.png"),
              ),
              const SizedBox(height: 40),
              // avatar
              ListTile(
                leading: const Icon(Icons.person),
                title: Text(FlutterI18n.translate(context, "settings.profile")),
                trailing: const Icon(Icons.arrow_forward_ios),
                onTap: () {
                  // context.pushNamed("profile");
                },
              ),
              ListTile(
                leading: const Icon(Icons.language),
                title:
                    Text(FlutterI18n.translate(context, "settings.language")),
                trailing: const Icon(Icons.arrow_forward_ios),
                onTap: () {
                  context.pushNamed("language-select");
                },
              ),
              ListTile(
                leading: const Icon(Icons.logout),
                title: Text(FlutterI18n.translate(context, "settings.logout")),
                trailing: const Icon(Icons.arrow_forward_ios),
                onTap: () {
                  const storage = FlutterSecureStorage();
                  storage.delete(key: "jwt");
                  constants.isLoggedIn = false;
                  context.pushNamed("login");
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
