import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/trip.dart';
import '../services/api_service.dart';

part 'ride_provider.g.dart';

@Riverpod(keepAlive: true)
class RideNotifier extends _$RideNotifier {
  late final ApiService _api;

  @override
  FutureOr<Trip?> build() async {
    _api = ApiService();
    // Try to fetch current active ride if exists
    try {
      final response = await _api.get('/ride/active');
      if (response.data != null) {
        return Trip.fromJson(response.data);
      }
    } catch (e) {
      // If no active ride or fetch fails, default to null
    }
    return null;
  }

  Future<void> requestRide(TripLocation pickup, TripLocation dropoff, String vehicleClass) async {
    state = const AsyncValue.loading();
    try {
      final response = await _api.post('/ride/request', data: {
        'pickup': pickup.toJson(),
        'dropoff': dropoff.toJson(),
        'vehicleClass': vehicleClass,
      });
      state = AsyncValue.data(Trip.fromJson(response.data));
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
      rethrow;
    }
  }

  Future<void> cancelRide(String reason) async {
    final currentTrip = state.value;
    if (currentTrip == null) return;
    
    // Optimistic update
    final updatedTrip = currentTrip.copyWith(
      status: TripStatus.cancelled,
      cancelledAt: DateTime.now(),
    );
    state = AsyncValue.data(updatedTrip);
    
    try {
      await _api.post('/ride/${currentTrip.id}/cancel', data: {'reason': reason});
      state = const AsyncValue.data(null);
    } catch (e, stack) {
      // Rollback
      state = AsyncValue.data(currentTrip);
      state = AsyncValue.error(e, stack);
      rethrow;
    }
  }

  Future<void> updateRideStatus(TripStatus status) async {
    final currentTrip = state.value;
    if (currentTrip == null) return;
    
    // Optimistic update
    final updatedTrip = currentTrip.copyWith(status: status);
    state = AsyncValue.data(updatedTrip);
    
    try {
      final response = await _api.patch('/ride/${currentTrip.id}/status', data: {'status': status.name});
      state = AsyncValue.data(Trip.fromJson(response.data));
    } catch (e, stack) {
      // Rollback
      state = AsyncValue.data(currentTrip);
      state = AsyncValue.error(e, stack);
      rethrow;
    }
  }

  void reset() {
    state = const AsyncValue.data(null);
  }
}
