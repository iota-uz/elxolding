class GeneralException implements Exception {
  Map data;

  GeneralException(this.data);

  String errMsg() => 'General exception (400)';
}

class NotAuthenticatedException implements Exception {
  Map data;

  NotAuthenticatedException(this.data);

  String errMsg() => 'Not authenticated (401)';
}

class ForbiddenException implements Exception {
  Map data;

  ForbiddenException(this.data);

  String errMsg() => 'Forbidden (403)';
}

class NotFoundException implements Exception {
  Map data;

  NotFoundException(this.data);

  String errMsg() => 'Not found (404)';
}
