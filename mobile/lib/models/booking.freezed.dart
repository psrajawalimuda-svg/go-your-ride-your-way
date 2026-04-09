// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'booking.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

Booking _$BookingFromJson(Map<String, dynamic> json) {
  return _Booking.fromJson(json);
}

/// @nodoc
mixin _$Booking {
  String get id => throw _privateConstructorUsedError;
  String get userId => throw _privateConstructorUsedError;
  ShuttleSchedule get schedule => throw _privateConstructorUsedError;
  List<int> get seats => throw _privateConstructorUsedError;
  List<ShuttlePassenger> get passengers => throw _privateConstructorUsedError;
  BookingStatus get status => throw _privateConstructorUsedError;
  double get totalPrice => throw _privateConstructorUsedError;
  String? get paymentId => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;
  String? get specialRequirements => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $BookingCopyWith<Booking> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $BookingCopyWith<$Res> {
  factory $BookingCopyWith(Booking value, $Res Function(Booking) then) =
      _$BookingCopyWithImpl<$Res, Booking>;
  @useResult
  $Res call(
      {String id,
      String userId,
      ShuttleSchedule schedule,
      List<int> seats,
      List<ShuttlePassenger> passengers,
      BookingStatus status,
      double totalPrice,
      String? paymentId,
      DateTime createdAt,
      String? specialRequirements});

  $ShuttleScheduleCopyWith<$Res> get schedule;
}

/// @nodoc
class _$BookingCopyWithImpl<$Res, $Val extends Booking>
    implements $BookingCopyWith<$Res> {
  _$BookingCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? userId = null,
    Object? schedule = null,
    Object? seats = null,
    Object? passengers = null,
    Object? status = null,
    Object? totalPrice = null,
    Object? paymentId = freezed,
    Object? createdAt = null,
    Object? specialRequirements = freezed,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      userId: null == userId
          ? _value.userId
          : userId // ignore: cast_nullable_to_non_nullable
              as String,
      schedule: null == schedule
          ? _value.schedule
          : schedule // ignore: cast_nullable_to_non_nullable
              as ShuttleSchedule,
      seats: null == seats
          ? _value.seats
          : seats // ignore: cast_nullable_to_non_nullable
              as List<int>,
      passengers: null == passengers
          ? _value.passengers
          : passengers // ignore: cast_nullable_to_non_nullable
              as List<ShuttlePassenger>,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as BookingStatus,
      totalPrice: null == totalPrice
          ? _value.totalPrice
          : totalPrice // ignore: cast_nullable_to_non_nullable
              as double,
      paymentId: freezed == paymentId
          ? _value.paymentId
          : paymentId // ignore: cast_nullable_to_non_nullable
              as String?,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      specialRequirements: freezed == specialRequirements
          ? _value.specialRequirements
          : specialRequirements // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }

  @override
  @pragma('vm:prefer-inline')
  $ShuttleScheduleCopyWith<$Res> get schedule {
    return $ShuttleScheduleCopyWith<$Res>(_value.schedule, (value) {
      return _then(_value.copyWith(schedule: value) as $Val);
    });
  }
}

/// @nodoc
abstract class _$$BookingImplCopyWith<$Res> implements $BookingCopyWith<$Res> {
  factory _$$BookingImplCopyWith(
          _$BookingImpl value, $Res Function(_$BookingImpl) then) =
      __$$BookingImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String userId,
      ShuttleSchedule schedule,
      List<int> seats,
      List<ShuttlePassenger> passengers,
      BookingStatus status,
      double totalPrice,
      String? paymentId,
      DateTime createdAt,
      String? specialRequirements});

  @override
  $ShuttleScheduleCopyWith<$Res> get schedule;
}

