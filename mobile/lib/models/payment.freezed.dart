// coverage:ignore-file
// GENERATED CODE - DO NOT MODIFY BY HAND
// ignore_for_file: type=lint
// ignore_for_file: unused_element, deprecated_member_use, deprecated_member_use_from_same_package, use_function_type_syntax_for_parameters, unnecessary_const, avoid_init_to_null, invalid_override_different_default_values_named, prefer_expression_function_bodies, annotate_overrides, invalid_annotation_target, unnecessary_question_mark

part of 'payment.dart';

// **************************************************************************
// FreezedGenerator
// **************************************************************************

T _$identity<T>(T value) => value;

final _privateConstructorUsedError = UnsupportedError(
    'It seems like you constructed your class using `MyClass._()`. This constructor is only meant to be used by freezed and you are not supposed to need it nor use it.\nPlease check the documentation here for more information: https://github.com/rrousselGit/freezed#adding-getters-and-methods-to-our-models');

Payment _$PaymentFromJson(Map<String, dynamic> json) {
  return _Payment.fromJson(json);
}

/// @nodoc
mixin _$Payment {
  String get id => throw _privateConstructorUsedError;
  double get amount => throw _privateConstructorUsedError;
  String get method => throw _privateConstructorUsedError;
  TransactionStatus get status => throw _privateConstructorUsedError;
  String get description => throw _privateConstructorUsedError;
  String? get transactionRef => throw _privateConstructorUsedError;
  DateTime get createdAt => throw _privateConstructorUsedError;
  DateTime? get completedAt => throw _privateConstructorUsedError;
  bool? get isPCICompliant => throw _privateConstructorUsedError;
  bool? get fraudDetected => throw _privateConstructorUsedError;
  String? get receiptUrl => throw _privateConstructorUsedError;

  Map<String, dynamic> toJson() => throw _privateConstructorUsedError;
  @JsonKey(ignore: true)
  $PaymentCopyWith<Payment> get copyWith => throw _privateConstructorUsedError;
}

/// @nodoc
abstract class $PaymentCopyWith<$Res> {
  factory $PaymentCopyWith(Payment value, $Res Function(Payment) then) =
      _$PaymentCopyWithImpl<$Res, Payment>;
  @useResult
  $Res call(
      {String id,
      double amount,
      String method,
      TransactionStatus status,
      String description,
      String? transactionRef,
      DateTime createdAt,
      DateTime? completedAt,
      bool? isPCICompliant,
      bool? fraudDetected,
      String? receiptUrl});
}

/// @nodoc
class _$PaymentCopyWithImpl<$Res, $Val extends Payment>
    implements $PaymentCopyWith<$Res> {
  _$PaymentCopyWithImpl(this._value, this._then);

  // ignore: unused_field
  final $Val _value;
  // ignore: unused_field
  final $Res Function($Val) _then;

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? amount = null,
    Object? method = null,
    Object? status = null,
    Object? description = null,
    Object? transactionRef = freezed,
    Object? createdAt = null,
    Object? completedAt = freezed,
    Object? isPCICompliant = freezed,
    Object? fraudDetected = freezed,
    Object? receiptUrl = freezed,
  }) {
    return _then(_value.copyWith(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      amount: null == amount
          ? _value.amount
          : amount // ignore: cast_nullable_to_non_nullable
              as double,
      method: null == method
          ? _value.method
          : method // ignore: cast_nullable_to_non_nullable
              as String,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as TransactionStatus,
      description: null == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String,
      transactionRef: freezed == transactionRef
          ? _value.transactionRef
          : transactionRef // ignore: cast_nullable_to_non_nullable
              as String?,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      completedAt: freezed == completedAt
          ? _value.completedAt
          : completedAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      isPCICompliant: freezed == isPCICompliant
          ? _value.isPCICompliant
          : isPCICompliant // ignore: cast_nullable_to_non_nullable
              as bool?,
      fraudDetected: freezed == fraudDetected
          ? _value.fraudDetected
          : fraudDetected // ignore: cast_nullable_to_non_nullable
              as bool?,
      receiptUrl: freezed == receiptUrl
          ? _value.receiptUrl
          : receiptUrl // ignore: cast_nullable_to_non_nullable
              as String?,
    ) as $Val);
  }
}

/// @nodoc
abstract class _$$PaymentImplCopyWith<$Res> implements $PaymentCopyWith<$Res> {
  factory _$$PaymentImplCopyWith(
          _$PaymentImpl value, $Res Function(_$PaymentImpl) then) =
      __$$PaymentImplCopyWithImpl<$Res>;
  @override
  @useResult
  $Res call(
      {String id,
      double amount,
      String method,
      TransactionStatus status,
      String description,
      String? transactionRef,
      DateTime createdAt,
      DateTime? completedAt,
      bool? isPCICompliant,
      bool? fraudDetected,
      String? receiptUrl});
}

