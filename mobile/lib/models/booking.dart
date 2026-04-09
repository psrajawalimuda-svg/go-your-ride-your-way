import 'package:freezed_annotation/freezed_annotation.dart';

part 'booking.freezed.dart';
part 'booking.g.dart';

@freezed
class Booking with _$Booking {
  const factory Booking({
    required String id,
    required String userId,
    required ShuttleSchedule schedule,
    required List<int> seats,
    required List<ShuttlePassenger> passengers,
    required BookingStatus status,
    required double totalPrice,
    String? paymentId,
    required DateTime createdAt,
    String? specialRequirements,
  }) = _Booking;

  factory Booking.fromJson(Map<String, dynamic> json) => _$BookingFromJson(json);
}

@freezed
class ShuttleSchedule with _$ShuttleSchedule {
  const factory ShuttleSchedule({
    required String id,
    required String from,
    required String to,
    required String departure,
    required String arrival,
    required String duration,
    required double price,
    required String operator,
    required int totalSeats,
    required int availableSeats,
  }) = _ShuttleSchedule;

  factory ShuttleSchedule.fromJson(Map<String, dynamic> json) => _$ShuttleScheduleFromJson(json);
}

@freezed
class ShuttlePassenger with _$ShuttlePassenger {
  const factory ShuttlePassenger({
    required String name,
    required String phone,
    required String email,
  }) = _ShuttlePassenger;

  factory ShuttlePassenger.fromJson(Map<String, dynamic> json) => _$ShuttlePassengerFromJson(json);
}

enum BookingStatus { pending, confirmed, completed, cancelled }
