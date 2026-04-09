import 'package:freezed_annotation/freezed_annotation.dart';

part 'user.freezed.dart';
part 'user.g.dart';

@freezed
class User with _$User {
  const factory User({
    required String id,
    required String name,
    required String email,
    required String phone,
    String? avatar,
    required String role,
    required DateTime createdAt,
    Map<String, dynamic>? preferences,
    List<String>? paymentMethods,
    List<String>? rideHistory,
  }) = _User;

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
}