/// @nodoc
class __$$PaymentImplCopyWithImpl<$Res>
    extends _$PaymentCopyWithImpl<$Res, _$PaymentImpl>
    implements _$$PaymentImplCopyWith<$Res> {
  __$$PaymentImplCopyWithImpl(
      _$PaymentImpl _value, $Res Function(_$PaymentImpl) _then)
      : super(_value, _then);

  @pragma('vm:prefer-inline')
  @override
  $Res call({
    Object? id = null,
    Object? amount = null,
    Object? method = null,
    Object? status = null,
    Object? description = null,
    Object? transactionRef = freezed,
    Object? createdAt = null,
    Object? completedAt = freezed,
    Object? isPCICompliant = freezed,
    Object? fraudDetected = freezed,
    Object? receiptUrl = freezed,
  }) {
    return _then(_$PaymentImpl(
      id: null == id
          ? _value.id
          : id // ignore: cast_nullable_to_non_nullable
              as String,
      amount: null == amount
          ? _value.amount
          : amount // ignore: cast_nullable_to_non_nullable
              as double,
      method: null == method
          ? _value.method
          : method // ignore: cast_nullable_to_non_nullable
              as String,
      status: null == status
          ? _value.status
          : status // ignore: cast_nullable_to_non_nullable
              as TransactionStatus,
      description: null == description
          ? _value.description
          : description // ignore: cast_nullable_to_non_nullable
              as String,
      transactionRef: freezed == transactionRef
          ? _value.transactionRef
          : transactionRef // ignore: cast_nullable_to_non_nullable
              as String?,
      createdAt: null == createdAt
          ? _value.createdAt
          : createdAt // ignore: cast_nullable_to_non_nullable
              as DateTime,
      completedAt: freezed == completedAt
          ? _value.completedAt
          : completedAt // ignore: cast_nullable_to_non_nullable
              as DateTime?,
      isPCICompliant: freezed == isPCICompliant
          ? _value.isPCICompliant
          : isPCICompliant // ignore: cast_nullable_to_non_nullable
              as bool?,
      fraudDetected: freezed == fraudDetected
          ? _value.fraudDetected
          : fraudDetected // ignore: cast_nullable_to_non_nullable
              as bool?,
      receiptUrl: freezed == receiptUrl
          ? _value.receiptUrl
          : receiptUrl // ignore: cast_nullable_to_non_nullable
              as String?,
    ));
  }
}

/// @nodoc
@JsonSerializable()
class _$PaymentImpl implements _Payment {
  const _$PaymentImpl(
      {required this.id,
      required this.amount,
      required this.method,
      required this.status,
      required this.description,
      this.transactionRef,
      required this.createdAt,
      this.completedAt,
      this.isPCICompliant,
      this.fraudDetected,
      this.receiptUrl});

  factory _$PaymentImpl.fromJson(Map<String, dynamic> json) =>
      _$$PaymentImplFromJson(json);

  @override
  final String id;
  @override
  final double amount;
  @override
  final String method;
  @override
  final TransactionStatus status;
  @override
  final String description;
  @override
  final String? transactionRef;
  @override
  final DateTime createdAt;
  @override
  final DateTime? completedAt;
  @override
  final bool? isPCICompliant;
  @override
  final bool? fraudDetected;
  @override
  final String? receiptUrl;

  @override
  String toString() {
    return 'Payment(id: $id, amount: $amount, method: $method, status: $status, description: $description, transactionRef: $transactionRef, createdAt: $createdAt, completedAt: $completedAt, isPCICompliant: $isPCICompliant, fraudDetected: $fraudDetected, receiptUrl: $receiptUrl)';
  }

  @override
  bool operator ==(Object other) {
    return identical(this, other) ||
        (other.runtimeType == runtimeType &&
            other is _$PaymentImpl &&
            (identical(other.id, id) || other.id == id) &&
            (identical(other.amount, amount) || other.amount == amount) &&
            (identical(other.method, method) || other.method == method) &&
            (identical(other.status, status) || other.status == status) &&
            (identical(other.description, description) ||
                other.description == description) &&
            (identical(other.transactionRef, transactionRef) ||
                other.transactionRef == transactionRef) &&
            (identical(other.createdAt, createdAt) ||
                other.createdAt == createdAt) &&
            (identical(other.completedAt, completedAt) ||
                other.completedAt == completedAt) &&
            (identical(other.isPCICompliant, isPCICompliant) ||
                other.isPCICompliant == isPCICompliant) &&
            (identical(other.fraudDetected, fraudDetected) ||
                other.fraudDetected == fraudDetected) &&
            (identical(other.receiptUrl, receiptUrl) ||
                other.receiptUrl == receiptUrl));
  }

  @JsonKey(ignore: true)
  @override
  int get hashCode => Object.hash(
      runtimeType,
      id,
      amount,
      method,
      status,
      description,
      transactionRef,
      createdAt,
      completedAt,
      isPCICompliant,
      fraudDetected,
      receiptUrl);

  @JsonKey(ignore: true)
  @override
  @pragma('vm:prefer-inline')
  _$$PaymentImplCopyWith<_$PaymentImpl> get copyWith =>
      __$$PaymentImplCopyWithImpl<_$PaymentImpl>(this, _$identity);

  @override
  Map<String, dynamic> toJson() {
    return _$$PaymentImplToJson(
      this,
    );
  }
}

abstract class _Payment implements Payment {
  const factory _Payment(
      {required final String id,
      required final double amount,
      required final String method,
      required final TransactionStatus status,
      required final String description,
      final String? transactionRef,
      required final DateTime createdAt,
      final DateTime? completedAt,
      final bool? isPCICompliant,
      final bool? fraudDetected,
      final String? receiptUrl}) = _$PaymentImpl;

  factory _Payment.fromJson(Map<String, dynamic> json) = _$PaymentImpl.fromJson;

  @override
  String get id;
  @override
  double get amount;
  @override
  String get method;
  @override
  TransactionStatus get status;
  @override
  String get description;
  @override
  String? get transactionRef;
  @override
  DateTime get createdAt;
  @override
  DateTime? get completedAt;
  @override
  bool? get isPCICompliant;
  @override
  bool? get fraudDetected;
  @override
  String? get receiptUrl;
  @override
  @JsonKey(ignore: true)
  _$$PaymentImplCopyWith<_$PaymentImpl> get copyWith =>
      throw _privateConstructorUsedError;
}
