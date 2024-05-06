class PaginateResponse<T> {
  final List<T> data;
  final int total;

  PaginateResponse({required this.data, required this.total});

  factory PaginateResponse.fromJson(
      Map<String, dynamic> json, T Function(dynamic) fromJson) {
    return PaginateResponse(
      data: (json['data'] as List).map((e) => fromJson(e)).toList(),
      total: json['total'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'data': data,
      'total': total,
    };
  }
}

class RpcResponse {
  final dynamic result;
  final dynamic error;

  RpcResponse({required this.result, required this.error});

  factory RpcResponse.fromJson(Map<String, dynamic> json) {
    return RpcResponse(
      result: json['result'],
      error: json['error'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'result': result,
      'error': error,
    };
  }

  hasError() {
    return error != null;
  }
}
