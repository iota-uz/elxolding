import 'dart:convert';

class User {
  final int id;
  final String firstName;
  final String lastName;
  final String role;

  User(this.id, this.firstName, this.lastName, this.role);

  static fromJson(Map<String, dynamic> json) {
    return User(json["id"], json["firstName"], json["lastName"], json["role"]);
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
