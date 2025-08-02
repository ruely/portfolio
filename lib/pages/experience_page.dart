import 'package:flutter/material.dart';
import 'package:portfolio/models/experience.dart';
import 'package:portfolio/widgets/experience_card.dart';
import 'package:portfolio/widgets/section_header.dart';

class ExperiencePage extends StatelessWidget {
  const ExperiencePage({super.key});

  final List<Experience> experiences = const [
    Experience(
      position: 'Web & Mobile Developer',
      company: 'GC & C Group of Companies',
      location: 'Bacolod, Philippines',
      duration: '2022 - Current',
      responsibilities: [
        'Developed lupark - a parking management solution',
        'Created luvpay - parking payment app',
        'Built luvfare - Automated Fare Collection System',
        'Developed LuvRegistration system',
        'Implemented Towing app for service providers',
        'Created GPS tracking application',
      ],
      logo: 'gc_c_logo.png',
    ),
    Experience(
      position: 'Web & Mobile Developer',
      company: 'ZettaSolutions, Inc.',
      location: 'Cebu, Philippines',
      duration: '2019 - 2022',
      responsibilities: [
        'Developed ZPay Wallet using QR Technology',
        'Created ZFare - Automated Fare Collection System',
        'Implemented ZLoad - credit loading app',
        'Developed CRM system',
        'Built HCM system for HR functions',
        'Created FMIS for vehicle tracking',
        'Worked on Benchmarking System',
        'Developed Trend Tool for data analysis',
        'Implemented Material Tracking database',
      ],
      logo: 'zettasolutions_logo.png',
    ),
    Experience(
      position: 'Web Developer (Intern)',
      company: 'Litecloud Corporation',
      location: 'Cebu, Philippines',
      duration: '2017 - 2019',
      responsibilities: [
        'Developed CFUND - accounting system',
        'Created BUILDYX - team management system',
        'Implemented PEMASYS - payroll system',
      ],
      logo: 'litecloud_logo.png',
    ),
  ];
  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;

    // Responsive padding calculation
    final horizontalPadding = screenWidth > 1400
        ? 120.0
        : screenWidth > 1000
        ? 80.0
        : screenWidth > 800
        ? 60.0
        : screenWidth > 600
        ? 40.0
        : 24.0;

    return SingleChildScrollView(
      padding: EdgeInsets.symmetric(
        horizontal: horizontalPadding,
        vertical: screenWidth > 600 ? 100 : 60,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SectionHeader(
            title: 'Professional Experience',
            subtitle: 'My journey through different companies and roles',
          ),
          const SizedBox(height: 60),
          LayoutBuilder(
            builder: (context, constraints) {
              final isWideLayout = constraints.maxWidth > 800;

              return ListView.separated(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: experiences.length,
                separatorBuilder: (context, index) =>
                    SizedBox(height: isWideLayout ? 60 : 40),
                itemBuilder: (context, index) => ExperienceCard(
                  experience: experiences[index],
                  isLast: index == experiences.length - 1,
                  isWideScreen: isWideLayout,
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
