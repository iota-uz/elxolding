class Product {
  final int id;
  final int positionId;
  final String status;
  final String rfid;

  Product(this.id, this.positionId, this.status, this.rfid);

  // static fromJson(Map<String, dynamic> json) {
  //   return Product(
  //       json["id"], json["positionId"], json["status"], json["rfid"]);
  // }

  // turn into custom constructor

  Product.fromJson(Map<String, dynamic> json)
      : id = json["id"],
        positionId = json["positionId"],
        status = json["status"],
        rfid = json["rfid"];
}
