import 'package:mobile/feathers/services/base.dart';
import 'package:mobile/feathers/types.dart';

import 'package:mobile/feathers/models/user.dart';

class UsersService extends Service {
  UsersService() : super("users");

  @override
  Future<PaginateResponse<User>> find(Map<String, dynamic> params) async {
    return super.find(params).then((response) {
      return PaginateResponse<User>.fromJson(
        response,
        (json) => User.fromJson(json),
      );
    });
  }

  @override
  Future<User> get(int id, [Map? params]) async {
    return super.get(id).then((response) {
      return User.fromJson(response);
    });
  }

  @override
  Future<User> create(Map data) async {
    return super.create(data).then((response) {
      return User.fromJson(response);
    });
  }

  @override
  Future<User> patch(int id, Map data) async {
    return super.patch(id, data).then((response) {
      return User.fromJson(response);
    });
  }

  @override
  Future<User> remove(int id) async {
    return super.remove(id).then((response) {
      return User.fromJson(response);
    });
  }
}
