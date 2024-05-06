import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:mobile/constants.dart';
import 'package:mobile/feathers/types.dart';
import 'package:mobile/feathers/models/product.dart';
import 'package:mobile/utils/rfid.dart';
import 'package:rfid_c72_plugin/tag_epc.dart';

class PolygraphyScanPage extends StatefulWidget {
  final String pk;

  const PolygraphyScanPage({Key? key, required this.pk}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _PolygraphyScanPageState();
  }
}

class _PolygraphyScanPageState extends State<PolygraphyScanPage> {
  final List<TagEpc> _data = [];
  List<Product> _products = [];
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
    var products = await fetchProducts();

    setState(() {
      _isLoading = false;
      _products = products;
    });
  }

  Future<List<Product>> fetchProducts() async {
    return productsService.find({
      "positionId": widget.pk,
    }).then((resp) => resp.data);
  }

  Future<RpcResponse> createProducts() async {
    var res = await rpcService.rpc("ValidateProducts", {
      "tags": _data.map((e) => e.epc).toList(),
    });
    return res;
  }

  void onCreatePressed() {
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
            style: const TextStyle(color: Colors.red),
          ),
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
        Text(
          '${FlutterI18n.translate(context, "polygraphy.awaiting")}: ${_products.length}',
        ),
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

  Widget scanButton(BuildContext context) {
    var style = const TextStyle(
      fontSize: 18,
      color: Colors.black,
    );
    var stopText = Text(
      FlutterI18n.translate(context, "polygraphy.footer.stop"),
      style: style,
    );
    var startText = Text(
      FlutterI18n.translate(context, "polygraphy.footer.start"),
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
        height: 165,
        child: Container(
          padding: const EdgeInsets.only(left: 20, right: 20, bottom: 20),
          child: Column(
            children: [
              scanButton(context),
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
                  FlutterI18n.translate(context, "polygraphy.footer.validate"),
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
