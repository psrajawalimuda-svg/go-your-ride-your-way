// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'driver.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$DriverImpl _$$DriverImplFromJson(Map<String, dynamic> json) => _$DriverImpl(
      id: json['id'] as String,
      name: json['name'] as String,
      phone: json['phone'] as String,
      avatar: json['avatar'] as String?,
      vehicle: Vehicle.fromJson(json['vehicle'] as Map<String, dynamic>),
      status: $enumDecode(_$DriverStatusEnumMap, json['status']),
      rating: (json['rating'] as num).toDouble(),
      totalTrips: (json['totalTrips'] as num).toInt(),
      location: const LatLngConverter()
          .fromJson(json['location'] as Map<String, dynamic>?),
      earnings: json['earnings'] == null
          ? null
          : EarningsAnalytics.fromJson(
              json['earnings'] as Map<String, dynamic>),
    );

Map<String, dynamic> _$$DriverImplToJson(_$DriverImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'name': instance.name,
      'phone': instance.phone,
      'avatar': instance.avatar,
      'vehicle': instance.vehicle.toJson(),
      'status': _$DriverStatusEnumMap[instance.status]!,
      'rating': instance.rating,
      'totalTrips': instance.totalTrips,
      'location': const LatLngConverter().toJson(instance.location),
      'earnings': instance.earnings?.toJson(),
    };

const _$DriverStatusEnumMap = {
  DriverStatus.offline: 'offline',
  DriverStatus.online: 'online',
  DriverStatus.busy: 'busy',
};

_$VehicleImpl _$$VehicleImplFromJson(Map<String, dynamic> json) =>
    _$VehicleImpl(
      id: json['id'] as String,
      plate: json['plate'] as String,
      model: json['model'] as String,
      color: json['color'] as String,
      vehicleClass: json['vehicleClass'] as String,
    );

Map<String, dynamic> _$$VehicleImplToJson(_$VehicleImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'plate': instance.plate,
      'model': instance.model,
      'color': instance.color,
      'vehicleClass': instance.vehicleClass,
    };

_$EarningsAnalyticsImpl _$$EarningsAnalyticsImplFromJson(
        Map<String, dynamic> json) =>
    _$EarningsAnalyticsImpl(
      today: (json['today'] as num).toDouble(),
      weekly: (json['weekly'] as num).toDouble(),
      monthly: (json['monthly'] as num).toDouble(),
      totalCompletedTrips: (json['totalCompletedTrips'] as num).toInt(),
    );

Map<String, dynamic> _$$EarningsAnalyticsImplToJson(
        _$EarningsAnalyticsImpl instance) =>
    <String, dynamic>{
      'today': instance.today,
      'weekly': instance.weekly,
      'monthly': instance.monthly,
      'totalCompletedTrips': instance.totalCompletedTrips,
    };