/// @nodoc
class __$$BookingImplCopyWithImpl<$Res>
    extends _$BookingCopyWithImpl<$Res, _$BookingImpl>
    implements _$$BookingImplCopyWith<$Res> {
  __$$BookingImplCopyWithImpl(
      _$BookingImpl _value, $Res Function(_$BookingImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? userId = null,
    Object? schedule = null,
    Object? seats = null,
    Object? passengers = null,
    Object? status = null,
    Object? totalPrice = null,
    Object? paymentId = freezed,
    Object? createdAt = null,
    Object? specialRequirements = freezed,
  }) {
    return _then(_$BookingImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      userId: null == userId
          ? _value.userId
          : userId // ignore: cast_nullable_to_non_nullable
              as String,
      schedule: null == schedule
          ? _value.schedule
          : schedule // ignore: cast_nullable_to_non_nullable
              as ShuttleSchedule,
      seats: null == seats
          ? _value._seats
          : seats // ignore: cast_nullable_to_non_nullable
              as List<int>,
      passengers: null == passengers
          ? _value._passengers
          : passengers // ignore: cast_nullable_to_non_nullable
              as List<ShuttlePassenger>,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as BookingStatus,
      totalPrice: null == totalPrice
          ? _value.totalPrice
          : totalPrice // ignore: cast_nullable_to_non_nullable
              as double,
      paymentId: freezed == paymentId
          ? _value.paymentId
          : paymentId // ignore: cast_nullable_to_non_nullable
              as String?,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      specialRequirements: freezed == specialRequirements
          ? _value.specialRequirements
          : specialRequirements // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$BookingImpl implements _Booking {
  const _$BookingImpl(
      {required this.id,
      required this.userId,
      required this.schedule,
      required final List<int> seats,
      required final List<ShuttlePassenger> passengers,
      required this.status,
      required this.totalPrice,
      this.paymentId,
      required this.createdAt,
      this.specialRequirements})
      : _seats = seats,
        _passengers = passengers;

  factory _$BookingImpl.fromJson(Map<String, dynamic> json) =>
      _$$BookingImplFromJson(json);

  @override
  final String id;
  @override
  final String userId;
  @override
  final ShuttleSchedule schedule;
  final List<int> _seats;
  @override
  List<int> get seats {
    if (_seats is EqualUnmodifiableListView) return _seats;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_seats);
  }

  final List<ShuttlePassenger> _passengers;
  @override
  List<ShuttlePassenger> get passengers {
    if (_passengers is EqualUnmodifiableListView) return _passengers;
    // ignore: implicit_dynamic_type
    return EqualUnmodifiableListView(_passengers);
  }

  @override
  final BookingStatus status;
  @override
  final double totalPrice;
  @override
  final String? paymentId;
  @override
  final DateTime createdAt;
  @override
  final String? specialRequirements;

  @override
  String toString() {
    return 'Booking(id: $id, userId: $userId, schedule: $schedule, seats: $seats, passengers: $passengers, status: $status, totalPrice: $totalPrice, paymentId: $paymentId, createdAt: $createdAt, specialRequirements: $specialRequirements)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$BookingImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.userId, userId) || other.userId == userId) &&
            (identical(other.schedule, schedule) ||
                other.schedule == schedule) &&
            const DeepCollectionEquality().equals(other._seats, _seats) &&
            const DeepCollectionEquality()
                .equals(other._passengers, _passengers) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.totalPrice, totalPrice) ||
                other.totalPrice == totalPrice) &&
            (identical(other.paymentId, paymentId) ||
                other.paymentId == paymentId) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.specialRequirements, specialRequirements) ||
                other.specialRequirements == specialRequirements));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      userId,
      schedule,
      const DeepCollectionEquality().hash(_seats),
      const DeepCollectionEquality().hash(_passengers),
      status,
      totalPrice,
      paymentId,
      createdAt,
      specialRequirements);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$BookingImplCopyWith<_$BookingImpl> get copyWith =>
      __$$BookingImplCopyWithImpl<_$BookingImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$BookingImplToJson(
      this,
    );
  }
}

abstract class _Booking implements Booking {
  const factory _Booking(
      {required final String id,
      required final String userId,
      required final ShuttleSchedule schedule,
      required final List<int> seats,
      required final List<ShuttlePassenger> passengers,
      required final BookingStatus status,
      required final double totalPrice,
      final String? paymentId,
      required final DateTime createdAt,
      final String? specialRequirements}) = _$BookingImpl;

  factory _Booking.fromJson(Map<String, dynamic> json) = _$BookingImpl.fromJson;

