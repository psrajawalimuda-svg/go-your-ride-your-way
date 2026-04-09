import 'package:dio/dio.dart';
import '../services/token_service.dart';

class AuthInterceptor extends Interceptor {
  final TokenService _tokenService;
  final Dio _dio;

  AuthInterceptor(this._tokenService, this._dio);

  @override
  Future<void> onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    final token = await _tokenService.getAccessToken();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    return handler.next(options);
  }

  @override
  Future<void> onError(DioException err, ErrorInterceptorHandler handler) async {
    if (err.response?.statusCode == 401) {
      final refreshToken = await _tokenService.getRefreshToken();
      if (refreshToken != null) {
        try {
          // Attempt to refresh token
          final response = await _dio.post('/auth/refresh', data: {'refresh': refreshToken});
          final newAccessToken = response.data['access'];
          final newRefreshToken = response.data['refresh'];
          
          await _tokenService.saveTokens(access: newAccessToken, refresh: newRefreshToken);
          
          // Retry original request
          final options = err.requestOptions;
          options.headers['Authorization'] = 'Bearer $newAccessToken';
          final retryResponse = await _dio.fetch(options);
          return handler.resolve(retryResponse);
        } catch (e) {
          // Refresh failed, clear tokens and let the error propagate
          await _tokenService.clearTokens();
        }
      }
    }
    return handler.next(err);
  }
}
