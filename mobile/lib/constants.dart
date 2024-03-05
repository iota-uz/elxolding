import 'feathers/feathers.dart';

import 'package:flutter/cupertino.dart';

var isLoggedIn = false;
const baseUrl = "https://zakpharmacy.uz/api/";

FeathersClient feathersApp = FeathersClient(baseUrl);
final RouteObserver<PageRoute> routeObserver = RouteObserver<PageRoute>();
