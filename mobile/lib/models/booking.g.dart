// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'booking.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$BookingImpl _$$BookingImplFromJson(Map<String, dynamic> json) =>
    _$BookingImpl(
      id: json['id'] as String,
      userId: json['userId'] as String,
      schedule:
          ShuttleSchedule.fromJson(json['schedule'] as Map<String, dynamic>),
      seats: (json['seats'] as List<dynamic>)
          .map((e) => (e as num).toInt())
          .toList(),
      passengers: (json['passengers'] as List<dynamic>)
          .map((e) => ShuttlePassenger.fromJson(e as Map<String, dynamic>))
          .toList(),
      status: $enumDecode(_$BookingStatusEnumMap, json['status']),
      totalPrice: (json['totalPrice'] as num).toDouble(),
      paymentId: json['paymentId'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      specialRequirements: json['specialRequirements'] as String?,
    );

Map<String, dynamic> _$$BookingImplToJson(_$BookingImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'userId': instance.userId,
      'schedule': instance.schedule,
      'seats': instance.seats,
      'passengers': instance.passengers,
      'status': _$BookingStatusEnumMap[instance.status]!,
      'totalPrice': instance.totalPrice,
      'paymentId': instance.paymentId,
      'createdAt': instance.createdAt.toIso8601String(),
      'specialRequirements': instance.specialRequirements,
    };

const _$BookingStatusEnumMap = {
  BookingStatus.pending: 'pending',
  BookingStatus.confirmed: 'confirmed',
  BookingStatus.completed: 'completed',
  BookingStatus.cancelled: 'cancelled',
};

_$ShuttleScheduleImpl _$$ShuttleScheduleImplFromJson(
        Map<String, dynamic> json) =>
    _$ShuttleScheduleImpl(
      id: json['id'] as String,
      from: json['from'] as String,
      to: json['to'] as String,
      departure: json['departure'] as String,
      arrival: json['arrival'] as String,
      duration: json['duration'] as String,
      price: (json['price'] as num).toDouble(),
      operator: json['operator'] as String,
      totalSeats: (json['totalSeats'] as num).toInt(),
      availableSeats: (json['availableSeats'] as num).toInt(),
    );

Map<String, dynamic> _$$ShuttleScheduleImplToJson(
        _$ShuttleScheduleImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'from': instance.from,
      'to': instance.to,
      'departure': instance.departure,
      'arrival': instance.arrival,
      'duration': instance.duration,
      'price': instance.price,
      'operator': instance.operator,
      'totalSeats': instance.totalSeats,
      'availableSeats': instance.availableSeats,
    };

_$ShuttlePassengerImpl _$$ShuttlePassengerImplFromJson(
        Map<String, dynamic> json) =>
    _$ShuttlePassengerImpl(
      name: json['name'] as String,
      phone: json['phone'] as String,
      email: json['email'] as String,
    );

Map<String, dynamic> _$$ShuttlePassengerImplToJson(
        _$ShuttlePassengerImpl instance) =>
    <String, dynamic>{
      'name': instance.name,
      'phone': instance.phone,
      'email': instance.email,
    };
