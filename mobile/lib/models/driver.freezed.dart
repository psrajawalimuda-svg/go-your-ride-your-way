// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'driver.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

Driver _$DriverFromJson(Map<String, dynamic> json) {
  return _Driver.fromJson(json);
}

/// @nodoc
mixin _$Driver {
  String get id => throw _privateConstructorUsedError;
  String get name => throw _privateConstructorUsedError;
  String get phone => throw _privateConstructorUsedError;
  String? get avatar => throw _privateConstructorUsedError;
  Vehicle get vehicle => throw _privateConstructorUsedError;
  DriverStatus get status => throw _privateConstructorUsedError;
  double get rating => throw _privateConstructorUsedError;
  int get totalTrips => throw _privateConstructorUsedError;
  @LatLngConverter()
  LatLng? get location => throw _privateConstructorUsedError;
  EarningsAnalytics? get earnings => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $DriverCopyWith<Driver> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $DriverCopyWith<$Res> {
  factory $DriverCopyWith(Driver value, $Res Function(Driver) then) =
      _$DriverCopyWithImpl<$Res, Driver>;
  @useResult
  $Res call(
      {String id,
      String name,
      String phone,
      String? avatar,
      Vehicle vehicle,
      DriverStatus status,
      double rating,
      int totalTrips,
      @LatLngConverter() LatLng? location,
      EarningsAnalytics? earnings});

  $VehicleCopyWith<$Res> get vehicle;
  $EarningsAnalyticsCopyWith<$Res>? get earnings;
}

/// @nodoc
class _$DriverCopyWithImpl<$Res, $Val extends Driver>
    implements $DriverCopyWith<$Res> {
  _$DriverCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? phone = null,
    Object? avatar = freezed,
    Object? vehicle = null,
    Object? status = null,
    Object? rating = null,
    Object? totalTrips = null,
    Object? location = freezed,
    Object? earnings = freezed,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      phone: null == phone
          ? _value.phone
          : phone // ignore: cast_nullable_to_non_nullable
              as String,
      avatar: freezed == avatar
          ? _value.avatar
          : avatar // ignore: cast_nullable_to_non_nullable
              as String?,
      vehicle: null == vehicle
          ? _value.vehicle
          : vehicle // ignore: cast_nullable_to_non_nullable
              as Vehicle,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as DriverStatus,
      rating: null == rating
          ? _value.rating
          : rating // ignore: cast_nullable_to_non_nullable
              as double,
      totalTrips: null == totalTrips
          ? _value.totalTrips
          : totalTrips // ignore: cast_nullable_to_non_nullable
              as int,
      location: freezed == location
          ? _value.location
          : location // ignore: cast_nullable_to_non_nullable
              as LatLng?,
      earnings: freezed == earnings
          ? _value.earnings
          : earnings // ignore: cast_nullable_to_non_nullable
              as EarningsAnalytics?,
    ) as $Val);
  }

  @override
  @pragma('vm:prefer-inline')
  $VehicleCopyWith<$Res> get vehicle {
    return $VehicleCopyWith<$Res>(_value.vehicle, (value) {
      return _then(_value.copyWith(vehicle: value) as $Val);
    });
  }

  @override
  @pragma('vm:prefer-inline')
  $EarningsAnalyticsCopyWith<$Res>? get earnings {
    if (_value.earnings == null) {
      return null;
    }

    return $EarningsAnalyticsCopyWith<$Res>(_value.earnings!, (value) {
      return _then(_value.copyWith(earnings: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$DriverImplCopyWith<$Res> implements $DriverCopyWith<$Res> {
  factory _$$DriverImplCopyWith(
          _$DriverImpl value, $Res Function(_$DriverImpl) then) =
      __$$DriverImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String name,
      String phone,
      String? avatar,
      Vehicle vehicle,
      DriverStatus status,
      double rating,
      int totalTrips,
      @LatLngConverter() LatLng? location,
      EarningsAnalytics? earnings});

  @override
  $VehicleCopyWith<$Res> get vehicle;
  @override
  $EarningsAnalyticsCopyWith<$Res>? get earnings;
}

/// @nodoc
class __$$DriverImplCopyWithImpl<$Res>
    extends _$DriverCopyWithImpl<$Res, _$DriverImpl>
    implements _$$DriverImplCopyWith<$Res> {
  __$$DriverImplCopyWithImpl(
      _$DriverImpl _value, $Res Function(_$DriverImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? name = null,
    Object? phone = null,
    Object? avatar = freezed,
    Object? vehicle = null,
    Object? status = null,
    Object? rating = null,
    Object? totalTrips = null,
    Object? location = freezed,
    Object? earnings = freezed,
  }) {
    return _then(_$DriverImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      phone: null == phone
          ? _value.phone
          : phone // ignore: cast_nullable_to_non_nullable
              as String,
      avatar: freezed == avatar
          ? _value.avatar
          : avatar // ignore: cast_nullable_to_non_nullable
              as String?,
      vehicle: null == vehicle
          ? _value.vehicle
          : vehicle // ignore: cast_nullable_to_non_nullable
              as Vehicle,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as DriverStatus,
      rating: null == rating
          ? _value.rating
          : rating // ignore: cast_nullable_to_non_nullable
              as double,
      totalTrips: null == totalTrips
          ? _value.totalTrips
          : totalTrips // ignore: cast_nullable_to_non_nullable
              as int,
      location: freezed == location
          ? _value.location
          : location // ignore: cast_nullable_to_non_nullable
              as LatLng?,
      earnings: freezed == earnings
          ? _value.earnings
          : earnings // ignore: cast_nullable_to_non_nullable
              as EarningsAnalytics?,
    ));
  }
}

/// @nodoc

@JsonSerializable(explicitToJson: true)
class _$DriverImpl implements _Driver {
  const _$DriverImpl(
      {required this.id,
      required this.name,
      required this.phone,
      this.avatar,
      required this.vehicle,
      required this.status,
      required this.rating,
      required this.totalTrips,
      @LatLngConverter() this.location,
      this.earnings});

  factory _$DriverImpl.fromJson(Map<String, dynamic> json) =>
      _$$DriverImplFromJson(json);

  @override
  final String id;
  @override
  final String name;
  @override
  final String phone;
  @override
  final String? avatar;
  @override
  final Vehicle vehicle;
  @override
  final DriverStatus status;
  @override
  final double rating;
  @override
  final int totalTrips;
  @override
  @LatLngConverter()
  final LatLng? location;
  @override
  final EarningsAnalytics? earnings;

  @override
  String toString() {
    return 'Driver(id: $id, name: $name, phone: $phone, avatar: $avatar, vehicle: $vehicle, status: $status, rating: $rating, totalTrips: $totalTrips, location: $location, earnings: $earnings)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$DriverImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.phone, phone) || other.phone == phone) &&
            (identical(other.avatar, avatar) || other.avatar == avatar) &&
            (identical(other.vehicle, vehicle) || other.vehicle == vehicle) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.rating, rating) || other.rating == rating) &&
            (identical(other.totalTrips, totalTrips) ||
                other.totalTrips == totalTrips) &&
            (identical(other.location, location) ||
                other.location == location) &&
            (identical(other.earnings, earnings) ||
                other.earnings == earnings));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(runtimeType, id, name, phone, avatar, vehicle,
      status, rating, totalTrips, location, earnings);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$DriverImplCopyWith<_$DriverImpl> get copyWith =>
      __$$DriverImplCopyWithImpl<_$DriverImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$DriverImplToJson(
      this,
    );
  }
}

