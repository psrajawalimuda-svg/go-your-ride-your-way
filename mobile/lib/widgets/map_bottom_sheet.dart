import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class MapBottomSheet extends StatelessWidget {
  final List<Widget> children;
  final String? title;

  const MapBottomSheet({
    super.key,
    required this.children,
    this.title,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.white,
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(24),
          topRight: Radius.circular(24),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 10,
            spreadRadius: 2,
          ),
        ],
      ),
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: AppColors.borderGray,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 16),
          if (title != null) ...[
            Text(title!, style: AppTypography.heading2),
            const SizedBox(height: 16),
          ],
          ...children,
          const SizedBox(height: 20),
        ],
      ),
    );
  }
}
