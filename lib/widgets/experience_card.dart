// ignore_for_file: deprecated_member_use

import 'package:flutter/material.dart';
import 'package:portfolio/models/experience.dart';
import 'package:portfolio/constants/colors.dart';
import 'package:portfolio/constants/text_styles.dart';

class ExperienceCard extends StatelessWidget {
  final Experience experience;
  final bool isLast;
  final bool isWideScreen;

  const ExperienceCard({
    super.key,
    required this.experience,
    this.isLast = false,
    this.isWideScreen = true,
  });

  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        // Timeline
        if (!isLast)
          Positioned(
            top: 0,
            bottom: 0,
            left: isWideScreen ? 35 : 25,
            child: Container(
              width: 2,
              color: AppColors.accent.withOpacity(0.2),
            ),
          ),
        Padding(
          padding: EdgeInsets.only(left: isWideScreen ? 24 : 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: isWideScreen ? 48 : 40,
                    height: isWideScreen ? 48 : 40,
                    margin: EdgeInsets.only(right: isWideScreen ? 16 : 12),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.white.withOpacity(0.1),
                      border: Border.all(
                        color: AppColors.accent.withOpacity(0.3),
                        width: 1,
                      ),
                    ),
                    padding: EdgeInsets.all(3),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(24),
                      child: Image.asset(
                        'assets/images/${experience.logo}',
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Row(
                          crossAxisAlignment: CrossAxisAlignment.baseline,
                          textBaseline: TextBaseline.alphabetic,
                          children: [
                            Flexible(
                              child: Text(
                                experience.position,
                                style: TextStyles.cardTitle.copyWith(
                                  fontSize: isWideScreen ? null : 18,
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Container(
                              padding: EdgeInsets.symmetric(
                                horizontal: isWideScreen ? 8 : 6,
                                vertical: isWideScreen ? 4 : 3,
                              ),
                              decoration: BoxDecoration(
                                color: AppColors.accent.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                experience.duration,
                                style: TextStyles.chip.copyWith(
                                  fontSize: isWideScreen ? 12 : 10,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          experience.company,
                          style: TextStyles.cardSubtitle.copyWith(
                            fontSize: isWideScreen ? null : 14,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          experience.location,
                          style: TextStyles.body.copyWith(
                            fontStyle: FontStyle.italic,
                            fontSize: isWideScreen ? null : 12,
                          ),
                        ),
                        const SizedBox(height: 20),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: experience.responsibilities
                              .map(
                                (responsibility) => Padding(
                                  padding: const EdgeInsets.only(bottom: 12),
                                  child: Row(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Padding(
                                        padding: EdgeInsets.only(
                                          top: 5,
                                          right: isWideScreen ? 12 : 8,
                                        ),
                                        child: Icon(
                                          Icons.circle,
                                          size: 8,
                                          color: AppColors.accent,
                                        ),
                                      ),
                                      Expanded(
                                        child: Text(
                                          responsibility,
                                          style: TextStyles.body.copyWith(
                                            fontSize: isWideScreen ? null : 13,
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                              )
                              .toList(),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              SizedBox(height: isWideScreen ? 40 : 24),
            ],
          ),
        ),
      ],
    );
  }
}
