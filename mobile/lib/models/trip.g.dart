// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'trip.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$TripImpl _$$TripImplFromJson(Map<String, dynamic> json) => _$TripImpl(
      id: json['id'] as String,
      passengerId: json['passengerId'] as String,
      driverId: json['driverId'] as String?,
      pickup: TripLocation.fromJson(json['pickup'] as Map<String, dynamic>),
      dropoff: TripLocation.fromJson(json['dropoff'] as Map<String, dynamic>),
      waypoints: (json['waypoints'] as List<dynamic>?)
          ?.map((e) => TripLocation.fromJson(e as Map<String, dynamic>))
          .toList(),
      vehicleClass: json['vehicleClass'] as String,
      status: $enumDecode(_$TripStatusEnumMap, json['status']),
      fare: (json['fare'] as num).toDouble(),
      distance: json['distance'] as String?,
      duration: json['duration'] as String?,
      paymentMethod: json['paymentMethod'] as String,
      createdAt: DateTime.parse(json['createdAt'] as String),
      completedAt: json['completedAt'] == null
          ? null
          : DateTime.parse(json['completedAt'] as String),
      startedAt: json['startedAt'] == null
          ? null
          : DateTime.parse(json['startedAt'] as String),
      cancelledAt: json['cancelledAt'] == null
          ? null
          : DateTime.parse(json['cancelledAt'] as String),
    );

Map<String, dynamic> _$$TripImplToJson(_$TripImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'passengerId': instance.passengerId,
      'driverId': instance.driverId,
      'pickup': instance.pickup.toJson(),
      'dropoff': instance.dropoff.toJson(),
      'waypoints': instance.waypoints?.map((e) => e.toJson()).toList(),
      'vehicleClass': instance.vehicleClass,
      'status': _$TripStatusEnumMap[instance.status]!,
      'fare': instance.fare,
      'distance': instance.distance,
      'duration': instance.duration,
      'paymentMethod': instance.paymentMethod,
      'createdAt': instance.createdAt.toIso8601String(),
      'completedAt': instance.completedAt?.toIso8601String(),
      'startedAt': instance.startedAt?.toIso8601String(),
      'cancelledAt': instance.cancelledAt?.toIso8601String(),
    };

const _$TripStatusEnumMap = {
  TripStatus.idle: 'idle',
  TripStatus.searching: 'searching',
  TripStatus.found: 'found',
  TripStatus.arriving: 'arriving',
  TripStatus.onTrip: 'onTrip',
  TripStatus.completed: 'completed',
  TripStatus.cancelled: 'cancelled',
  TripStatus.timeout: 'timeout',
};

_$TripLocationImpl _$$TripLocationImplFromJson(Map<String, dynamic> json) =>
    _$TripLocationImpl(
      label: json['label'] as String,
      coords: const LatLngConverter()
          .fromJson(json['coords'] as Map<String, dynamic>?),
    );

Map<String, dynamic> _$$TripLocationImplToJson(_$TripLocationImpl instance) =>
    <String, dynamic>{
      'label': instance.label,
      'coords': const LatLngConverter().toJson(instance.coords),
    };
