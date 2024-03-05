import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';

class RfidPage extends StatefulWidget {
  const RfidPage({Key? key}) : super(key: key);

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
        title: const Text('RFID'),
      ),
      body: Center(
        child: Container(
          padding: const EdgeInsets.only(left: 40, right: 30, top: 20),
          child: const Column(
            children: [
              Text('RFID'),
            ],
          ),
        ),
      ),
    );
  }
}
