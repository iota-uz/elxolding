import 'feathers/feathers.dart';

import 'package:flutter/cupertino.dart';

var isLoggedIn = false;
const baseUrl = "https://api-staging-elxolding.apollos.studio";

FeathersClient feathersApp = FeathersClient(baseUrl);
final RouteObserver<PageRoute> routeObserver = RouteObserver<PageRoute>();
