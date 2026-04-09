import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/booking.dart';
import '../services/api_service.dart';

part 'shuttle_provider.g.dart';

@Riverpod(keepAlive: true)
class ShuttleNotifier extends _$ShuttleNotifier {
  late final ApiService _api;

  @override
  FutureOr<List<Booking>> build() async {
    _api = ApiService();
    // Try to fetch active shuttle bookings if exists
    try {
      final response = await _api.get('/shuttle/bookings');
      if (response.data != null) {
        return (response.data as List).map((e) => Booking.fromJson(e)).toList();
      }
    } catch (e) {
      // If no active bookings or fetch fails, default to empty
    }
    return [];
  }

  Future<void> bookShuttle(ShuttleSchedule schedule, List<int> seats, List<ShuttlePassenger> passengers, String paymentId) async {
    state = const AsyncValue.loading();
    try {
      final response = await _api.post('/shuttle/book', data: {
        'scheduleId': schedule.id,
        'seats': seats,
        'passengers': passengers.map((e) => e.toJson()).toList(),
        'paymentId': paymentId,
      });
      final newBooking = Booking.fromJson(response.data);
      state = AsyncValue.data([...state.value ?? [], newBooking]);
    } catch (e, stack) {
      state = AsyncValue.error(e, stack);
      rethrow;
    }
  }

  Future<void> cancelBooking(String bookingId) async {
    final currentBookings = state.value ?? [];
    if (currentBookings.isEmpty) return;
    
    // Optimistic update
    final bookingIndex = currentBookings.indexWhere((b) => b.id == bookingId);
    if (bookingIndex == -1) return;
    
    final originalBooking = currentBookings[bookingIndex];
    final updatedBooking = originalBooking.copyWith(status: BookingStatus.cancelled);
    final updatedList = [...currentBookings];
    updatedList[bookingIndex] = updatedBooking;
    state = AsyncValue.data(updatedList);
    
    try {
      await _api.post('/shuttle/bookings/$bookingId/cancel');
      // On success, we keep the updated list (optimistic was correct)
    } catch (e, stack) {
      // Rollback
      final rollbackList = [...currentBookings];
      rollbackList[bookingIndex] = originalBooking;
      state = AsyncValue.data(rollbackList);
      state = AsyncValue.error(e, stack);
      rethrow;
    }
  }

  Future<void> checkAvailability(String scheduleId) async {
    try {
      final response = await _api.get('/shuttle/schedules/$scheduleId/availability');
      // If no conflict resolution is required, just check availability
      if (response.data != null) {
        final availableSeats = response.data['availableSeats'] as int;
        if (availableSeats <= 0) {
          throw Exception('No seats available for this schedule.');
        }
      }
    } catch (e) {
      rethrow;
    }
  }
}
