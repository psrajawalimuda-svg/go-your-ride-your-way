import 'package:freezed_annotation/freezed_annotation.dart';

part 'payment.freezed.dart';
part 'payment.g.dart';

@freezed
class Payment with _$Payment {
  const factory Payment({
    required String id,
    required double amount,
    required String method,
    required TransactionStatus status,
    required String description,
    String? transactionRef,
    required DateTime createdAt,
    DateTime? completedAt,
    bool? isPCICompliant,
    bool? fraudDetected,
    String? receiptUrl,
  }) = _Payment;

  factory Payment.fromJson(Map<String, dynamic> json) => _$PaymentFromJson(json);
}

enum TransactionStatus { pending, processing, success, failed, refunded }
