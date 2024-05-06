import 'package:dio/dio.dart';
import 'package:mobile/feathers/services/base.dart';
import 'package:mobile/feathers/types.dart';

import 'package:mobile/feathers/models/position.dart';

class PositionsService extends Service {
  PositionsService() : super("positions");

  @override
  Future<PaginateResponse<Position>> find(Map<String, dynamic> params) async {
    return super.find(params).then((response) {
      return PaginateResponse<Position>.fromJson(
        response,
        (json) => Position.fromJson(json),
      );
    });
  }

  @override
  Future<Position> get(int id, [Map? params]) async {
    return super.get(id).then((response) {
      return Position.fromJson(response);
    });
  }

  @override
  Future<Position> create(Map data) async {
    return super.create(data).then((response) {
      return Position.fromJson(response);
    });
  }

  @override
  Future<Position> patch(int id, Map data) async {
    return super.patch(id, data).then((response) {
      return Position.fromJson(response);
    });
  }

  @override
  Future<Position> remove(int id) async {
    return super.remove(id).then((response) {
      return Position.fromJson(response);
    });
  }
}
