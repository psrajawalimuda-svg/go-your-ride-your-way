import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:latlong2/latlong.dart';
import 'driver.dart';

part 'trip.freezed.dart';
part 'trip.g.dart';

@Freezed(toJson: true, fromJson: true)
class Trip with _$Trip {
  const factory Trip({
    required String id,
    required String passengerId,
    String? driverId,
    required TripLocation pickup,
    required TripLocation dropoff,
    List<TripLocation>? waypoints,
    required String vehicleClass,
    required TripStatus status,
    required double fare,
    String? distance,
    String? duration,
    required String paymentMethod,
    required DateTime createdAt,
    DateTime? completedAt,
    DateTime? startedAt,
    DateTime? cancelledAt,
  }) = _Trip;

  factory Trip.fromJson(Map<String, dynamic> json) => _$TripFromJson(json);
}

@Freezed(toJson: true, fromJson: true)
class TripLocation with _$TripLocation {
  const factory TripLocation({
    required String label,
    @LatLngConverter() required LatLng? coords,
  }) = _TripLocation;

  factory TripLocation.fromJson(Map<String, dynamic> json) => _$TripLocationFromJson(json);
}

enum TripStatus {
  idle,
  searching,
  found,
  arriving,
  onTrip,
  completed,
  cancelled,
  timeout,
}
