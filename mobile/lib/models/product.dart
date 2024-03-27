class Product {
  final int id;
  final int positionId;
  final String status;
  final String rfid;

  Product(this.id, this.positionId, this.status, this.rfid);

  static fromJson(Map<String, dynamic> json) {
    return Product(
        json["id"], json["positionId"], json["status"], json["rfid"]);
  }
}
