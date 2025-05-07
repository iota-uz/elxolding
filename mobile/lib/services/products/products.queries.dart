String findProducts = """
query Products(\$offset: Int, \$limit: Int, \$sortBy: String) {
    products(offset: \$offset, limit: \$limit, sortBy: \$sortBy) {
        total
        data {
            id
            rfid
            status
            createdAt
            updatedAt
        }
    }
}
""";

String validateProducts = """
mutation ValidateProducts(\$tags: [String!]!) {
    validateProducts(tags: \$tags) {
      id
    }
}
""";

String createProductsFromTags = """
mutation CreateProductsFromTags(\$positionId: Int!, \$tags: [String!]!) {
    createProductsFromTags(positionId: \$positionId, tags: \$tags) {
        id
    }
}
""";