abstract class _Driver implements Driver {
  const factory _Driver(
      {required final String id,
      required final String name,
      required final String phone,
      final String? avatar,
      required final Vehicle vehicle,
      required final DriverStatus status,
      required final double rating,
      required final int totalTrips,
      @LatLngConverter() final LatLng? location,
      final EarningsAnalytics? earnings}) = _$DriverImpl;

  factory _Driver.fromJson(Map<String, dynamic> json) = _$DriverImpl.fromJson;

  @override
  String get id;
  @override
  String get name;
  @override
  String get phone;
  @override
  String? get avatar;
  @override
  Vehicle get vehicle;
  @override
  DriverStatus get status;
  @override
  double get rating;
  @override
  int get totalTrips;
  @override
  @LatLngConverter()
  LatLng? get location;
  @override
  EarningsAnalytics? get earnings;
  @override
  @JsonKey(ignore: true)
  _$$DriverImplCopyWith<_$DriverImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

Vehicle _$VehicleFromJson(Map<String, dynamic> json) {
  return _Vehicle.fromJson(json);
}

/// @nodoc
mixin _$Vehicle {
  String get id => throw _privateConstructorUsedError;
  String get plate => throw _privateConstructorUsedError;
  String get model => throw _privateConstructorUsedError;
  String get color => throw _privateConstructorUsedError;
  String get vehicleClass => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $VehicleCopyWith<Vehicle> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $VehicleCopyWith<$Res> {
  factory $VehicleCopyWith(Vehicle value, $Res Function(Vehicle) then) =
      _$VehicleCopyWithImpl<$Res, Vehicle>;
  @useResult
  $Res call(
      {String id,
      String plate,
      String model,
      String color,
      String vehicleClass});
}

/// @nodoc
class _$VehicleCopyWithImpl<$Res, $Val extends Vehicle>
    implements $VehicleCopyWith<$Res> {
  _$VehicleCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? plate = null,
    Object? model = null,
    Object? color = null,
    Object? vehicleClass = null,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      plate: null == plate
          ? _value.plate
          : plate // ignore: cast_nullable_to_non_nullable
              as String,
      model: null == model
          ? _value.model
          : model // ignore: cast_nullable_to_non_nullable
              as String,
      color: null == color
          ? _value.color
          : color // ignore: cast_nullable_to_non_nullable
              as String,
      vehicleClass: null == vehicleClass
          ? _value.vehicleClass
          : vehicleClass // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$VehicleImplCopyWith<$Res> implements $VehicleCopyWith<$Res> {
  factory _$$VehicleImplCopyWith(
          _$VehicleImpl value, $Res Function(_$VehicleImpl) then) =
      __$$VehicleImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String plate,
      String model,
      String color,
      String vehicleClass});
}

