import 'package:graphql_flutter/graphql_flutter.dart';
import 'package:mobile/feathers/services/authentication.dart';
import 'package:mobile/feathers/services/orders.dart';

import 'package:mobile/feathers/services/products.dart';
import 'package:mobile/feathers/services/positions.dart';
import 'package:mobile/feathers/services/rpc.dart';
import 'package:mobile/feathers/services/users.dart';

var isLoggedIn = false;
// const baseUrl = "https://api-staging-elxolding.apollos.studio";
// const baseUrl = "http://localhost:3030";

OrdersService ordersService = OrdersService();
ProductsService productsService = ProductsService();
PositionsService positionsService = PositionsService();
RPCService rpcService = RPCService();
AuthenticationService authenticationService = AuthenticationService();
UsersService usersService = UsersService();

void init(String baseUrl) {
  final HttpLink httpLink = HttpLink("$baseUrl/graphql");
  final AuthLink authLink = AuthLink(
    getToken: () async => 'Bearer <YOUR_PERSONAL_ACCESS_TOKEN>',
  );
  final Link link = authLink.concat(httpLink);

  GraphQLClient client = GraphQLClient(
    link: link,
    cache: GraphQLCache(store: HiveStore()),
  );
  // authenticationService.setClient(client);
  ordersService.setClient(client);
  productsService.setClient(client);
  positionsService.setClient(client);
  // rpcService.setClient(client);
  usersService.setClient(client);
}
