// ignore_for_file: deprecated_member_use

import 'package:flutter/material.dart';
import 'package:portfolio/constants/text_styles.dart';

class SectionHeader extends StatelessWidget {
  final String title;
  final String subtitle;

  const SectionHeader({super.key, required this.title, required this.subtitle});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: TextStyles.sectionTitle),
        const SizedBox(height: 12),
        Text(
          subtitle,
          style: TextStyles.sectionSubtitle.copyWith(
            color: Colors.white.withOpacity(0.7),
          ),
        ),
      ],
    );
  }
}
