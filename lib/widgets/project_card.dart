// ignore_for_file: deprecated_member_use

import 'package:flutter/material.dart';
import 'package:portfolio/models/project.dart';
import 'package:portfolio/constants/colors.dart';
import 'package:portfolio/constants/text_styles.dart';
import 'package:portfolio/widgets/glass_card.dart';
import '../dialogs/project_dialog.dart';

class ProjectCard extends StatelessWidget {
  final Project project;
  final bool isWideScreen;

  const ProjectCard({
    super.key,
    required this.project,
    this.isWideScreen = true,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => _showProjectDialog(context),
      child: GlassCard(
        child: Padding(
          padding: EdgeInsets.all(isWideScreen ? 24 : 18),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Icon Container
              Container(
                width: isWideScreen ? 50 : 42,
                height: isWideScreen ? 50 : 42,
                decoration: BoxDecoration(
                  color: AppColors.accent.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(
                  project.icon,
                  color: AppColors.accent,
                  size: isWideScreen ? 28 : 24,
                ),
              ),
              SizedBox(height: isWideScreen ? 20 : 16),

              // Title and Year
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Text(
                      project.title,
                      style: TextStyles.cardTitle.copyWith(
                        fontSize: isWideScreen ? 22 : 18,
                      ),
                    ),
                  ),
                  Container(
                    padding: EdgeInsets.symmetric(
                      horizontal: isWideScreen ? 12 : 10,
                      vertical: isWideScreen ? 6 : 4,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.accent.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(
                      project.year,
                      style: TextStyles.chip.copyWith(
                        color: AppColors.accent,
                        fontSize: isWideScreen ? 12 : 11,
                      ),
                    ),
                  ),
                ],
              ),
              SizedBox(height: isWideScreen ? 16 : 12),

              // Description
              Expanded(
                child: Text(
                  project.description,
                  style: TextStyles.body.copyWith(
                    fontSize: isWideScreen ? 14 : 13,
                  ),
                  maxLines: isWideScreen ? 4 : 3,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              SizedBox(height: isWideScreen ? 16 : 12),

              // Technologies
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: project.technologies.split(', ').map((tech) {
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
                    padding: EdgeInsets.symmetric(
                      horizontal: isWideScreen ? 12 : 10,
                      vertical: isWideScreen ? 6 : 4,
                    ),
                    child: Text(
                      tech.trim(),
                      style: TextStyles.chip.copyWith(
                        color: AppColors.accent,
                        fontWeight: FontWeight.w500,
                        fontSize: isWideScreen ? 13 : 12,
                      ),
                    ),
                  );
                }).toList(),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showProjectDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (context) => Dialog(
        backgroundColor: Colors.transparent,
        insetPadding: EdgeInsets.all(isWideScreen ? 40 : 20),
        child: ProjectDialog(project: project),
      ),
    );
  }
}
