import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AppColors {
  // PYU GO Branding Identity
  static const Color pyuBlue = Color(0xFF1E293B); // Dark Navy from 'PYU'
  static const Color goGreen = Color(0xFF22C55E); // Emerald from 'GO'
  static const Color accentBlue = Color(0xFF3B82F6); // Bright Blue from icon
  
  // Theme Overrides
  static const Color trustGreen = goGreen;
  static const Color mobilityBlue = pyuBlue;
  static const Color warningAmber = Color(0xFFF59E0B);
  
  // Neutral Palette
  static const Color onyxBlack = Color(0xFF0F172A); // Rich Black
  static const Color slateGray = Color(0xFF64748B); // Slate Blue-Gray
  static const Color ghostWhite = Color(0xFFF8FAFC); // Cleanest White
  static const Color borderGray = Color(0xFFE2E8F0); // Subtle Border
  
  // System
  static const Color errorRed = Color(0xFFEF4444);
  static const Color white = Colors.white;
}

class AppTypography {
  static final TextStyle display = GoogleFonts.plusJakartaSans(
    fontSize: 32,
    fontWeight: FontWeight.bold,
    color: AppColors.onyxBlack,
  );

  static final TextStyle heading1 = GoogleFonts.plusJakartaSans(
    fontSize: 24,
    fontWeight: FontWeight.bold,
    color: AppColors.onyxBlack,
  );

  static final TextStyle heading2 = GoogleFonts.plusJakartaSans(
    fontSize: 20,
    fontWeight: FontWeight.w600,
    color: AppColors.onyxBlack,
  );

  static final TextStyle bodyLarge = GoogleFonts.plusJakartaSans(
    fontSize: 16,
    fontWeight: FontWeight.w500,
    color: AppColors.onyxBlack,
  );

  static final TextStyle bodySmall = GoogleFonts.plusJakartaSans(
    fontSize: 14,
    fontWeight: FontWeight.normal,
    color: AppColors.slateGray,
  );

  static final TextStyle micro = GoogleFonts.plusJakartaSans(
    fontSize: 12,
    fontWeight: FontWeight.normal,
    color: AppColors.slateGray,
  );
}

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      primaryColor: AppColors.trustGreen,
      scaffoldBackgroundColor: AppColors.ghostWhite,
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.trustGreen,
        primary: AppColors.trustGreen,
        secondary: AppColors.mobilityBlue,
        error: AppColors.errorRed,
        surface: AppColors.white,
      ),
      textTheme: TextTheme(
        displayLarge: AppTypography.display,
        headlineLarge: AppTypography.heading1,
        headlineMedium: AppTypography.heading2,
        bodyLarge: AppTypography.bodyLarge,
        bodyMedium: AppTypography.bodySmall,
        labelSmall: AppTypography.micro,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.trustGreen,
          foregroundColor: Colors.white,
          minimumSize: const Size.fromHeight(56),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          textStyle: AppTypography.bodyLarge.copyWith(color: Colors.white),
        ),
      ),
      cardTheme: CardThemeData(
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
          side: const BorderSide(color: AppColors.borderGray),
        ),
        color: AppColors.white,
      ),
    );
  }
}
