// ignore_for_file: deprecated_member_use

import 'package:flutter/material.dart';
import 'package:portfolio/constants/colors.dart';
import 'package:portfolio/constants/text_styles.dart';
import 'package:portfolio/widgets/glass_card.dart';
import 'package:portfolio/widgets/section_header.dart';

class EducationPage extends StatelessWidget {
  const EducationPage({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 100),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SectionHeader(
            title: 'Education & Skills',
            subtitle: 'My academic background and technical capabilities',
          ),
          const SizedBox(height: 60),
          GlassCard(
            child: Padding(
              padding: const EdgeInsets.all(32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Tamiao Integrated School.',
                    style: TextStyles.cardTitle,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Elementary (2002-2008)',
                    style: TextStyles.cardSubtitle,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Bantayan, Cebu, Philippines',
                    style: TextStyles.body.copyWith(
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Divider(),
                  Text(
                    'San Agustin National High School.',
                    style: TextStyles.cardTitle,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Junior High (2014-2016)',
                    style: TextStyles.cardSubtitle,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Madridejos, Cebu, Philippines',
                    style: TextStyles.body.copyWith(
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Divider(),
                  Text(
                    'CITE Technical Institute Inc.',
                    style: TextStyles.cardTitle,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Computer Engineering Technology (2016-2019)',
                    style: TextStyles.cardSubtitle,
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Cebu, Philippines',
                    style: TextStyles.body.copyWith(
                      fontStyle: FontStyle.italic,
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Divider(),
                  const SizedBox(height: 24),
                  Text('Technical Skills', style: TextStyles.sectionSubtitle),
                  const SizedBox(height: 20),
                  Wrap(
                    spacing: 12,
                    runSpacing: 12,
                    children:
                        [
                          'Flutter',
                          'Dart',
                          'Firebase',
                          'JavaScript',
                          'JQuery',
                          'PHP',
                          'Laravel',
                          'MS SQL Server',
                          'MySQL',
                          'Angular JS',
                          'ORACLE PL/SQL',
                          'APEX',
                          'Java',
                          'Python',
                          'C#',
                          'C++',
                          'JSON',
                          'Nodejs',
                          'HTML/CSS',
                          'Git',
                        ].map((skill) {
                          return Container(
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(8),
                              gradient: LinearGradient(
                                colors: [
                                  AppColors.accent.withOpacity(0.3),
                                  AppColors.accent.withOpacity(0.1),
                                ],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                              border: Border.all(
                                color: AppColors.accent.withOpacity(0.5),
                                width: 1,
                              ),
                            ),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 6,
                            ),
                            child: Text(
                              skill,
                              style: TextStyles.chip.copyWith(
                                color: AppColors.accent,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          );
                        }).toList(),
                  ),
                  const SizedBox(height: 24),
                  const Divider(),
                  const SizedBox(height: 24),
                  Text('Tools & Platforms', style: TextStyles.sectionSubtitle),
                  const SizedBox(height: 20),
                  Wrap(
                    spacing: 12,
                    runSpacing: 12,
                    children:
                        [
                          'Android Studio',
                          'VS Code',
                          'Visual Studio',
                          'Xcode',
                          'GitHub',
                          'GitLab',
                          'Docker',
                          'Xampp',
                          'Firebase',
                          'Postman',
                          'Trello',
                          'Jira',
                          'Figma',
                        ].map((tool) {
                          return Container(
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(8),
                              gradient: LinearGradient(
                                colors: [
                                  AppColors.accent.withOpacity(0.3),
                                  AppColors.accent.withOpacity(0.1),
                                ],
                                begin: Alignment.topLeft,
                                end: Alignment.bottomRight,
                              ),
                              border: Border.all(
                                color: AppColors.accent.withOpacity(0.5),
                                width: 1,
                              ),
                            ),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 12,
                              vertical: 6,
                            ),
                            child: Text(
                              tool,
                              style: TextStyles.chip.copyWith(
                                color: AppColors.accent,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          );
                        }).toList(),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
