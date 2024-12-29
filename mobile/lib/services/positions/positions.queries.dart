String findPositions = """
query WarehousePositions(\$offset: Int, \$limit: Int, \$sortBy: String) {
    warehousePositions(offset: \$offset, limit: \$limit, sortBy: \$sortBy) {
        total
        data {
            id
            title
            barcode
            createdAt
            updatedAt
        }
    }
}
""";

