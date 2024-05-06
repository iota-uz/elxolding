import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

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
  late Dio _client;

  Service(this.path);

  void setClient(Dio client) {
    _client = client;
  }

  Future<Map<String, dynamic>> _getHeaders() async {
    var token = await _storage.read(key: "jwt");
    if (token == null) {
      return {};
    }
    return {"Authorization": token};
  }

  Future<dynamic> find(Map<String, dynamic> params) async {
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

  Future<dynamic> get(int id, [Map? params]) async {
    Map<String, dynamic> queryParams = {};
    var headers = await _getHeaders();
    var response = await _client.get("/$path/$id",
        options: Options(headers: headers), queryParameters: queryParams);
    // await Future.delayed(const Duration(seconds: 4));
    if (response.statusCode == 401) {
      throw NotAuthenticatedException(response.data);
    }
    if (response.statusCode == 404) {
      throw NotFoundException(response.data);
    }
    return response.data;
  }

  Future<dynamic> create(Map data) async {
    var headers = await _getHeaders();
    var response = await _client.post("/$path",
        data: data, options: Options(headers: headers));
    if (response.statusCode == 400) {
      throw GeneralException(response.data);
    }
    if (response.statusCode == 401) {
      throw NotAuthenticatedException(response.data);
    }
    return response.data;
  }

  Future<dynamic> patch(int id, Map data) async {
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

  Future<dynamic> remove(int id) async {
    var headers = await _getHeaders();
    var response = await _client.delete(
      "/$path/$id",
      options: Options(headers: headers),
    );
    if (response.statusCode == 401) {
      throw NotAuthenticatedException(response.data);
    }
    if (response.statusCode == 404) {
      throw NotFoundException(response.data);
    }
    return response.data;
  }
}
