import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:mobile/constants.dart' as constants;
import 'package:mobile/models/position.dart';
import 'package:mobile/utils/rfid.dart';
import 'package:rfid_c72_plugin/rfid_c72_plugin.dart';
import 'package:rfid_c72_plugin/tag_epc.dart';

class RfidPage extends StatefulWidget {
  const RfidPage({Key? key}) : super(key: key);

  @override
  State<StatefulWidget> createState() {
    return _RfidPageState();
  }
}

class _RfidPageState extends State<RfidPage> {
  int? positionId;

  final List<TagEpc> _data = [];
  List<Position> _positions = [];
  bool _isLoading = false;
  RfidWrapper rfid = RfidWrapper();

  @override
  void initState() {
    super.initState();
    initPlatformState();
  }

  @override
  void dispose() {
    super.dispose();
    closeAll();
  }

  closeAll() {
    RfidC72Plugin.stopScan;
    RfidC72Plugin.close;
  }

  Future<void> initPlatformState() async {
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
        hintText: FlutterI18n.translate(context, "rfid.selectPosition"),
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

  Widget tagsList(BuildContext context) {
    if (_data.isEmpty) {
      return const Text('Начните сканирование меток');
    }
    return Column(
      children: _data
          .map(
            (TagEpc tag) => Card(
              color: Colors.blue.shade50,
              child: Container(
                alignment: Alignment.center,
                padding: const EdgeInsets.all(8.0),
                child: Text(
                  tag.epc,
                  style: const TextStyle(color: Colors.blue),
                ),
              ),
            ),
          )
          .toList(),
    );
  }

  Future<void> createProducts() async {
    var res = await constants.feathersApp.service("rpc").create({
      "method": "CreateProductsWithTags",
      "params": {
        "positionId": positionId,
        "tags": _data.map((e) => e.epc).toList(),
      }
    });
  }

  Widget mainUI(BuildContext context) {
    if (_isLoading) {
      return const CircularProgressIndicator();
    }
    return Column(
      children: [
        dropdownList(context),
        const SizedBox(height: 20),
        tagsList(context),
        const SizedBox(height: 20),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text('Отсканируйте метки'),
        ),
        body: Center(
          child: Container(
            padding: const EdgeInsets.only(left: 20, right: 20, top: 20),
            child: mainUI(context),
          ),
        ),
        bottomNavigationBar: BottomAppBar(
          height: 165,
          child: Container(
            padding: const EdgeInsets.only(left: 20, right: 20, bottom: 20),
            child: Column(
              children: [
                ElevatedButton(
                  onPressed: () async {
                    var tag = await rfid.readSingleTag();
                    setState(() {
                      for (var item in _data) {
                        if (item.epc == tag.epc) {
                          return;
                        }
                      }
                      _data.add(tag);
                    });
                  },
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
                  child: const Text(
                    'Сканировать',
                    style: TextStyle(
                      fontSize: 18,
                      color: Colors.black,
                    ),
                  ),
                ),
                const SizedBox(height: 20),
                ElevatedButton(
                  onPressed: () {
                    if (positionId == null) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Выберите наименование'),
                        ),
                      );
                    }
                    if (_data.isEmpty) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Сначала отсканируйте метки'),
                        ),
                      );
                    }
                    createProducts().then((value) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Продукты созданы'),
                        ),
                      );
                      setState(() {
                        _data.clear();
                      });
                    });
                  },
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 20),
                    backgroundColor: Theme.of(context).primaryColor,
                    minimumSize: const Size.fromHeight(36),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(80),
                    ),
                    elevation: 0,
                  ),
                  child: const Text(
                    'Создать',
                    style: TextStyle(fontSize: 18),
                  ),
                )
              ],
            ),
          ),
        ),
    );
  }
}
