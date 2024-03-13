import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/constants.dart' as constants;

import 'package:mobile/models/user.dart';

class LoginPage extends StatelessWidget {
  const LoginPage({Key? key}) : super(key: key);

  Widget buildForm(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        Text(
          FlutterI18n.translate(context, "login.title"),
          style: const TextStyle(
            fontSize: 36,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          FlutterI18n.translate(context, "login.subtitle"),
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w400,
            color: Colors.grey,
          ),
        ),
        const SizedBox(
          height: 40,
        ),
        FutureBuilder(
          future: constants.feathersApp.service("users").find({}),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const CircularProgressIndicator();
            }
            List<dynamic> data = snapshot.data?["data"];
            List<User> users = data.map<User>((e) => User.fromJson(e)).toList();
            return LoginForm(
              users: users,
            );
          },
        )
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Container(
          padding: const EdgeInsets.only(left: 40, right: 30, top: 20),
          child: buildForm(context),
        ),
      ),
    );
  }
}

class LoginForm extends StatefulWidget {
  final List<User> users;

  const LoginForm({Key? key, required this.users}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _LoginFormState();
  }
}

class _LoginFormState extends State<LoginForm> {
  late final List<User> users;
  String userId = '1';
  String password = '';

  @override
  void initState() {
    super.initState();
    users = widget.users;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        DropdownButtonFormField<String>(
          isExpanded: true,
          decoration: InputDecoration(
            border: const OutlineInputBorder(),
            hintText: FlutterI18n.translate(context, "login.user"),
          ),
          items: users.map((value) {
            return DropdownMenuItem<String>(
              value: value.id.toString(),
              child: Text("${value.firstName} ${value.lastName}"),
            );
          }).toList(),
          onChanged: (v) {
            if (v == null) {
              return;
            }
            setState(() {
              userId = v;
            });
          },
          value: userId,
        ),
        const SizedBox(
          height: 20,
        ),
        TextField(
          decoration: InputDecoration(
            border: const OutlineInputBorder(),
            hintText: FlutterI18n.translate(context, "login.password"),
          ),
          onChanged: (v) {
            setState(() {
              password = v;
            });
          },
        ),
        const SizedBox(
          height: 20,
        ),
        ElevatedButton(
          onPressed: () {
            constants.feathersApp.authenticate({
              "strategy": "local",
              "id": userId,
              "password": password,
            }).then((res) {
              constants.isLoggedIn = true;
              GoRouter.of(context).goNamed("home");
            }).catchError((e) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                    FlutterI18n.translate(context, "login.error"),
                  ),
                ),
              );
            });
          },
          style: ElevatedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 20),
              backgroundColor: Theme.of(context).primaryColor,
              minimumSize: const Size.fromHeight(36),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
              elevation: 0),
          child: Text(
            FlutterI18n.translate(context, "login.button"),
            style: const TextStyle(
              color: Colors.white,
            ),
          ),
        )
      ],
    );
  }
}
