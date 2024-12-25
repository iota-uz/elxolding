String findOrders = """
query Orders(\$query: OrderQuery!) {
    orders(query: \$query) {
        total
        data {
            id
            type
            status
            createdAt
            items {
                quantity
                position {
                    id
                    title
                    barcode
                    createdAt
                    updatedAt
                }
                products {
                    id
                    rfid
                    status
                    positionID
                    createdAt
                    updatedAt
                }
            }
        }
    }
}
""";

String getOrder = """
query Order(\$id: ID!) {
    order(id: \$id) {
        id
        type
        status
        createdAt
        items {
            quantity
            position {
                id
                title
                barcode
                createdAt
                updatedAt
            }
            products {
                id
                rfid
                status
                positionID
                createdAt
                updatedAt
            }
        }
    }
}
""";
