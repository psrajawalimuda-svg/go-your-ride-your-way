import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/user.dart';
import '../services/api_service.dart';
import '../services/token_service.dart';

part 'auth_provider.g.dart';

@Riverpod(keepAlive: true)
class AuthNotifier extends _$AuthNotifier {
  late final ApiService _api;
  late final TokenService _tokenService;

  @override
  FutureOr<User?> build() async {
    _api = ApiService();
    _tokenService = TokenService();
    
    // Check if we have a saved token
    final hasToken = await _tokenService.hasToken();
    if (!hasToken) return null;
    
    try {
      // Fetch user profile if token exists
      final response = await _api.get('/auth/profile');
      return User.fromJson(response.data);
    } catch (e) {
      // If profile fetch fails, user is likely logged out
      await _tokenService.clearTokens();
      return null;
    }
  }

  Future<void> login(String email, String password) async {
    state = const AsyncValue.loading();
    try {
      final response = await _api.post('/auth/login', data: {
        'email': email,
        'password': password,
      });
      
      final accessToken = response.data['access'];
      final refreshToken = response.data['refresh'];
      final userData = response.data['user'];
      
      await _tokenService.saveTokens(access: accessToken, refresh: refreshToken);
      state = AsyncValue.data(User.fromJson(userData));
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
      rethrow;
    }
  }

  Future<void> logout() async {
    state = const AsyncValue.loading();
    try {
      await _api.post('/auth/logout');
    } catch (e) {
      // Even if API logout fails, clear local tokens
    } finally {
      await _tokenService.clearTokens();
      state = const AsyncValue.data(null);
    }
  }

  Future<void> updateProfile(Map<String, dynamic> data) async {
    final currentUser = state.value;
    if (currentUser == null) return;
    
    // Optimistic update
    final updatedUser = User.fromJson({...currentUser.toJson(), ...data});
    state = AsyncValue.data(updatedUser);
    
    try {
      final response = await _api.patch('/auth/profile', data: data);
      state = AsyncValue.data(User.fromJson(response.data));
    } catch (e, stack) {
      // Rollback on error
      state = AsyncValue.data(currentUser);
      state = AsyncValue.error(e, stack);
      rethrow;
    }
  }
}
