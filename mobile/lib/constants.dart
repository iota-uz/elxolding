import 'package:dio/dio.dart';
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
  Dio client = Dio(BaseOptions(baseUrl: baseUrl));
  authenticationService.setClient(client);
  ordersService.setClient(client);
  productsService.setClient(client);
  positionsService.setClient(client);
  rpcService.setClient(client);
  usersService.setClient(client);
}
