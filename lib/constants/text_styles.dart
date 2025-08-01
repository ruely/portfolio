import 'package:flutter/material.dart';
import 'package:portfolio/constants/colors.dart';

class TextStyles {
  static const TextStyle navTitle = TextStyle(
    fontSize: 18,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    letterSpacing: 1.2,
  );

  static const TextStyle heading1 = TextStyle(
    fontSize: 72,
    fontWeight: FontWeight.bold,
    color: AppColors.text,
    height: 1.1,
  );

  static const TextStyle heading2 = TextStyle(
    fontSize: 48,
    fontWeight: FontWeight.w600,
    color: AppColors.text,
  );

  static const TextStyle heading3 = TextStyle(
    fontSize: 32,
    fontWeight: FontWeight.w500,
    color: AppColors.text,
  );

  static const TextStyle sectionTitle = TextStyle(
    fontSize: 40,
    fontWeight: FontWeight.w600,
    color: AppColors.text,
  );

  static const TextStyle sectionSubtitle = TextStyle(
    fontSize: 18,
    color: AppColors.textSecondary,
  );

  static const TextStyle cardTitle = TextStyle(
    fontSize: 24,
    fontWeight: FontWeight.w600,
    color: AppColors.text,
  );

  static const TextStyle cardSubtitle = TextStyle(
    fontSize: 16,
    color: AppColors.textSecondary,
  );

  static const TextStyle body = TextStyle(
    fontSize: 16,
    height: 1.6,
    color: AppColors.textSecondary,
  );

  static const TextStyle button = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w500,
    color: AppColors.accent,
  );

  static const TextStyle chip = TextStyle(
    fontSize: 14,
    color: AppColors.accent,
  );
}
