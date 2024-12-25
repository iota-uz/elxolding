//         title: {
//             type: DataTypes.STRING,
//             allowNull: false
//         },
//         barcode: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             unique: true
//         },
//         unit: {
//             type: DataTypes.ENUM('cm', 'dm', 'l', 'm3'),
//             allowNull: false
//         },


import 'package:mobile/services/products/products.model.dart';

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
