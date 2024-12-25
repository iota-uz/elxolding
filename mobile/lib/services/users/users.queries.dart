String findUsers = """
query Users(\$offset: Int!, \$limit: Int!, \$sortBy: [String!]) {
    users(offset: \$offset, limit: \$limit, sortBy: \$sortBy) {
        total
        data {
            id
            email
            firstName
            lastName
            createdAt
            updatedAt
        }
    }
}
""";

String getUser = """
query User(\$id: ID!) {
    user(id: \$id) {
        id
        email
        firstName
        lastName
        createdAt
        updatedAt
    }
}
""";
