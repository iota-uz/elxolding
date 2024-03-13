class User {
  final int id;
  final String firstName;
  final String lastName;

  User(this.id, this.firstName, this.lastName);

  static fromJson(Map<String, dynamic> json) {
    return User(json["id"], json["firstName"], json["lastName"]);
  }
}
