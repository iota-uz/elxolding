import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:go_router/go_router.dart';

class RfidPage extends StatefulWidget {
  const RfidPage({super.key});

  @override
  State<StatefulWidget> createState() {
    return _RfidPageState();
  }
}

class _RfidPageState extends State<RfidPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(FlutterI18n.translate(context, "control.title")),
      ),
      body: Center(
        child: Container(
          padding: const EdgeInsets.only(left: 20, right: 20, top: 20),
          child: Column(
            children: [
              ListTile(
                title: Text(
                  FlutterI18n.translate(context, "control.tci"),
                ),
                trailing: const Icon(Icons.arrow_forward_ios),
                onTap: () {
                  context.pushNamed("control-tci");
                },
              ),
              ListTile(
                title: Text(
                  FlutterI18n.translate(context, "control.polygraphy"),
                ),
                trailing: const Icon(Icons.arrow_forward_ios),
                onTap: () {
                  context.pushNamed("control-polygraphy");
                },
              )
            ],
          ),
        ),
      ),
    );
  }
}