  @override
  String get id;
  @override
  String get userId;
  @override
  ShuttleSchedule get schedule;
  @override
  List<int> get seats;
  @override
  List<ShuttlePassenger> get passengers;
  @override
  BookingStatus get status;
  @override
  double get totalPrice;
  @override
  String? get paymentId;
  @override
  DateTime get createdAt;
  @override
  String? get specialRequirements;
  @override
  @JsonKey(ignore: true)
  _$$BookingImplCopyWith<_$BookingImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

ShuttleSchedule _$ShuttleScheduleFromJson(Map<String, dynamic> json) {
  return _ShuttleSchedule.fromJson(json);
}

/// @nodoc
mixin _$ShuttleSchedule {
  String get id => throw _privateConstructorUsedError;
  String get from => throw _privateConstructorUsedError;
  String get to => throw _privateConstructorUsedError;
  String get departure => throw _privateConstructorUsedError;
  String get arrival => throw _privateConstructorUsedError;
  String get duration => throw _privateConstructorUsedError;
  double get price => throw _privateConstructorUsedError;
  String get operator => throw _privateConstructorUsedError;
  int get totalSeats => throw _privateConstructorUsedError;
  int get availableSeats => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $ShuttleScheduleCopyWith<ShuttleSchedule> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ShuttleScheduleCopyWith<$Res> {
  factory $ShuttleScheduleCopyWith(
          ShuttleSchedule value, $Res Function(ShuttleSchedule) then) =
      _$ShuttleScheduleCopyWithImpl<$Res, ShuttleSchedule>;
  @useResult
  $Res call(
      {String id,
      String from,
      String to,
      String departure,
      String arrival,
      String duration,
      double price,
      String operator,
      int totalSeats,
      int availableSeats});
}

/// @nodoc
class _$ShuttleScheduleCopyWithImpl<$Res, $Val extends ShuttleSchedule>
    implements $ShuttleScheduleCopyWith<$Res> {
  _$ShuttleScheduleCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? from = null,
    Object? to = null,
    Object? departure = null,
    Object? arrival = null,
    Object? duration = null,
    Object? price = null,
    Object? operator = null,
    Object? totalSeats = null,
    Object? availableSeats = null,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      from: null == from
          ? _value.from
          : from // ignore: cast_nullable_to_non_nullable
              as String,
      to: null == to
          ? _value.to
          : to // ignore: cast_nullable_to_non_nullable
              as String,
      departure: null == departure
          ? _value.departure
          : departure // ignore: cast_nullable_to_non_nullable
              as String,
      arrival: null == arrival
          ? _value.arrival
          : arrival // ignore: cast_nullable_to_non_nullable
              as String,
      duration: null == duration
          ? _value.duration
          : duration // ignore: cast_nullable_to_non_nullable
              as String,
      price: null == price
          ? _value.price
          : price // ignore: cast_nullable_to_non_nullable
              as double,
      operator: null == operator
          ? _value.operator
          : operator // ignore: cast_nullable_to_non_nullable
              as String,
      totalSeats: null == totalSeats
          ? _value.totalSeats
          : totalSeats // ignore: cast_nullable_to_non_nullable
              as int,
      availableSeats: null == availableSeats
          ? _value.availableSeats
          : availableSeats // ignore: cast_nullable_to_non_nullable
              as int,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$ShuttleScheduleImplCopyWith<$Res>
    implements $ShuttleScheduleCopyWith<$Res> {
  factory _$$ShuttleScheduleImplCopyWith(_$ShuttleScheduleImpl value,
          $Res Function(_$ShuttleScheduleImpl) then) =
      __$$ShuttleScheduleImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      String from,
      String to,
      String departure,
      String arrival,
      String duration,
      double price,
      String operator,
      int totalSeats,
      int availableSeats});
}

/// @nodoc
class __$$ShuttleScheduleImplCopyWithImpl<$Res>
    extends _$ShuttleScheduleCopyWithImpl<$Res, _$ShuttleScheduleImpl>
    implements _$$ShuttleScheduleImplCopyWith<$Res> {
  __$$ShuttleScheduleImplCopyWithImpl(
      _$ShuttleScheduleImpl _value, $Res Function(_$ShuttleScheduleImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? from = null,
    Object? to = null,
    Object? departure = null,
    Object? arrival = null,
    Object? duration = null,
    Object? price = null,
    Object? operator = null,
    Object? totalSeats = null,
    Object? availableSeats = null,
  }) {
    return _then(_$ShuttleScheduleImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      from: null == from
          ? _value.from
          : from // ignore: cast_nullable_to_non_nullable
              as String,
      to: null == to
          ? _value.to
          : to // ignore: cast_nullable_to_non_nullable
              as String,
      departure: null == departure
          ? _value.departure
          : departure // ignore: cast_nullable_to_non_nullable
              as String,
      arrival: null == arrival
          ? _value.arrival
          : arrival // ignore: cast_nullable_to_non_nullable
              as String,
      duration: null == duration
          ? _value.duration
          : duration // ignore: cast_nullable_to_non_nullable
              as String,
      price: null == price
          ? _value.price
          : price // ignore: cast_nullable_to_non_nullable
              as double,
      operator: null == operator
          ? _value.operator
          : operator // ignore: cast_nullable_to_non_nullable
              as String,
      totalSeats: null == totalSeats
          ? _value.totalSeats
          : totalSeats // ignore: cast_nullable_to_non_nullable
              as int,
      availableSeats: null == availableSeats
          ? _value.availableSeats
          : availableSeats // ignore: cast_nullable_to_non_nullable
              as int,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$ShuttleScheduleImpl implements _ShuttleSchedule {
  const _$ShuttleScheduleImpl(
      {required this.id,
      required this.from,
      required this.to,
      required this.departure,
      required this.arrival,
      required this.duration,
      required this.price,
      required this.operator,
      required this.totalSeats,
      required this.availableSeats});

  factory _$ShuttleScheduleImpl.fromJson(Map<String, dynamic> json) =>
      _$$ShuttleScheduleImplFromJson(json);

  @override
  final String id;
  @override
  final String from;
  @override
  final String to;
  @override
  final String departure;
  @override
  final String arrival;
  @override
  final String duration;
  @override
  final double price;
  @override
  final String operator;
  @override
  final int totalSeats;
  @override
  final int availableSeats;

  @override
  String toString() {
    return 'ShuttleSchedule(id: $id, from: $from, to: $to, departure: $departure, arrival: $arrival, duration: $duration, price: $price, operator: $operator, totalSeats: $totalSeats, availableSeats: $availableSeats)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ShuttleScheduleImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.from, from) || other.from == from) &&
            (identical(other.to, to) || other.to == to) &&
            (identical(other.departure, departure) ||
                other.departure == departure) &&
            (identical(other.arrival, arrival) || other.arrival == arrival) &&
            (identical(other.duration, duration) ||
                other.duration == duration) &&
            (identical(other.price, price) || other.price == price) &&
            (identical(other.operator, operator) ||
                other.operator == operator) &&
            (identical(other.totalSeats, totalSeats) ||
                other.totalSeats == totalSeats) &&
            (identical(other.availableSeats, availableSeats) ||
                other.availableSeats == availableSeats));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(runtimeType, id, from, to, departure, arrival,
      duration, price, operator, totalSeats, availableSeats);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$ShuttleScheduleImplCopyWith<_$ShuttleScheduleImpl> get copyWith =>
      __$$ShuttleScheduleImplCopyWithImpl<_$ShuttleScheduleImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ShuttleScheduleImplToJson(
      this,
    );
  }
}

abstract class _ShuttleSchedule implements ShuttleSchedule {
  const factory _ShuttleSchedule(
      {required final String id,
      required final String from,
      required final String to,
      required final String departure,
      required final String arrival,
      required final String duration,
      required final double price,
      required final String operator,
      required final int totalSeats,
      required final int availableSeats}) = _$ShuttleScheduleImpl;

  factory _ShuttleSchedule.fromJson(Map<String, dynamic> json) =
      _$ShuttleScheduleImpl.fromJson;

  @override
  String get id;
  @override
  String get from;
  @override
  String get to;
  @override
  String get departure;
  @override
  String get arrival;
  @override
  String get duration;
  @override
  double get price;
  @override
  String get operator;
  @override
  int get totalSeats;
  @override
  int get availableSeats;
  @override
  @JsonKey(ignore: true)
  _$$ShuttleScheduleImplCopyWith<_$ShuttleScheduleImpl> get copyWith =>
      throw _privateConstructorUsedError;
}

ShuttlePassenger _$ShuttlePassengerFromJson(Map<String, dynamic> json) {
  return _ShuttlePassenger.fromJson(json);
}

/// @nodoc
mixin _$ShuttlePassenger {
  String get name => throw _privateConstructorUsedError;
  String get phone => throw _privateConstructorUsedError;
  String get email => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $ShuttlePassengerCopyWith<ShuttlePassenger> get copyWith =>
      throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $ShuttlePassengerCopyWith<$Res> {
  factory $ShuttlePassengerCopyWith(
          ShuttlePassenger value, $Res Function(ShuttlePassenger) then) =
      _$ShuttlePassengerCopyWithImpl<$Res, ShuttlePassenger>;
  @useResult
  $Res call({String name, String phone, String email});
}

/// @nodoc
class _$ShuttlePassengerCopyWithImpl<$Res, $Val extends ShuttlePassenger>
    implements $ShuttlePassengerCopyWith<$Res> {
  _$ShuttlePassengerCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? name = null,
    Object? phone = null,
    Object? email = null,
  }) {
    return _then(_value.copyWith(
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      phone: null == phone
          ? _value.phone
          : phone // ignore: cast_nullable_to_non_nullable
              as String,
      email: null == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$ShuttlePassengerImplCopyWith<$Res>
    implements $ShuttlePassengerCopyWith<$Res> {
  factory _$$ShuttlePassengerImplCopyWith(_$ShuttlePassengerImpl value,
          $Res Function(_$ShuttlePassengerImpl) then) =
      __$$ShuttlePassengerImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call({String name, String phone, String email});
}

/// @nodoc
class __$$ShuttlePassengerImplCopyWithImpl<$Res>
    extends _$ShuttlePassengerCopyWithImpl<$Res, _$ShuttlePassengerImpl>
    implements _$$ShuttlePassengerImplCopyWith<$Res> {
  __$$ShuttlePassengerImplCopyWithImpl(_$ShuttlePassengerImpl _value,
      $Res Function(_$ShuttlePassengerImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? name = null,
    Object? phone = null,
    Object? email = null,
  }) {
    return _then(_$ShuttlePassengerImpl(
      name: null == name
          ? _value.name
          : name // ignore: cast_nullable_to_non_nullable
              as String,
      phone: null == phone
          ? _value.phone
          : phone // ignore: cast_nullable_to_non_nullable
              as String,
      email: null == email
          ? _value.email
          : email // ignore: cast_nullable_to_non_nullable
              as String,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$ShuttlePassengerImpl implements _ShuttlePassenger {
  const _$ShuttlePassengerImpl(
      {required this.name, required this.phone, required this.email});

  factory _$ShuttlePassengerImpl.fromJson(Map<String, dynamic> json) =>
      _$$ShuttlePassengerImplFromJson(json);

  @override
  final String name;
  @override
  final String phone;
  @override
  final String email;

  @override
  String toString() {
    return 'ShuttlePassenger(name: $name, phone: $phone, email: $email)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$ShuttlePassengerImpl &&
            (identical(other.name, name) || other.name == name) &&
            (identical(other.phone, phone) || other.phone == phone) &&
            (identical(other.email, email) || other.email == email));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(runtimeType, name, phone, email);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$ShuttlePassengerImplCopyWith<_$ShuttlePassengerImpl> get copyWith =>
      __$$ShuttlePassengerImplCopyWithImpl<_$ShuttlePassengerImpl>(
          this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$ShuttlePassengerImplToJson(
      this,
    );
  }
}

abstract class _ShuttlePassenger implements ShuttlePassenger {
  const factory _ShuttlePassenger(
      {required final String name,
      required final String phone,
      required final String email}) = _$ShuttlePassengerImpl;

  factory _ShuttlePassenger.fromJson(Map<String, dynamic> json) =
      _$ShuttlePassengerImpl.fromJson;

  @override
  String get name;
  @override
  String get phone;
  @override
  String get email;
  @override
  @JsonKey(ignore: true)
  _$$ShuttlePassengerImplCopyWith<_$ShuttlePassengerImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
