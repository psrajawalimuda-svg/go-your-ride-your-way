// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'route.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

RouteModel _$RouteModelFromJson(Map<String, dynamic> json) {
  return _RouteModel.fromJson(json);
}

/// @nodoc
mixin _$RouteModel {
  @LatLngConverter()
  List<LatLng> get polyline => throw _privateConstructorUsedError;
  String get distance => throw _privateConstructorUsedError;
  String get duration => throw _privateConstructorUsedError;
  String get trafficCondition => throw _privateConstructorUsedError;
  List<RouteModel>? get alternativeRoutes => throw _privateConstructorUsedError;
  DateTime get cachedAt => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $RouteModelCopyWith<RouteModel> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $RouteModelCopyWith<$Res> {
  factory $RouteModelCopyWith(
          RouteModel value, $Res Function(RouteModel) then) =
      _$RouteModelCopyWithImpl<$Res, RouteModel>;
  @useResult
  $Res call(
      {@LatLngConverter() List<LatLng> polyline,
      String distance,
      String duration,
      String trafficCondition,
      List<RouteModel>? alternativeRoutes,
      DateTime cachedAt});
}

/// @nodoc
class _$RouteModelCopyWithImpl<$Res, $Val extends RouteModel>
    implements $RouteModelCopyWith<$Res> {
  _$RouteModelCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? polyline = null,
    Object? distance = null,
    Object? duration = null,
    Object? trafficCondition = null,
    Object? alternativeRoutes = freezed,
    Object? cachedAt = null,
  }) {
    return _then(_value.copyWith(
      polyline: null == polyline
          ? _value.polyline
          : polyline // ignore: cast_nullable_to_non_nullable
              as List<LatLng>,
      distance: null == distance
          ? _value.distance
          : distance // ignore: cast_nullable_to_non_nullable
              as String,
      duration: null == duration
          ? _value.duration
          : duration // ignore: cast_nullable_to_non_nullable
              as String,
      trafficCondition: null == trafficCondition
          ? _value.trafficCondition
          : trafficCondition // ignore: cast_nullable_to_non_nullable
              as String,
      alternativeRoutes: freezed == alternativeRoutes
          ? _value.alternativeRoutes
          : alternativeRoutes // ignore: cast_nullable_to_non_nullable
              as List<RouteModel>?,
      cachedAt: null == cachedAt
          ? _value.cachedAt
          : cachedAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$RouteModelImplCopyWith<$Res>
    implements $RouteModelCopyWith<$Res> {
  factory _$$RouteModelImplCopyWith(
          _$RouteModelImpl value, $Res Function(_$RouteModelImpl) then) =
      __$$RouteModelImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {@LatLngConverter() List<LatLng> polyline,
      String distance,
      String duration,
      String trafficCondition,
      List<RouteModel>? alternativeRoutes,
      DateTime cachedAt});
}

/// @nodoc
class __$$RouteModelImplCopyWithImpl<$Res>
    extends _$RouteModelCopyWithImpl<$Res, _$RouteModelImpl>
    implements _$$RouteModelImplCopyWith<$Res> {
  __$$RouteModelImplCopyWithImpl(
      _$RouteModelImpl _value, $Res Function(_$RouteModelImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? polyline = null,
    Object? distance = null,
    Object? duration = null,
    Object? trafficCondition = null,
    Object? alternativeRoutes = freezed,
    Object? cachedAt = null,
  }) {
    return _then(_$RouteModelImpl(
      polyline: null == polyline
          ? _value._polyline
          : polyline // ignore: cast_nullable_to_non_nullable
              as List<LatLng>,
      distance: null == distance
          ? _value.distance
          : distance // ignore: cast_nullable_to_non_nullable
              as String,
      duration: null == duration
          ? _value.duration
          : duration // ignore: cast_nullable_to_non_nullable
              as String,
      trafficCondition: null == trafficCondition
          ? _value.trafficCondition
          : trafficCondition // ignore: cast_nullable_to_non_nullable
              as String,
      alternativeRoutes: freezed == alternativeRoutes
          ? _value._alternativeRoutes
          : alternativeRoutes // ignore: cast_nullable_to_non_nullable
              as List<RouteModel>?,
      cachedAt: null == cachedAt
          ? _value.cachedAt
          : cachedAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$RouteModelImpl implements _RouteModel {
  const _$RouteModelImpl(
      {@LatLngConverter() required final List<LatLng> polyline,
      required this.distance,
      required this.duration,
      required this.trafficCondition,
      final List<RouteModel>? alternativeRoutes,
      required this.cachedAt})
      : _polyline = polyline,
        _alternativeRoutes = alternativeRoutes;

  factory _$RouteModelImpl.fromJson(Map<String, dynamic> json) =>
      _$$RouteModelImplFromJson(json);

  final List<LatLng> _polyline;
  @override
  @LatLngConverter()
  List<LatLng> get polyline {
    if (_polyline is EqualUnmodifiableListView) return _polyline;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_polyline);
  }

  @override
  final String distance;
  @override
  final String duration;
  @override
  final String trafficCondition;
  final List<RouteModel>? _alternativeRoutes;
  @override
  List<RouteModel>? get alternativeRoutes {
    final value = _alternativeRoutes;
    if (value == null) return null;
    if (_alternativeRoutes is EqualUnmodifiableListView)
      return _alternativeRoutes;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

  @override
  final DateTime cachedAt;

  @override
  String toString() {
    return 'RouteModel(polyline: $polyline, distance: $distance, duration: $duration, trafficCondition: $trafficCondition, alternativeRoutes: $alternativeRoutes, cachedAt: $cachedAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$RouteModelImpl &&
            const DeepCollectionEquality().equals(other._polyline, _polyline) &&
            (identical(other.distance, distance) ||
                other.distance == distance) &&
            (identical(other.duration, duration) ||
                other.duration == duration) &&
            (identical(other.trafficCondition, trafficCondition) ||
                other.trafficCondition == trafficCondition) &&
            const DeepCollectionEquality()
                .equals(other._alternativeRoutes, _alternativeRoutes) &&
            (identical(other.cachedAt, cachedAt) ||
                other.cachedAt == cachedAt));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      const DeepCollectionEquality().hash(_polyline),
      distance,
      duration,
      trafficCondition,
      const DeepCollectionEquality().hash(_alternativeRoutes),
      cachedAt);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$RouteModelImplCopyWith<_$RouteModelImpl> get copyWith =>
      __$$RouteModelImplCopyWithImpl<_$RouteModelImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$RouteModelImplToJson(
      this,
    );
  }
}

abstract class _RouteModel implements RouteModel {
  const factory _RouteModel(
      {@LatLngConverter() required final List<LatLng> polyline,
      required final String distance,
      required final String duration,
      required final String trafficCondition,
      final List<RouteModel>? alternativeRoutes,
      required final DateTime cachedAt}) = _$RouteModelImpl;

  factory _RouteModel.fromJson(Map<String, dynamic> json) =
      _$RouteModelImpl.fromJson;

  @override
  @LatLngConverter()
  List<LatLng> get polyline;
  @override
  String get distance;
  @override
  String get duration;
  @override
  String get trafficCondition;
  @override
  List<RouteModel>? get alternativeRoutes;
  @override
  DateTime get cachedAt;
  @override
  @JsonKey(ignore: true)
  _$$RouteModelImplCopyWith<_$RouteModelImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
