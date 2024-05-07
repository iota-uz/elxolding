import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:mobile/components/footer_button.dart';
import 'package:mobile/constants.dart';
import 'package:mobile/feathers/types.dart';
import 'package:mobile/feathers/models/position.dart';
import 'package:mobile/utils/rfid.dart';
import 'package:rfid_c72_plugin/tag_epc.dart';

class PolygraphyPage extends StatefulWidget {
  const PolygraphyPage({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _PolygraphyPageState();
  }
}

class _PolygraphyPageState extends State<PolygraphyPage> {
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
          "polygraphy.selectPosition.placeholder",
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
    var res = await positionsService.find({});
    return res.data;
  }

  Future<RpcResponse> createProducts() {
    return rpcService.createProductsFromTags(
      positionId!,
      _data.map((e) => e.epc).toList(),
    );
  }

  void onCreatePressed() {
    if (positionId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(FlutterI18n.translate(
              context, "polygraphy.errors.positionIdEmpty")),
        ),
      );
    }
    if (_data.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
              FlutterI18n.translate(context, "polygraphy.errors.tagsEmpty")),
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
            content: Text(FlutterI18n.translate(context, "polygraphy.success")),
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
              '${FlutterI18n.translate(context, "polygraphy.errors.products.create")}: ${e.toString()}',
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
              '${FlutterI18n.translate(context, "polygraphy.scanned")}: ${_data.length}',
            ),
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
    if (_isScanning) {
      rfid.stop();
    } else {
      rfid.readContinuous();
    }
    _isScanning = !_isScanning;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(FlutterI18n.translate(context, "polygraphy.title")),
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
        height: 155,
        child: Container(
          padding: const EdgeInsets.only(left: 20, right: 20),
          child: Column(
            children: [
              FooterButton(
                onPressed: onScanPressed,
                secondary: true,
                text: _isScanning
                    ? FlutterI18n.translate(context, "polygraphy.footer.stop")
                    : FlutterI18n.translate(context, "polygraphy.footer.start"),
              ),
              const SizedBox(height: 15),
              FooterButton(
                onPressed: onCreatePressed,
                text:
                    FlutterI18n.translate(context, "polygraphy.footer.create"),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
