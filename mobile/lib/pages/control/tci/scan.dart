import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:mobile/components/footer_button.dart';
import 'package:mobile/constants.dart';
import 'package:mobile/feathers/models/product.dart';
import 'package:mobile/utils/rfid.dart';
import 'package:rfid_c72_plugin/tag_epc.dart';

import 'package:mobile/feathers/services/products.dart';

class TCIScanPage extends StatefulWidget {
  final String pk;

  const TCIScanPage({Key? key, required this.pk}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _TCIScanPageState();
  }
}

class _TCIScanPageState extends State<TCIScanPage> {
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
    Future response;
    if (widget.pk == "all") {
      response = productsService.find({
        "status": ProductStatus.inDevelopment.status,
      });
    } else {
      response = productsService.find({
        "status": ProductStatus.inDevelopment.status,
        "positionId": widget.pk,
      });
    }
    return response.then((resp) => resp.data);
  }

  void onPresses() {
    if (_data.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(FlutterI18n.translate(context, "tci.errors.tagsEmpty")),
        ),
      );
    }
    rpcService.validateProducts(_data.map((e) => e.epc).toList()).then((value) {
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
          FlutterI18n.plural(context, "tci.awaitingApproval", _products.length),
        ),
        Row(
          children: [
            Text(
              '${FlutterI18n.translate(context, "tci.scanned")}: ${_data.length}',
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
    if (_isScanning) {
      rfid.stop();
    } else {
      rfid.readContinuous();
    }
    setState(() {
      _isScanning = !_isScanning;
    });
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
        height: 155,
        child: Container(
          padding: const EdgeInsets.only(left: 20, right: 20),
          child: Column(
            children: [
              FooterButton(
                onPressed: onScanPressed,
                secondary: true,
                text: _isScanning
                    ? FlutterI18n.translate(context, "tci.footer.stop")
                    : FlutterI18n.translate(context, "tci.footer.start"),
              ),
              const SizedBox(height: 15),
              FooterButton(
                text: FlutterI18n.translate(context, "tci.footer.validate"),
                onPressed: onPresses,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
