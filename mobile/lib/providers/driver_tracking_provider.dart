import 'dart:async';
import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:latlong2/latlong.dart';
import '../models/driver.dart';
import '../services/api_service.dart';

part 'driver_tracking_provider.g.dart';

@Riverpod(keepAlive: true)
class DriverTrackingNotifier extends _$DriverTrackingNotifier {
  late final ApiService _api;
  StreamSubscription<LatLng>? _locationSubscription;
  final List<LatLng> _offlineQueue = [];

  @override
  FutureOr<Driver?> build() async {
    _api = ApiService();
    // Try to fetch current assigned driver if exists
    try {
      final response = await _api.get('/driver/assigned');
      if (response.data != null) {
        return Driver.fromJson(response.data);
      }
    } catch (e) {
      // If no assigned driver or fetch fails, default to null
    }
    return null;
  }

  void startTracking(String driverId) {
    // Mock WebSocket connection
    _locationSubscription?.cancel();
    
    // Simulate real-time location updates every 3 seconds
    _locationSubscription = Stream<LatLng>.periodic(
      const Duration(seconds: 3),
      (count) => LatLng(
        -6.2088 + (count * 0.0001),
        106.8456 + (count * 0.0001),
      ),
    ).listen((newLocation) {
      _updateLocation(newLocation);
    });
  }

  Future<void> _updateLocation(LatLng newLocation) async {
    final currentDriver = state.value;
    if (currentDriver == null) return;
    
    // Optimistic update
    final updatedDriver = currentDriver.copyWith(location: newLocation);
    state = AsyncValue.data(updatedDriver);
    
    // If online, sync with server. If offline, queue it.
    // (In a real app, use connectivity_plus to check)
    try {
      await _api.patch('/driver/${currentDriver.id}/location', data: {
        'latitude': newLocation.latitude,
        'longitude': newLocation.longitude,
      });
      
      // Successfully synced, process any queued locations if online
      if (_offlineQueue.isNotEmpty) {
        await _processOfflineQueue();
      }
    } catch (e) {
      // Failed to sync, add to offline queue
      _offlineQueue.add(newLocation);
    }
  }

  Future<void> _processOfflineQueue() async {
    final currentDriver = state.value;
    if (currentDriver == null || _offlineQueue.isEmpty) return;
    
    final locationsToSync = [..._offlineQueue];
    _offlineQueue.clear();
    
    try {
      await _api.post('/driver/${currentDriver.id}/location/sync', data: {
        'locations': locationsToSync.map((e) => {
          'latitude': e.latitude,
          'longitude': e.longitude,
        }).toList(),
      });
    } catch (e) {
      // Failed to sync queue, add back to queue
      _offlineQueue.addAll(locationsToSync);
    }
  }

  void stopTracking() {
    _locationSubscription?.cancel();
    _locationSubscription = null;
    state = const AsyncValue.data(null);
  }
}
