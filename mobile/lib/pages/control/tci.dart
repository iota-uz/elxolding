import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:mobile/constants.dart' as constants;
import 'package:mobile/feathers/types.dart';
import 'package:mobile/models/position.dart';
import 'package:mobile/utils/rfid.dart';
import 'package:rfid_c72_plugin/tag_epc.dart';

class TciPage extends StatefulWidget {
  const TciPage({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _TciPageState();
  }
}

class _TciPageState extends State<TciPage> {
  int? positionId;
  final List<TagEpc> _data = [];
  List<Position> _positions = [];
  bool _isLoading = false;
  bool _isScanning = false;
  RfidWrapper rfid = RfidWrapper();

  @override
  void initState() {
    super.initState();
    initPlatformState();
  }

  @override
  void dispose() {
    super.dispose();
    rfid.closeAll();
  }

  bool isScanned(TagEpc tag) {
    for (var item in _data) {
      if (item.epc == tag.epc) {
        return true;
      }
    }
    return false;
  }

  Future<void> initPlatformState() async {
    rfid.onConnected = (bool connected) {};
    rfid.onTagsUpdate = (List<TagEpc> tags) {
      setState(() {
        for (var tag in tags) {
          if (!isScanned(tag)) {
            rfid.beep();
            _data.add(tag);
          }
        }
      });
    };
    await rfid.connect();
    var positions = await fetchPositions();

    setState(() {
      _isLoading = false;
      _positions = positions;
    });
  }

  Widget dropdownList(BuildContext context) {
    return DropdownButtonFormField<int>(
      isExpanded: true,
      decoration: InputDecoration(
        border: const OutlineInputBorder(),
        hintText: FlutterI18n.translate(
          context,
          "tci.selectPosition.placeholder",
        ),
      ),
      items: _positions.map((value) {
        return DropdownMenuItem<int>(
          value: value.id,
          child: Text(value.title),
        );
      }).toList(),
      onChanged: (v) {
        if (v == null) {
          return;
        }
        setState(() {
          positionId = v;
        });
      },
      value: positionId,
    );
  }

  Future<List<Position>> fetchPositions() async {
    var res = await constants.feathersApp.service("positions").find({});
    List<dynamic> data = res["data"];
    return data.map<Position>((e) => Position.fromJson(e)).toList();
  }

  Future<RpcResponse> createProducts() async {
    var res = await constants.feathersApp.rpc("CreateProductsWithTags", {
      "positionId": positionId,
      "tags": _data.map((e) => e.epc).toList(),
    });
    return res;
  }

  void onCreatePressed() {
    if (positionId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
              FlutterI18n.translate(context, "tci.errors.positionIdEmpty")),
        ),
      );
    }
    if (_data.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(FlutterI18n.translate(context, "tci.errors.tagsEmpty")),
        ),
      );
    }
    createProducts().then((value) {
      if (value.hasError()) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(value.error["message"]),
          ),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(FlutterI18n.translate(context, "tci.success")),
          ),
        );
        setState(() {
          _data.clear();
        });
      }
    }).catchError((e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
              '${FlutterI18n.translate(context, "tci.errors.products.create")}: ${e.toString()}',
              style: const TextStyle(color: Colors.red)),
        ),
      );
    });
  }

  Widget mainUI(BuildContext context) {
    if (_isLoading) {
      return const CircularProgressIndicator();
    }
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        dropdownList(context),
        const SizedBox(height: 20),
        Row(
          children: [
            Text(
                '${FlutterI18n.translate(context, "tci.scanned")}: ${_data.length}'),
            const Spacer(),
            IconButton(
              onPressed: () {
                setState(() {
                  _data.clear();
                  rfid.clear();
                });
              },
              icon: const Icon(Icons.close),
            ),
          ],
        ),
        const SizedBox(height: 20),
      ],
    );
  }

  void onScanPressed() async {
    if (await rfid.isStarted) {
      _isScanning = false;
      rfid.stop();
    } else {
      _isScanning = true;
      rfid.readContinuous();
    }
  }

  Widget styleButton(BuildContext context) {
    var style = const TextStyle(
      fontSize: 18,
      color: Colors.black,
    );

    var stopText = Text(
      FlutterI18n.translate(context, "tci.footer.stop"),
      style: style,
    );

    var startText = Text(
      FlutterI18n.translate(context, "tci.footer.start"),
      style: style,
    );

    return ElevatedButton(
      onPressed: onScanPressed,
      style: ElevatedButton.styleFrom(
        padding: const EdgeInsets.symmetric(vertical: 20),
        backgroundColor: Colors.white,
        minimumSize: const Size.fromHeight(36),
        shape: RoundedRectangleBorder(
          side: BorderSide(color: Colors.grey.shade400),
          borderRadius: BorderRadius.circular(80),
        ),
        elevation: 0,
      ),
      child: _isScanning ? stopText : startText,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(FlutterI18n.translate(context, "tci.title")),
      ),
      body: SingleChildScrollView(
        child: Center(
          child: Container(
            padding: const EdgeInsets.only(left: 20, right: 20, top: 20),
            child: mainUI(context),
          ),
        ),
      ),
      bottomNavigationBar: BottomAppBar(
        height: 165,
        child: Container(
          padding: const EdgeInsets.only(left: 20, right: 20, bottom: 20),
          child: Column(
            children: [
              styleButton(context),
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: onCreatePressed,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 20),
                  backgroundColor: Theme.of(context).primaryColor,
                  minimumSize: const Size.fromHeight(36),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(80),
                  ),
                  elevation: 0,
                ),
                child: Text(
                  FlutterI18n.translate(context, "tci.footer.create"),
                  style: const TextStyle(fontSize: 18),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
