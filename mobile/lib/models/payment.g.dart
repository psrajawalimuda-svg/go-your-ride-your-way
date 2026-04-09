// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'payment.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_$PaymentImpl _$$PaymentImplFromJson(Map<String, dynamic> json) =>
    _$PaymentImpl(
      id: json['id'] as String,
      amount: (json['amount'] as num).toDouble(),
      method: json['method'] as String,
      status: $enumDecode(_$TransactionStatusEnumMap, json['status']),
      description: json['description'] as String,
      transactionRef: json['transactionRef'] as String?,
      createdAt: DateTime.parse(json['createdAt'] as String),
      completedAt: json['completedAt'] == null
          ? null
          : DateTime.parse(json['completedAt'] as String),
      isPCICompliant: json['isPCICompliant'] as bool?,
      fraudDetected: json['fraudDetected'] as bool?,
      receiptUrl: json['receiptUrl'] as String?,
    );

Map<String, dynamic> _$$PaymentImplToJson(_$PaymentImpl instance) =>
    <String, dynamic>{
      'id': instance.id,
      'amount': instance.amount,
      'method': instance.method,
      'status': _$TransactionStatusEnumMap[instance.status]!,
      'description': instance.description,
      'transactionRef': instance.transactionRef,
      'createdAt': instance.createdAt.toIso8601String(),
      'completedAt': instance.completedAt?.toIso8601String(),
      'isPCICompliant': instance.isPCICompliant,
      'fraudDetected': instance.fraudDetected,
      'receiptUrl': instance.receiptUrl,
    };

const _$TransactionStatusEnumMap = {
  TransactionStatus.pending: 'pending',
  TransactionStatus.processing: 'processing',
  TransactionStatus.success: 'success',
  TransactionStatus.failed: 'failed',
  TransactionStatus.refunded: 'refunded',
};
