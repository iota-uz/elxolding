import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:go_router/go_router.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _LoginPageState();
  }
}

class User {
  final int id;
  final String name;

  User(this.id, this.name);
}

class _LoginPageState extends State<LoginPage> {
  String userId = '1';
  String password = '';
  List<User> users = [
    User(1, 'Диер Хайдаров'),
    User(2, 'Иван Васильевич'),
    User(3, 'Валентин Васильев')
  ];

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
        DropdownButtonFormField<String>(
          isExpanded: true,
          decoration: InputDecoration(
            border: const OutlineInputBorder(),
            hintText: FlutterI18n.translate(context, "login.user"),
          ),
          items: users.map((value) {
            return DropdownMenuItem<String>(
              value: value.id.toString(),
              child: Text(value.name),
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
            context.goNamed("home");
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
