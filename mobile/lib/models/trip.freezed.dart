// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'trip.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

Trip _$TripFromJson(Map<String, dynamic> json) {
  return _Trip.fromJson(json);
}

/// @nodoc
mixin _$Trip {
  String get id => throw _privateConstructorUsedError;
  String get passengerId => throw _privateConstructorUsedError;
  String? get driverId => throw _privateConstructorUsedError;
  TripLocation get pickup => throw _privateConstructorUsedError;
  TripLocation get dropoff => throw _privateConstructorUsedError;
  List<TripLocation>? get waypoints => throw _privateConstructorUsedError;
  String get vehicleClass => throw _privateConstructorUsedError;
  TripStatus get status => throw _privateConstructorUsedError;
  double get fare => throw _privateConstructorUsedError;
  String? get distance => throw _privateConstructorUsedError;
  String? get duration => throw _privateConstructorUsedError;
  String get paymentMethod => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;
  DateTime? get completedAt => throw _privateConstructorUsedError;
  DateTime? get startedAt => throw _privateConstructorUsedError;
  DateTime? get cancelledAt => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $TripCopyWith<Trip> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $TripCopyWith<$Res> {
  factory $TripCopyWith(Trip value, $Res Function(Trip) then) =
      _$TripCopyWithImpl<$Res, Trip>;
  @useResult
  $Res call(
      {String id,
      String passengerId,
      String? driverId,
      TripLocation pickup,
      TripLocation dropoff,
      List<TripLocation>? waypoints,
      String vehicleClass,
      TripStatus status,
      double fare,
      String? distance,
      String? duration,
      String paymentMethod,
      DateTime createdAt,
      DateTime? completedAt,
      DateTime? startedAt,
      DateTime? cancelledAt});

  $TripLocationCopyWith<$Res> get pickup;
  $TripLocationCopyWith<$Res> get dropoff;
}

/// @nodoc
class _$TripCopyWithImpl<$Res, $Val extends Trip>
    implements $TripCopyWith<$Res> {
  _$TripCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? passengerId = null,
    Object? driverId = freezed,
    Object? pickup = null,
    Object? dropoff = null,
    Object? waypoints = freezed,
    Object? vehicleClass = null,
    Object? status = null,
    Object? fare = null,
    Object? distance = freezed,
    Object? duration = freezed,
    Object? paymentMethod = null,
    Object? createdAt = null,
    Object? completedAt = freezed,
    Object? startedAt = freezed,
    Object? cancelledAt = freezed,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      passengerId: null == passengerId
          ? _value.passengerId
          : passengerId // ignore: cast_nullable_to_non_nullable
              as String,
      driverId: freezed == driverId
          ? _value.driverId
          : driverId // ignore: cast_nullable_to_non_nullable
              as String?,
      pickup: null == pickup
          ? _value.pickup
          : pickup // ignore: cast_nullable_to_non_nullable
              as TripLocation,
      dropoff: null == dropoff
          ? _value.dropoff
          : dropoff // ignore: cast_nullable_to_non_nullable
              as TripLocation,
      waypoints: freezed == waypoints
          ? _value.waypoints
          : waypoints // ignore: cast_nullable_to_non_nullable
              as List<TripLocation>?,
      vehicleClass: null == vehicleClass
          ? _value.vehicleClass
          : vehicleClass // ignore: cast_nullable_to_non_nullable
              as String,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as TripStatus,
      fare: null == fare
          ? _value.fare
          : fare // ignore: cast_nullable_to_non_nullable
              as double,
      distance: freezed == distance
          ? _value.distance
          : distance // ignore: cast_nullable_to_non_nullable
              as String?,
      duration: freezed == duration
          ? _value.duration
          : duration // ignore: cast_nullable_to_non_nullable
              as String?,
      paymentMethod: null == paymentMethod
          ? _value.paymentMethod
          : paymentMethod // ignore: cast_nullable_to_non_nullable
              as String,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      completedAt: freezed == completedAt
          ? _value.completedAt
          : completedAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      startedAt: freezed == startedAt
          ? _value.startedAt
          : startedAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      cancelledAt: freezed == cancelledAt
          ? _value.cancelledAt
          : cancelledAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
    ) as $Val);
  }

  @override
  @pragma('vm:prefer-inline')
  $TripLocationCopyWith<$Res> get pickup {
    return $TripLocationCopyWith<$Res>(_value.pickup, (value) {
      return _then(_value.copyWith(pickup: value) as $Val);
    });
  }

  @override
  @pragma('vm:prefer-inline')
  $TripLocationCopyWith<$Res> get dropoff {
    return $TripLocationCopyWith<$Res>(_value.dropoff, (value) {
      return _then(_value.copyWith(dropoff: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$TripImplCopyWith<$Res> implements $TripCopyWith<$Res> {
  factory _$$TripImplCopyWith(
          _$TripImpl value, $Res Function(_$TripImpl) then) =
      __$$TripImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String passengerId,
      String? driverId,
      TripLocation pickup,
      TripLocation dropoff,
      List<TripLocation>? waypoints,
      String vehicleClass,
      TripStatus status,
      double fare,
      String? distance,
      String? duration,
      String paymentMethod,
      DateTime createdAt,
      DateTime? completedAt,
      DateTime? startedAt,
      DateTime? cancelledAt});

  @override
  $TripLocationCopyWith<$Res> get pickup;
  @override
  $TripLocationCopyWith<$Res> get dropoff;
}

/// @nodoc
class __$$TripImplCopyWithImpl<$Res>
    extends _$TripCopyWithImpl<$Res, _$TripImpl>
    implements _$$TripImplCopyWith<$Res> {
  __$$TripImplCopyWithImpl(_$TripImpl _value, $Res Function(_$TripImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? passengerId = null,
    Object? driverId = freezed,
    Object? pickup = null,
    Object? dropoff = null,
    Object? waypoints = freezed,
    Object? vehicleClass = null,
    Object? status = null,
    Object? fare = null,
    Object? distance = freezed,
    Object? duration = freezed,
    Object? paymentMethod = null,
    Object? createdAt = null,
    Object? completedAt = freezed,
    Object? startedAt = freezed,
    Object? cancelledAt = freezed,
  }) {
    return _then(_$TripImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      passengerId: null == passengerId
          ? _value.passengerId
          : passengerId // ignore: cast_nullable_to_non_nullable
              as String,
      driverId: freezed == driverId
          ? _value.driverId
          : driverId // ignore: cast_nullable_to_non_nullable
              as String?,
      pickup: null == pickup
          ? _value.pickup
          : pickup // ignore: cast_nullable_to_non_nullable
              as TripLocation,
      dropoff: null == dropoff
          ? _value.dropoff
          : dropoff // ignore: cast_nullable_to_non_nullable
              as TripLocation,
      waypoints: freezed == waypoints
          ? _value._waypoints
          : waypoints // ignore: cast_nullable_to_non_nullable
              as List<TripLocation>?,
      vehicleClass: null == vehicleClass
          ? _value.vehicleClass
          : vehicleClass // ignore: cast_nullable_to_non_nullable
              as String,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as TripStatus,
      fare: null == fare
          ? _value.fare
          : fare // ignore: cast_nullable_to_non_nullable
              as double,
      distance: freezed == distance
          ? _value.distance
          : distance // ignore: cast_nullable_to_non_nullable
              as String?,
      duration: freezed == duration
          ? _value.duration
          : duration // ignore: cast_nullable_to_non_nullable
              as String?,
      paymentMethod: null == paymentMethod
          ? _value.paymentMethod
          : paymentMethod // ignore: cast_nullable_to_non_nullable
              as String,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      completedAt: freezed == completedAt
          ? _value.completedAt
          : completedAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      startedAt: freezed == startedAt
          ? _value.startedAt
          : startedAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      cancelledAt: freezed == cancelledAt
          ? _value.cancelledAt
          : cancelledAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
    ));
  }
}

/// @nodoc

@JsonSerializable(explicitToJson: true)
class _$TripImpl implements _Trip {
  const _$TripImpl(
      {required this.id,
      required this.passengerId,
      this.driverId,
      required this.pickup,
      required this.dropoff,
      final List<TripLocation>? waypoints,
      required this.vehicleClass,
      required this.status,
      required this.fare,
      this.distance,
      this.duration,
      required this.paymentMethod,
      required this.createdAt,
      this.completedAt,
      this.startedAt,
      this.cancelledAt})
      : _waypoints = waypoints;

  factory _$TripImpl.fromJson(Map<String, dynamic> json) =>
      _$$TripImplFromJson(json);

  @override
  final String id;
  @override
  final String passengerId;
  @override
  final String? driverId;
  @override
  final TripLocation pickup;
  @override
  final TripLocation dropoff;
  final List<TripLocation>? _waypoints;
  @override
  List<TripLocation>? get waypoints {
    final value = _waypoints;
    if (value == null) return null;
    if (_waypoints is EqualUnmodifiableListView) return _waypoints;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(value);
  }

  @override
  final String vehicleClass;
  @override
  final TripStatus status;
  @override
  final double fare;
  @override
  final String? distance;
  @override
  final String? duration;
  @override
  final String paymentMethod;
  @override
  final DateTime createdAt;
  @override
  final DateTime? completedAt;
  @override
  final DateTime? startedAt;
  @override
  final DateTime? cancelledAt;

  @override
  String toString() {
    return 'Trip(id: $id, passengerId: $passengerId, driverId: $driverId, pickup: $pickup, dropoff: $dropoff, waypoints: $waypoints, vehicleClass: $vehicleClass, status: $status, fare: $fare, distance: $distance, duration: $duration, paymentMethod: $paymentMethod, createdAt: $createdAt, completedAt: $completedAt, startedAt: $startedAt, cancelledAt: $cancelledAt)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$TripImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.passengerId, passengerId) ||
                other.passengerId == passengerId) &&
            (identical(other.driverId, driverId) ||
                other.driverId == driverId) &&
            (identical(other.pickup, pickup) || other.pickup == pickup) &&
            (identical(other.dropoff, dropoff) || other.dropoff == dropoff) &&
            const DeepCollectionEquality()
                .equals(other._waypoints, _waypoints) &&
            (identical(other.vehicleClass, vehicleClass) ||
                other.vehicleClass == vehicleClass) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.fare, fare) || other.fare == fare) &&
            (identical(other.distance, distance) ||
                other.distance == distance) &&
            (identical(other.duration, duration) ||
                other.duration == duration) &&
            (identical(other.paymentMethod, paymentMethod) ||
                other.paymentMethod == paymentMethod) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.completedAt, completedAt) ||
                other.completedAt == completedAt) &&
            (identical(other.startedAt, startedAt) ||
                other.startedAt == startedAt) &&
            (identical(other.cancelledAt, cancelledAt) ||
                other.cancelledAt == cancelledAt));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      passengerId,
      driverId,
      pickup,
      dropoff,
      const DeepCollectionEquality().hash(_waypoints),
      vehicleClass,
      status,
      fare,
      distance,
      duration,
      paymentMethod,
      createdAt,
      completedAt,
      startedAt,
      cancelledAt);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$TripImplCopyWith<_$TripImpl> get copyWith =>
      __$$TripImplCopyWithImpl<_$TripImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$TripImplToJson(
      this,
    );
  }
}

