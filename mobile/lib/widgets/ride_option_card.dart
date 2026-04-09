import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class RideOptionCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final String price;
  final IconData icon;
  final bool isSelected;
  final VoidCallback onTap;

  const RideOptionCard({
    super.key,
    required this.title,
    required this.subtitle,
    required this.price,
    required this.icon,
    required this.onTap,
    this.isSelected = false,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: isSelected ? AppColors.trustGreen.withOpacity(0.05) : AppColors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? AppColors.trustGreen : AppColors.borderGray,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppColors.ghostWhite,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: AppColors.trustGreen, size: 28),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: AppTypography.bodyLarge.copyWith(fontWeight: FontWeight.bold)),
                  Text(subtitle, style: AppTypography.bodySmall),
                ],
              ),
            ),
            Text(price, style: AppTypography.heading2.copyWith(color: AppColors.onyxBlack)),
          ],
        ),
      ),
    );
  }
}
