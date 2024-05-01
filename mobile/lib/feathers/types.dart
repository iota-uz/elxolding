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
