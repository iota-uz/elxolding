import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:mobile/feathers/services/base.dart';

class AuthenticationService extends Service {
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  AuthenticationService() : super("authentication");

  Future<void> authenticate(int userId, String password) async {
    var response = await create({
      "strategy": "local",
      "id": userId,
      "password": password,
    });
    await _storage.write(key: "jwt", value: response["accessToken"]);
    return;
  }
}
