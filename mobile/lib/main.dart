import 'package:flutter/material.dart';
import 'package:flutter_i18n/flutter_i18n.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:go_router/go_router.dart';
import 'package:mobile/pages/invetory/new.dart';
import 'package:mobile/pages/language.dart';
import 'package:mobile/pages/login.dart';
import 'package:mobile/pages/orders/id.dart';
import 'package:mobile/pages/rfid.dart';
import 'package:mobile/pages/settings.dart';
import 'package:mobile/constants.dart' as constants;
import 'layouts/navigation.dart';
import 'pages/home.dart';
import 'pages/invetory/index.dart';

void main() {
  // WidgetsBinding widgetsBinding = WidgetsFlutterBinding.ensureInitialized();
  // FlutterNativeSplash.preserve(widgetsBinding: widgetsBinding);
  constants.feathersApp.registerService("orders");
  constants.feathersApp.registerService("positions");
  runApp(const MyApp());
}

Map<int, Color> primaryColors = {
  50: const Color.fromRGBO(207, 234, 247, 1),
  100: const Color.fromRGBO(107, 196, 239, 1),
  200: const Color.fromRGBO(22, 171, 243, 1),
  300: const Color.fromRGBO(0, 136, 202, 1),
  400: const Color.fromRGBO(7, 91, 132, 1),
  500: const Color.fromRGBO(9, 62, 87, 1),
  600: const Color.fromRGBO(9, 42, 57, 1),
  700: const Color.fromRGBO(8, 28, 38, 1),
  800: const Color.fromRGBO(6, 19, 25, 1),
  900: const Color.fromRGBO(6, 19, 25, 1),
};

final _rootKey = GlobalKey<NavigatorState>();

final _router = GoRouter(
  initialLocation: "/login",
  navigatorKey: _rootKey,
  routes: [
    StatefulShellRoute(
      builder: (context, state, navigationShell) {
        return NavigationWidget(navigationShell: navigationShell);
      },
      navigatorContainerBuilder: (
        BuildContext context,
        StatefulNavigationShell navigationShell,
        List<Widget> children,
      ) {
        if (navigationShell.currentIndex == 1 ||
            navigationShell.currentIndex == 2) {
          return children[navigationShell.currentIndex];
        }
        return IndexedStack(
          index: navigationShell.currentIndex,
          children: children,
        );
      },
      branches: [
        StatefulShellBranch(
          navigatorKey: GlobalKey<NavigatorState>(debugLabel: "home"),
          routes: [
            GoRoute(
              path: "/home",
              name: "home",
              pageBuilder: (context, state) => const NoTransitionPage(
                child: HomePage(),
              ),
            ),
          ],
        ),
        StatefulShellBranch(
          navigatorKey: GlobalKey<NavigatorState>(debugLabel: "orders"),
          routes: [
            GoRoute(
              path: "/inventory",
              name: "inventory",
              pageBuilder: (context, state) => const NoTransitionPage(
                child: InventoryPage(),
              ),
            ),
            GoRoute(
              path: "/inventory-new",
              name: "inventory-new",
              pageBuilder: (context, state) => const NoTransitionPage(
                child: NewInventoryPage(),
              ),
            ),
          ],
        ),
        StatefulShellBranch(
          navigatorKey: GlobalKey<NavigatorState>(debugLabel: "rfid"),
          routes: [
            GoRoute(
              path: "/rfid",
              name: "rfid",
              pageBuilder: (context, state) => const NoTransitionPage(
                child: RfidPage(),
              ),
            ),
          ],
        ),
        StatefulShellBranch(
          navigatorKey: GlobalKey<NavigatorState>(debugLabel: "settings"),
          routes: [
            GoRoute(
              path: "/settings",
              name: "settings",
              pageBuilder: (context, state) => const NoTransitionPage(
                child: SettingsPage(),
              ),
            ),
          ],
        ),
      ],
    ),
    GoRoute(
      path: "/order/:id",
      name: "order-id",
      builder: (context, state) {
        final id = state.pathParameters["id"]!;
        return OrderPage(pk: id);
      },
    ),
    GoRoute(
      path: "/login",
      name: "login",
      parentNavigatorKey: _rootKey,
      builder: (context, state) => const LoginPage(),
    ),
    GoRoute(
      path: "/login/:userId",
      name: "enter",
      builder: (context, state) {
        return EnterPassword(
          userId: state.pathParameters["userId"]!,
        );
      },
    ),
    GoRoute(
      path: "/language-select",
      name: "language-select",
      builder: (context, state) => const LanguageSelectPage(),
    ),
  ],
);

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      routerConfig: _router,
      title: 'Elxolding',
      theme: ThemeData(
        primarySwatch: MaterialColor(0xff075b84, primaryColors),
        scaffoldBackgroundColor: Colors.white,
        iconTheme: const IconThemeData(
          color: Colors.black,
          fill: 0,
          weight: 400,
          opticalSize: 48,
        ),
      ),
      debugShowCheckedModeBanner: false,
      localizationsDelegates: [
        FlutterI18nDelegate(
          translationLoader: FileTranslationLoader(
            fallbackFile: "ru",
            forcedLocale: const Locale("ru"),
            basePath: "translations",
          ),
          missingTranslationHandler: (key, locale) {},
        ),
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate
      ],
      supportedLocales: const [
        Locale('uz', ''),
        Locale('ru', ''),
      ],
    );
  }
}
