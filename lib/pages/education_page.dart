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
    final screenWidth = MediaQuery.of(context).size.width;

    // Responsive padding calculation
    final horizontalPadding = screenWidth > 1200
        ? 80.0
        : screenWidth > 800
        ? 60.0
        : screenWidth > 600
        ? 40.0
        : 24.0;

    return SingleChildScrollView(
      padding: EdgeInsets.symmetric(
        horizontal: horizontalPadding,
        vertical: 100,
      ),
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
              padding: EdgeInsets.all(screenWidth > 800 ? 32 : 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Education Items
                  _buildEducationItem(
                    context,
                    institution: 'Tamiao Integrated School',
                    period: 'Elementary (2002-2008)',
                    location: 'Bantayan, Cebu, Philippines',
                  ),
                  const SizedBox(height: 24),
                  const Divider(),

                  _buildEducationItem(
                    context,
                    institution: 'San Agustin National High School',
                    period: 'Junior High (2014-2016)',
                    location: 'Madridejos, Cebu, Philippines',
                  ),
                  const SizedBox(height: 24),
                  const Divider(),

                  _buildEducationItem(
                    context,
                    institution: 'CITE Technical Institute Inc.',
                    period: 'Computer Engineering Technology (2016-2019)',
                    location: 'Cebu, Philippines',
                  ),
                  const SizedBox(height: 24),
                  const Divider(),
                  const SizedBox(height: 24),

                  // Skills Section
                  Text('Technical Skills', style: TextStyles.sectionSubtitle),
                  const SizedBox(height: 20),
                  _buildSkillsGrid(context, [
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
                  ]),

                  const SizedBox(height: 24),
                  const Divider(),
                  const SizedBox(height: 24),

                  // Tools Section
                  Text('Tools & Platforms', style: TextStyles.sectionSubtitle),
                  const SizedBox(height: 20),
                  _buildSkillsGrid(context, [
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
                  ]),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEducationItem(
    BuildContext context, {
    required String institution,
    required String period,
    required String location,
  }) {
    final isLargeScreen = MediaQuery.of(context).size.width > 800;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          institution,
          style: TextStyles.cardTitle.copyWith(
            fontSize: isLargeScreen ? null : 20,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          period,
          style: TextStyles.cardSubtitle.copyWith(
            fontSize: isLargeScreen ? null : 14,
          ),
        ),
        const SizedBox(height: 16),
        Text(
          location,
          style: TextStyles.body.copyWith(
            fontStyle: FontStyle.italic,
            fontSize: isLargeScreen ? null : 13,
          ),
        ),
      ],
    );
  }

  Widget _buildSkillsGrid(BuildContext context, List<String> items) {
    return Wrap(
      spacing: 12,
      runSpacing: 12,
      children: items.map((tool) {
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
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          child: Text(
            tool,
            style: TextStyles.chip.copyWith(
              color: AppColors.accent,
              fontWeight: FontWeight.w500,
            ),
          ),
        );
      }).toList(),
    );
  }
}
