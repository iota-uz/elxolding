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

GraphQLClient graphQLClient(String uri) {
  final HttpLink httpLink = HttpLink("$uri/query");
  final AuthLink authLink = AuthLink(
    getToken: () async => 'Bearer <YOUR_PERSONAL_ACCESS_TOKEN>',
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
