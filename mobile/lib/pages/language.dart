import 'package:flag/flag_enum.dart';
import 'package:flag/flag_widget.dart';
import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:go_router/go_router.dart';

class LanguageSelectPage extends StatefulWidget {
  const LanguageSelectPage({Key? key}) : super(key: key);

  @override
  State<LanguageSelectPage> createState() {
    return _LanguageSelectPageState();
  }
}

class _LanguageSelectPageState extends State<LanguageSelectPage> {
  Widget buildLangTile(BuildContext context, String lang, FlagsCode flag) {
    return ListTile(
      onTap: () {
        FlutterI18n.refresh(context, Locale(lang));
        context.goNamed("login");
      },
      title: Row(
        children: [
          Flag.fromCode(
            flag,
            height: 40,
            width: 40,
            fit: BoxFit.fill,
            borderRadius: 25,
          ),
          const SizedBox(width: 20),
          Text(
            FlutterI18n.translate(context, "languageSelect.$lang"),
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(FlutterI18n.translate(context, "languageSelect.title")),
      ),
      body: Container(
        padding: const EdgeInsets.only(left: 40, right: 40),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            buildLangTile(context, "ru", FlagsCode.RU),
            const SizedBox(height: 20),
            buildLangTile(context, "uz", FlagsCode.UZ),
          ],
        ),
      ),
    );
  }
}