abstract class _Trip implements Trip {
  const factory _Trip(
      {required final String id,
      required final String passengerId,
      final String? driverId,
      required final TripLocation pickup,
      required final TripLocation dropoff,
      final List<TripLocation>? waypoints,
      required final String vehicleClass,
      required final TripStatus status,
      required final double fare,
      final String? distance,
      final String? duration,
      required final String paymentMethod,
      required final DateTime createdAt,
      final DateTime? completedAt,
      final DateTime? startedAt,
      final DateTime? cancelledAt}) = _$TripImpl;

  factory _Trip.fromJson(Map<String, dynamic> json) = _$TripImpl.fromJson;

  @override
  String get id;
  @override
  String get passengerId;
  @override
  String? get driverId;
  @override
  TripLocation get pickup;
  @override
  TripLocation get dropoff;
  @override
  List<TripLocation>? get waypoints;
  @override
  String get vehicleClass;
  @override
  TripStatus get status;
  @override
  double get fare;
  @override
  String? get distance;
  @override
  String? get duration;
  @override
  String get paymentMethod;
  @override
  DateTime get createdAt;
  @override
  DateTime? get completedAt;
  @override
  DateTime? get startedAt;
  @override
  DateTime? get cancelledAt;
  @override
  @JsonKey(ignore: true)
  _$$TripImplCopyWith<_$TripImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

TripLocation _$TripLocationFromJson(Map<String, dynamic> json) {
  return _TripLocation.fromJson(json);
}

/// @nodoc
mixin _$TripLocation {
  String get label => throw _privateConstructorUsedError;
  @LatLngConverter()
  LatLng? get coords => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $TripLocationCopyWith<TripLocation> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $TripLocationCopyWith<$Res> {
  factory $TripLocationCopyWith(
          TripLocation value, $Res Function(TripLocation) then) =
      _$TripLocationCopyWithImpl<$Res, TripLocation>;
  @useResult
  $Res call({String label, @LatLngConverter() LatLng? coords});
}

/// @nodoc
class _$TripLocationCopyWithImpl<$Res, $Val extends TripLocation>
    implements $TripLocationCopyWith<$Res> {
  _$TripLocationCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? label = null,
    Object? coords = freezed,
  }) {
    return _then(_value.copyWith(
      label: null == label
          ? _value.label
          : label // ignore: cast_nullable_to_non_nullable
              as String,
      coords: freezed == coords
          ? _value.coords
          : coords // ignore: cast_nullable_to_non_nullable
              as LatLng?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$TripLocationImplCopyWith<$Res>
    implements $TripLocationCopyWith<$Res> {
  factory _$$TripLocationImplCopyWith(
          _$TripLocationImpl value, $Res Function(_$TripLocationImpl) then) =
      __$$TripLocationImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String label, @LatLngConverter() LatLng? coords});
}

/// @nodoc
class __$$TripLocationImplCopyWithImpl<$Res>
    extends _$TripLocationCopyWithImpl<$Res, _$TripLocationImpl>
    implements _$$TripLocationImplCopyWith<$Res> {
  __$$TripLocationImplCopyWithImpl(
      _$TripLocationImpl _value, $Res Function(_$TripLocationImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? label = null,
    Object? coords = freezed,
  }) {
    return _then(_$TripLocationImpl(
      label: null == label
          ? _value.label
          : label // ignore: cast_nullable_to_non_nullable
              as String,
      coords: freezed == coords
          ? _value.coords
          : coords // ignore: cast_nullable_to_non_nullable
              as LatLng?,
    ));
  }
}

/// @nodoc

@JsonSerializable(explicitToJson: true)
class _$TripLocationImpl implements _TripLocation {
  const _$TripLocationImpl(
      {required this.label, @LatLngConverter() required this.coords});

  factory _$TripLocationImpl.fromJson(Map<String, dynamic> json) =>
      _$$TripLocationImplFromJson(json);

  @override
  final String label;
  @override
  @LatLngConverter()
  final LatLng? coords;

  @override
  String toString() {
    return 'TripLocation(label: $label, coords: $coords)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$TripLocationImpl &&
            (identical(other.label, label) || other.label == label) &&
            (identical(other.coords, coords) || other.coords == coords));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(runtimeType, label, coords);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$TripLocationImplCopyWith<_$TripLocationImpl> get copyWith =>
      __$$TripLocationImplCopyWithImpl<_$TripLocationImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$TripLocationImplToJson(
      this,
    );
  }
}

abstract class _TripLocation implements TripLocation {
  const factory _TripLocation(
      {required final String label,
      @LatLngConverter() required final LatLng? coords}) = _$TripLocationImpl;

  factory _TripLocation.fromJson(Map<String, dynamic> json) =
      _$TripLocationImpl.fromJson;

  @override
  String get label;
  @override
  @LatLngConverter()
  LatLng? get coords;
  @override
  @JsonKey(ignore: true)
  _$$TripLocationImplCopyWith<_$TripLocationImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
