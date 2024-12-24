import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:go_router/go_router.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:mobile/constants.dart';

import 'package:mobile/services/users/model.dart';
import 'package:mobile/services/users/service.dart';

class ErrorWidget extends StatelessWidget {
  final String message;

  const ErrorWidget({Key? key, required this.message}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          FlutterI18n.translate(context, "login.errors.default"),
          style: const TextStyle(
            fontSize: 24,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(message),
        const SizedBox(
          height: 20,
        ),
        ElevatedButton(
          onPressed: () {
            GoRouter.of(context).goNamed("login");
          },
          style: ElevatedButton.styleFrom(
            padding: const EdgeInsets.symmetric(vertical: 20),
            backgroundColor: Theme.of(context).primaryColor,
            minimumSize: const Size.fromHeight(36),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            elevation: 0,
          ),
          child: Text(
            FlutterI18n.translate(context, "login.buttons.retry"),
            style: const TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.w500,
            ),
          ),
        )
      ],
    );
  }
}

class LoginPage extends StatefulWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return LoginPageState();
  }
}

class LoginPageState extends State<LoginPage> {
  Future<bool> isAuthenticated(BuildContext context) async {
    const storage = FlutterSecureStorage();
    var token = await storage.read(key: "jwt");
    return token != null && !JwtDecoder.isExpired(token);
  }

  @override
  void initState() {
    super.initState();
    isAuthenticated(context).then((res) {
      if (res) {
        GoRouter.of(context).goNamed("home");
      }
    });
  }

  Widget buildForm(BuildContext context) {
    return SingleChildScrollView(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          FutureBuilder(
            future: usersService
                .find(FindParams(
                  limit: 50,
                  offset: 0,
                ))
                .then((res) => res.data),
            builder: (context, snapshot) {
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const CircularProgressIndicator();
              }
              if (snapshot.hasError) {
                return ErrorWidget(message: snapshot.error.toString());
              }
              return Column(
                children: [
                  LoginForm(
                    users: snapshot.data!,
                  )
                ],
              );
            },
          )
        ],
      ),
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

  @override
  void initState() {
    super.initState();
    users = widget.users;
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisAlignment: MainAxisAlignment.start,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          FlutterI18n.translate(context, "login.chooseUser.title"),
          style: const TextStyle(
            fontSize: 36,
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          FlutterI18n.translate(context, "login.chooseUser.subtitle"),
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w400,
            color: Colors.grey,
          ),
        ),
        ListView(
          shrinkWrap: true,
          children: users.map((e) {
            return ListTile(
              contentPadding: const EdgeInsets.all(0),
              leading: const Icon(Icons.person, size: 40),
              title: Text("${e.firstName} ${e.lastName}"),
              subtitle: Text(e.role),
              onTap: () {
                context.pushNamed(
                  "enter",
                  pathParameters: {"userId": e.id.toString()},
                );
              },
            );
          }).toList(),
        ),
      ],
    );
  }
}

class EnterPassword extends StatefulWidget {
  final String userId;

  const EnterPassword({Key? key, required this.userId}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _EnterPasswordState();
  }
}

class _EnterPasswordState extends State<EnterPassword> {
  late final userId = widget.userId;
  String password = '';

  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(""),
      ),
      body: Container(
        padding: const EdgeInsets.only(left: 30, right: 30),
        child: FutureBuilder(
          future: usersService.get(int.parse(widget.userId)),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return const Center(
                child: CircularProgressIndicator(),
              );
            }

            if (snapshot.hasError) {
              return ErrorWidget(message: snapshot.error.toString());
            }

            var user = snapshot.data!;

            return Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  FlutterI18n.translate(context, "login.enterPassword.title"),
                  style: const TextStyle(
                    fontSize: 36,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                Text(
                  FlutterI18n.translate(context, "login.enterPassword.subtitle",
                      translationParams: {
                        "username": "${user.firstName} ${user.lastName}"
                      }),
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w400,
                    color: Colors.grey,
                  ),
                ),
                const SizedBox(
                  height: 40,
                ),
                TextField(
                  decoration: InputDecoration(
                    border: const OutlineInputBorder(),
                    hintText: FlutterI18n.translate(context, "login.password"),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: BorderSide(
                        color: Colors.grey.shade300,
                        width: 1,
                      ),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(8),
                      borderSide: BorderSide(
                        color: Theme.of(context).primaryColor,
                        width: 1,
                      ),
                    ),
                  ),
                  onChanged: (v) {
                    password = v;
                  },
                  obscureText: true,
                  enableSuggestions: false,
                  autocorrect: false,
                ),
                const SizedBox(
                  height: 20,
                ),
                ElevatedButton(
                  onPressed: () {
                    authenticationService
                        .authenticate(user.id, password)
                        .then((res) {
                      GoRouter.of(context).goNamed("home");
                    }).catchError((e) {
                      print(e.toString());
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text(
                            FlutterI18n.translate(context, "login.errors.401"),
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
                      borderRadius: BorderRadius.circular(60),
                    ),
                    elevation: 0,
                  ),
                  child: Text(
                    FlutterI18n.translate(context, "login.button"),
                    style: const TextStyle(
                      color: Colors.white,
                    ),
                  ),
                )
              ],
            );
          },
        ),
      ),
    );
  }
}
