// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'route.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$RouteModelImpl _$$RouteModelImplFromJson(Map<String, dynamic> json) =>
    _$RouteModelImpl(
      polyline: (json['polyline'] as List<dynamic>)
          .map((e) => LatLng.fromJson(e as Map<String, dynamic>))
          .toList(),
      distance: json['distance'] as String,
      duration: json['duration'] as String,
      trafficCondition: json['trafficCondition'] as String,
      alternativeRoutes: (json['alternativeRoutes'] as List<dynamic>?)
          ?.map((e) => RouteModel.fromJson(e as Map<String, dynamic>))
          .toList(),
      cachedAt: DateTime.parse(json['cachedAt'] as String),
    );

Map<String, dynamic> _$$RouteModelImplToJson(_$RouteModelImpl instance) =>
    <String, dynamic>{
      'polyline': instance.polyline,
      'distance': instance.distance,
      'duration': instance.duration,
      'trafficCondition': instance.trafficCondition,
      'alternativeRoutes': instance.alternativeRoutes,
      'cachedAt': instance.cachedAt.toIso8601String(),
    };
