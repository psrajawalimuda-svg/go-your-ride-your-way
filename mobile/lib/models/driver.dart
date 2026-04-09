import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:latlong2/latlong.dart';

part 'driver.freezed.dart';
part 'driver.g.dart';

@Freezed(toJson: true, fromJson: true)
class Driver with _$Driver {
  const factory Driver({
    required String id,
    required String name,
    required String phone,
    String? avatar,
    required Vehicle vehicle,
    required DriverStatus status,
    required double rating,
    required int totalTrips,
    @LatLngConverter() LatLng? location,
    EarningsAnalytics? earnings,
  }) = _Driver;

  factory Driver.fromJson(Map<String, dynamic> json) => _$DriverFromJson(json);
}

@Freezed(toJson: true, fromJson: true)
class Vehicle with _$Vehicle {
  const factory Vehicle({
    required String id,
    required String plate,
    required String model,
    required String color,
    required String vehicleClass,
  }) = _Vehicle;

  factory Vehicle.fromJson(Map<String, dynamic> json) => _$VehicleFromJson(json);
}

@Freezed(toJson: true, fromJson: true)
class EarningsAnalytics with _$EarningsAnalytics {
  const factory EarningsAnalytics({
    required double today,
    required double weekly,
    required double monthly,
    required int totalCompletedTrips,
  }) = _EarningsAnalytics;

  factory EarningsAnalytics.fromJson(Map<String, dynamic> json) => _$EarningsAnalyticsFromJson(json);
}

enum DriverStatus { offline, online, busy }

class LatLngConverter implements JsonConverter<LatLng?, Map<String, dynamic>?> {
  const LatLngConverter();

  @override
  LatLng? fromJson(Map<String, dynamic>? json) {
    if (json == null) return null;
    return LatLng(json['latitude'] as double, json['longitude'] as double);
  }

  @override
  Map<String, dynamic>? toJson(LatLng? object) {
    if (object == null) return null;
    return {
      'latitude': object.latitude,
      'longitude': object.longitude,
    };
  }
}