/// @nodoc
class __$$VehicleImplCopyWithImpl<$Res>
    extends _$VehicleCopyWithImpl<$Res, _$VehicleImpl>
    implements _$$VehicleImplCopyWith<$Res> {
  __$$VehicleImplCopyWithImpl(
      _$VehicleImpl _value, $Res Function(_$VehicleImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? plate = null,
    Object? model = null,
    Object? color = null,
    Object? vehicleClass = null,
  }) {
    return _then(_$VehicleImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      plate: null == plate
          ? _value.plate
          : plate // ignore: cast_nullable_to_non_nullable
              as String,
      model: null == model
          ? _value.model
          : model // ignore: cast_nullable_to_non_nullable
              as String,
      color: null == color
          ? _value.color
          : color // ignore: cast_nullable_to_non_nullable
              as String,
      vehicleClass: null == vehicleClass
          ? _value.vehicleClass
          : vehicleClass // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc

@JsonSerializable(explicitToJson: true)
class _$VehicleImpl implements _Vehicle {
  const _$VehicleImpl(
      {required this.id,
      required this.plate,
      required this.model,
      required this.color,
      required this.vehicleClass});

  factory _$VehicleImpl.fromJson(Map<String, dynamic> json) =>
      _$$VehicleImplFromJson(json);

  @override
  final String id;
  @override
  final String plate;
  @override
  final String model;
  @override
  final String color;
  @override
  final String vehicleClass;

  @override
  String toString() {
    return 'Vehicle(id: $id, plate: $plate, model: $model, color: $color, vehicleClass: $vehicleClass)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$VehicleImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.plate, plate) || other.plate == plate) &&
            (identical(other.model, model) || other.model == model) &&
            (identical(other.color, color) || other.color == color) &&
            (identical(other.vehicleClass, vehicleClass) ||
                other.vehicleClass == vehicleClass));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode =>
      Object.hash(runtimeType, id, plate, model, color, vehicleClass);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$VehicleImplCopyWith<_$VehicleImpl> get copyWith =>
      __$$VehicleImplCopyWithImpl<_$VehicleImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$VehicleImplToJson(
      this,
    );
  }
}

abstract class _Vehicle implements Vehicle {
  const factory _Vehicle(
      {required final String id,
      required final String plate,
      required final String model,
      required final String color,
      required final String vehicleClass}) = _$VehicleImpl;

  factory _Vehicle.fromJson(Map<String, dynamic> json) = _$VehicleImpl.fromJson;

  @override
  String get id;
  @override
  String get plate;
  @override
  String get model;
  @override
  String get color;
  @override
  String get vehicleClass;
  @override
  @JsonKey(ignore: true)
  _$$VehicleImplCopyWith<_$VehicleImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

EarningsAnalytics _$EarningsAnalyticsFromJson(Map<String, dynamic> json) {
  return _EarningsAnalytics.fromJson(json);
}

/// @nodoc
mixin _$EarningsAnalytics {
  double get today => throw _privateConstructorUsedError;
  double get weekly => throw _privateConstructorUsedError;
  double get monthly => throw _privateConstructorUsedError;
  int get totalCompletedTrips => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $EarningsAnalyticsCopyWith<EarningsAnalytics> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $EarningsAnalyticsCopyWith<$Res> {
  factory $EarningsAnalyticsCopyWith(
          EarningsAnalytics value, $Res Function(EarningsAnalytics) then) =
      _$EarningsAnalyticsCopyWithImpl<$Res, EarningsAnalytics>;
  @useResult
  $Res call(
      {double today, double weekly, double monthly, int totalCompletedTrips});
}

/// @nodoc
class _$EarningsAnalyticsCopyWithImpl<$Res, $Val extends EarningsAnalytics>
    implements $EarningsAnalyticsCopyWith<$Res> {
  _$EarningsAnalyticsCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? today = null,
    Object? weekly = null,
    Object? monthly = null,
    Object? totalCompletedTrips = null,
  }) {
    return _then(_value.copyWith(
      today: null == today
          ? _value.today
          : today // ignore: cast_nullable_to_non_nullable
              as double,
      weekly: null == weekly
          ? _value.weekly
          : weekly // ignore: cast_nullable_to_non_nullable
              as double,
      monthly: null == monthly
          ? _value.monthly
          : monthly // ignore: cast_nullable_to_non_nullable
              as double,
      totalCompletedTrips: null == totalCompletedTrips
          ? _value.totalCompletedTrips
          : totalCompletedTrips // ignore: cast_nullable_to_non_nullable
              as int,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$EarningsAnalyticsImplCopyWith<$Res>
    implements $EarningsAnalyticsCopyWith<$Res> {
  factory _$$EarningsAnalyticsImplCopyWith(_$EarningsAnalyticsImpl value,
          $Res Function(_$EarningsAnalyticsImpl) then) =
      __$$EarningsAnalyticsImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {double today, double weekly, double monthly, int totalCompletedTrips});
}

/// @nodoc
class __$$EarningsAnalyticsImplCopyWithImpl<$Res>
    extends _$EarningsAnalyticsCopyWithImpl<$Res, _$EarningsAnalyticsImpl>
    implements _$$EarningsAnalyticsImplCopyWith<$Res> {
  __$$EarningsAnalyticsImplCopyWithImpl(_$EarningsAnalyticsImpl _value,
      $Res Function(_$EarningsAnalyticsImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? today = null,
    Object? weekly = null,
    Object? monthly = null,
    Object? totalCompletedTrips = null,
  }) {
    return _then(_$EarningsAnalyticsImpl(
      today: null == today
          ? _value.today
          : today // ignore: cast_nullable_to_non_nullable
              as double,
      weekly: null == weekly
          ? _value.weekly
          : weekly // ignore: cast_nullable_to_non_nullable
              as double,
      monthly: null == monthly
          ? _value.monthly
          : monthly // ignore: cast_nullable_to_non_nullable
              as double,
      totalCompletedTrips: null == totalCompletedTrips
          ? _value.totalCompletedTrips
          : totalCompletedTrips // ignore: cast_nullable_to_non_nullable
              as int,
    ));
  }
}

/// @nodoc

@JsonSerializable(explicitToJson: true)
class _$EarningsAnalyticsImpl implements _EarningsAnalytics {
  const _$EarningsAnalyticsImpl(
      {required this.today,
      required this.weekly,
      required this.monthly,
      required this.totalCompletedTrips});

  factory _$EarningsAnalyticsImpl.fromJson(Map<String, dynamic> json) =>
      _$$EarningsAnalyticsImplFromJson(json);

  @override
  final double today;
  @override
  final double weekly;
  @override
  final double monthly;
  @override
  final int totalCompletedTrips;

  @override
  String toString() {
    return 'EarningsAnalytics(today: $today, weekly: $weekly, monthly: $monthly, totalCompletedTrips: $totalCompletedTrips)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$EarningsAnalyticsImpl &&
            (identical(other.today, today) || other.today == today) &&
            (identical(other.weekly, weekly) || other.weekly == weekly) &&
            (identical(other.monthly, monthly) || other.monthly == monthly) &&
            (identical(other.totalCompletedTrips, totalCompletedTrips) ||
                other.totalCompletedTrips == totalCompletedTrips));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode =>
      Object.hash(runtimeType, today, weekly, monthly, totalCompletedTrips);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$EarningsAnalyticsImplCopyWith<_$EarningsAnalyticsImpl> get copyWith =>
      __$$EarningsAnalyticsImplCopyWithImpl<_$EarningsAnalyticsImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$EarningsAnalyticsImplToJson(
      this,
    );
  }
}

abstract class _EarningsAnalytics implements EarningsAnalytics {
  const factory _EarningsAnalytics(
      {required final double today,
      required final double weekly,
      required final double monthly,
      required final int totalCompletedTrips}) = _$EarningsAnalyticsImpl;

  factory _EarningsAnalytics.fromJson(Map<String, dynamic> json) =
      _$EarningsAnalyticsImpl.fromJson;

  @override
  double get today;
  @override
  double get weekly;
  @override
  double get monthly;
  @override
  int get totalCompletedTrips;
  @override
  @JsonKey(ignore: true)
  _$$EarningsAnalyticsImplCopyWith<_$EarningsAnalyticsImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
