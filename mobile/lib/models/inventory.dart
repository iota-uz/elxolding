class InventoryPosition {
  final int id;
  final String title;
  int matches = 0;
  final List<String> tags;

  InventoryPosition.fromJson(Map<String, dynamic> json)
      : id = json["id"],
        title = json["title"],
        tags = List<String>.from(json["tags"]);
}
