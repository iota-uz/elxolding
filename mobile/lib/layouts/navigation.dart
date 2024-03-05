import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:go_router/go_router.dart';
import 'package:material_symbols_icons/symbols.dart';
import 'package:flutter/material.dart';
import 'package:mobile/constants.dart' as constants;

class NavigationWidget extends StatefulWidget {
  const NavigationWidget({
    Key? key,
    required this.navigationShell,
  }) : super(key: key);
  final StatefulNavigationShell navigationShell;

  @override
  State<StatefulWidget> createState() => _NavigationState();
}

class _NavigationState extends State<NavigationWidget> {
  int cartItemsCount = 0;

  void _goBranch(int index) {
    widget.navigationShell.goBranch(
      index,
      initialLocation: index == widget.navigationShell.currentIndex,
    );
  }

  @override
  void initState() {
    super.initState();
  }

  double get iconSize => 25;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: widget.navigationShell,
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        unselectedItemColor: Colors.black,
        fixedColor: Colors.black,
        items: <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Symbols.folder_open, size: iconSize),
            label: FlutterI18n.translate(context, "nav.home"),
          ),
          // TODO: more elegant solution
          BottomNavigationBarItem(
            icon: Icon(Symbols.checklist, size: iconSize),
            label: FlutterI18n.translate(context, "nav.inventory"),
          ),
          BottomNavigationBarItem(
            icon: Icon(Symbols.barcode_scanner, size: iconSize),
            label: FlutterI18n.translate(context, "nav.rfid"),
          ),
          BottomNavigationBarItem(
            icon: Icon(Symbols.settings, size: iconSize),
            label: FlutterI18n.translate(context, "nav.settings"),
          ),
        ],
        currentIndex: widget.navigationShell.currentIndex,
        onTap: _goBranch,
      ),
    );
  }
}
