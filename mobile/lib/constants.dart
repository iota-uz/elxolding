import 'feathers/feathers.dart';

import 'package:flutter/cupertino.dart';

var isLoggedIn = false;
// const baseUrl = "https://api-staging-elxolding.apollos.studio";
// const baseUrl = "http://localhost:3030";
const baseUrl = "http://rfid.local:3030";
// const baseUrl = "https://5216-84-54-72-231.ngrok-free.app";

FeathersClient feathersApp = FeathersClient(baseUrl);
final RouteObserver<PageRoute> routeObserver = RouteObserver<PageRoute>();
