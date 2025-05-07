import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:mobile/services/authentication.dart';
import 'package:mobile/services/orders/orders.service.dart';

import 'package:mobile/services/products/products.service.dart';
import 'package:mobile/services/positions/positions.service.dart';
import 'package:mobile/services/rpc.dart';
import 'package:mobile/services/users/users.service.dart';

var isLoggedIn = false;
// const baseUrl = "https://api-staging-elxolding.apollos.studio";
// const baseUrl = "http://localhost:3030";

OrdersService ordersService = OrdersService();
ProductsService productsService = ProductsService();
PositionsService positionsService = PositionsService();
RPCService rpcService = RPCService();
AuthenticationService authenticationService = AuthenticationService();
UsersService usersService = UsersService();

GraphQLClient graphQLClient(String uri) {
  FlutterSecureStorage storage = const FlutterSecureStorage();
  final HttpLink httpLink = HttpLink("$uri/query");
  final AuthLink authLink = AuthLink(
    getToken: () async => await storage.read(key: "sid"),
  );
  final Link link = authLink.concat(httpLink);
  return GraphQLClient(
    link: link,
    cache: GraphQLCache(),
  );
}

void init(String baseUrl) {
  var client = graphQLClient(baseUrl);

  authenticationService.setClient(client);
  ordersService.setClient(client);
  productsService.setClient(client);
  positionsService.setClient(client);
  // rpcService.setClient(client);
  usersService.setClient(client);
}
