import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:jwt_decoder/jwt_decoder.dart';
import 'package:mobile/feathers/types.dart';

import 'exceptions.dart';

String subQueryToString(dynamic query, String baseKey) {
  if (query is! Map) {
    return "$baseKey=$query";
  }
  List<String> q = [];
  query.forEach((key, value) {
    switch (key) {
      case "\$gt":
      case "\$lt":
      case "\$lte":
      case "\$gte":
      case "\$ne":
        q.add("$baseKey[$key]=$value");
        break;
      case "\$nin":
      case "\$in":
        value.forEach((v) {
          q.add("$baseKey[$key][]=$v");
        });
        break;
    }
  });
  return q.join("&");
}

String queryToString(Map<String, dynamic> query) {
  List<String> q = [];
  query.forEach((key, value) {
    switch (key) {
      case "\$skip":
      case "\$limit":
        q.add("$key=$value");
        break;
      case "\$sort":
        value.forEach((k, v) {
          q.add("\$sort[$k]=$v");
        });
        break;
      case "\$select":
        value.forEach((v) {
          q.add("\$select[]=$v");
        });
        break;
      default:
        q.add(subQueryToString(value, key));
    }
  });
  return q.join("&");
}

class Service {
  String path;
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  final Dio _client;

  Service(this.path, this._client);

  Future<Map<String, dynamic>> _getHeaders() async {
    var token = await _storage.read(key: "jwt");
    if (token == null) {
      return {};
    }
    return {"Authorization": token};
  }

  Future<Map<String, dynamic>> find(Map<String, dynamic> params) async {
    var headers = await _getHeaders();
    String query = queryToString(params);
    var response = await _client.get(
      "/$path?$query",
      options: Options(headers: headers),
    );
    var respData = response.data;
    // await Future.delayed(const Duration(seconds: 4));
    if (response.statusCode == 401) {
      throw NotAuthenticatedException(respData);
    }
    return respData;
  }

  Future<Map<String, dynamic>> get(int id, [Map? params]) async {
    Map<String, dynamic> queryParams = {};
    var headers = await _getHeaders();
    var response = await _client.get("/$path/$id",
        options: Options(headers: headers), queryParameters: queryParams);
    // await Future.delayed(const Duration(seconds: 4));
    if (response.statusCode == 401) {
      throw NotAuthenticatedException(response.data);
    }
    return response.data;
  }

  Future<Map<String, dynamic>> create(Map data) async {
    var headers = await _getHeaders();
    var response = await _client.post("/$path",
        data: data, options: Options(headers: headers));
    if (response.statusCode == 401) {
      throw NotAuthenticatedException(response.data);
    }
    return response.data;
  }

  Future<Map<String, dynamic>> patch(int id, Map data) async {
    var headers = await _getHeaders();
    var response = await _client.patch(
      "/$path/$id",
      data: data,
      options: Options(headers: headers, validateStatus: (status) => true),
    );
    switch (response.statusCode) {
      case 400:
        {
          throw GeneralException(response.data);
        }
      case 401:
        {
          throw NotAuthenticatedException(response.data);
        }
    }
    return response.data;
  }

  Future<Map<String, dynamic>> remove(int id) async {
    var headers = await _getHeaders();
    var response = await _client.delete(
      "/$path/$id",
      options: Options(headers: headers),
    );
    if (response.statusCode == 401) {
      throw NotAuthenticatedException(response.data);
    }
    return response.data;
  }
}

class FeathersClient {
  late Dio _client;
  late Service _authService;
  late Service _usersService;
  late Service _rpcService;
  final FlutterSecureStorage _storage = const FlutterSecureStorage();
  Map<String, Service> services = {};

  FeathersClient(String baseUrl) {
    _client = Dio(BaseOptions(baseUrl: baseUrl));
    _authService = registerService("authentication");
    _rpcService = registerService("rpc");
    _usersService = registerService("users");
  }

  Service registerService(String path) {
    var service = Service(path, _client);
    services[path] = service;
    return service;
  }

  Service service(String path) {
    var service = services[path];
    if (service == null) {
      throw Exception("No service $path found");
    }
    return service;
  }

  Future<Map> authenticate(Map data) async {
    var response = await _authService.create(data);
    await _storage.write(key: "jwt", value: response["accessToken"]);
    return response;
  }

  Future<Map<String, dynamic>?> getMe() async {
    final jwt = await _storage.read(key: "jwt");
    if (jwt == null) {
      return null;
    }
    Map<String, dynamic> decodedToken = JwtDecoder.decode(jwt);
    return await _usersService.get(decodedToken["userId"]);
  }

  Future<Map<String, dynamic>> updateMe(Map<String, dynamic> data) async {
    final jwt = await _storage.read(key: "jwt");
    if (jwt == null) {
      throw NotAuthenticatedException({});
    }
    Map<String, dynamic> decodedToken = JwtDecoder.decode(jwt);
    return await _usersService.patch(decodedToken["userId"], data);
  }

  Future<RpcResponse> rpc(String method, Map data) async {
    var response = await _rpcService.create({
      "method": method,
      "params": data,
    });
    return RpcResponse.fromJson(response);
  }

  Future<void> logout() async {
    await _storage.delete(key: "jwt");
  }
}
