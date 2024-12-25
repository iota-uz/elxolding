class Product {
  final int id;
  final int positionId;
  final String status;
  final String rfid;

  Product(this.id, this.positionId, this.status, this.rfid);

  Product.fromJson(Map<String, dynamic> json)
      : id = json["id"],
        positionId = json["positionID"],
        status = json["status"],
        rfid = json["rfid"];
}
