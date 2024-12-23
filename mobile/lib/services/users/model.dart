import 'dart:convert';

class User {
  final int id;
  final String firstName;
  final String lastName;
  final String role;

  User(this.id, this.firstName, this.lastName, this.role);

  static fromJson(Map<String, dynamic> json) {
    // TODO: Implement this
    return User(json["id"], json["firstName"], json["lastName"], "admin");
  }

  String toJson() {
    return const JsonEncoder().convert({
      "id": id,
      "firstName": firstName,
      "lastName": lastName,
      "role": role,
    });
  }
}
