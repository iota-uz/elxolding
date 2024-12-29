class Position {
  final int id;
  final String title;
  final String barcode;
  final String unit;

  Position(this.id, this.title, this.barcode, this.unit);

  static fromJson(Map<String, dynamic> json) {
    return Position(json["id"], json["title"], json["barcode"], json["unit"]);
  }
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
