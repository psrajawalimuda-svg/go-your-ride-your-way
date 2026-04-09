import 'package:dio/dio.dart';
import 'package:logger/logger.dart';

class ErrorInterceptor extends Interceptor {
  final _logger = Logger();

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    String message;
    switch (err.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.sendTimeout:
      case DioExceptionType.receiveTimeout:
        message = 'Connection timeout. Please check your internet connection.';
        break;
      case DioExceptionType.badResponse:
        final status = err.response?.statusCode;
        final errorData = err.response?.data;
        message = _handleBadResponse(status, errorData);
        break;
      case DioExceptionType.cancel:
        message = 'Request was cancelled.';
        break;
      case DioExceptionType.connectionError:
        message = 'Connection error. Please check your internet connection.';
        break;
      default:
        message = 'Something went wrong. Please try again later.';
        break;
    }

    _logger.e('API Error: ${err.requestOptions.path} - $message', error: err);
    
    // Create a new exception with the friendly message
    final customError = DioException(
      requestOptions: err.requestOptions,
      response: err.response,
      type: err.type,
      error: message,
    );
    
    return handler.next(customError);
  }

  String _handleBadResponse(int? status, dynamic data) {
    if (data is Map && data.containsKey('message')) {
      return data['message'] as String;
    }
    
    switch (status) {
      case 400: return 'Bad request. Please check your inputs.';
      case 401: return 'Unauthorized. Please log in again.';
      case 403: return 'Forbidden. You do not have permission.';
      case 404: return 'Not found. The resource was not found.';
      case 500: return 'Server error. Please try again later.';
      default: return 'Unexpected error occurred ($status).';
    }
  }
}
