import 'package:freezed_annotation/freezed_annotation.dart';
import 'package:latlong2/latlong.dart';
import 'driver.dart';

part 'route.freezed.dart';
part 'route.g.dart';

@freezed
class RouteModel with _$RouteModel {
  const factory RouteModel({
    @LatLngConverter() required List<LatLng> polyline,
    required String distance,
    required String duration,
    required String trafficCondition,
    List<RouteModel>? alternativeRoutes,
    required DateTime cachedAt,
  }) = _RouteModel;

  factory RouteModel.fromJson(Map<String, dynamic> json) => _$RouteModelFromJson(json);
}
