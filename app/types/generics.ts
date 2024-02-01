type QuerySortSubField<T> = { [K in keyof T]?: - 1 | 1 }

interface $InHelper<T> {
    $in?: T[]
}

interface $NeHelper<T> {
    $ne?: T
}

interface $LikeHelper<T> {
    $like?: T
}

interface LtGt {
    $lt?: number | string
    $gt?: number | string
    $lte?: number | string
    $gte?: number | string
}

export type QueryProps<T> = { [K in keyof T]?: T[K] | $InHelper<T[K]> | $NeHelper<T[K]> | $LikeHelper<T[K]> | LtGt }

export interface QuerySortField<T> {
    $sort?: QuerySortSubField<T>
}

export interface CommonQueryFields {
    $limit?: number
    $skip?: number
}

export interface QueryOr<T> {
    $or?: Array<Query<T>>
}

export type Query<T> = CommonQueryFields & QueryProps<T> & QuerySortField<T> & QueryOr<T>

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    skip: number
    limit: number
}