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

enum ProductStatus implements Comparable<ProductStatus> {
  inStock(status: "in_stock"),
  inDevelopment(status: "in_development"),
  approved(status: "approved");

  const ProductStatus({
    required this.status,
  });

  final String status;

  @override
  int compareTo(ProductStatus other) => status.compareTo(other.status);
}

class FindParams {
  FindParams({
    this.offset = 0,
    this.limit = 50,
    this.sortBy = const ["id asc"],
  });

  int offset;
  int limit;
  List<String> sortBy;

  toJSON() {
    return {
      "offset": offset,
      "limit": limit,
      "sortBy": sortBy,
    };
  }
}
