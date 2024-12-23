import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:mobile/services/authentication.dart';
import 'package:mobile/services/orders.dart';

import 'package:mobile/services/products.dart';
import 'package:mobile/services/positions.dart';
import 'package:mobile/services/rpc.dart';
import 'package:mobile/services/users/service.dart';

var isLoggedIn = false;
// const baseUrl = "https://api-staging-elxolding.apollos.studio";
// const baseUrl = "http://localhost:3030";

OrdersService ordersService = OrdersService();
ProductsService productsService = ProductsService();
PositionsService positionsService = PositionsService();
RPCService rpcService = RPCService();
AuthenticationService authenticationService = AuthenticationService();
UsersService usersService = UsersService();

GraphQLClient coreGraphQLClient(String uri) {
  final HttpLink httpLink = HttpLink("$uri/graphql/core");
  final AuthLink authLink = AuthLink(
    getToken: () async => 'Bearer <YOUR_PERSONAL_ACCESS_TOKEN>',
  );
  final Link link = authLink.concat(httpLink);
  return GraphQLClient(
    link: link,
    cache: GraphQLCache(store: HiveStore()),
  );
}

GraphQLClient warehouseGraphQLClient(String uri) {
  final HttpLink httpLink = HttpLink("$uri/graphql/warehouse");
  final AuthLink authLink = AuthLink(
    getToken: () async => 'Bearer',
  );
  final Link link = authLink.concat(httpLink);
  return GraphQLClient(
    link: link,
    cache: GraphQLCache(store: HiveStore()),
  );
}

void init(String baseUrl) {
  var coreClient = coreGraphQLClient(baseUrl);
  var warehouseClient = warehouseGraphQLClient(baseUrl);

  // authenticationService.setClient(client);
  ordersService.setClient(warehouseClient);
  productsService.setClient(warehouseClient);
  positionsService.setClient(warehouseClient);
  // rpcService.setClient(client);
  usersService.setClient(coreClient);
}
