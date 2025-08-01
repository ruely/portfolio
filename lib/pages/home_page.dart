// ignore_for_file: deprecated_member_use

import 'package:flutter/material.dart';
import 'package:portfolio/models/featured_project.dart';
import 'package:portfolio/models/professional_milestone.dart';
import 'package:portfolio/pages/experience_page.dart';
import 'package:portfolio/pages/projects_page.dart';
import 'package:portfolio/pages/education_page.dart';
import 'package:portfolio/constants/colors.dart';
import 'package:portfolio/constants/text_styles.dart';
import 'package:portfolio/widgets/glass_card.dart';
import 'package:url_launcher/url_launcher.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        centerTitle: false,
      ),
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [AppColors.backgroundDark, AppColors.backgroundLight],
          ),
        ),
        child: Stack(
          children: [
            // Background elements
            Positioned(
              top: -100,
              right: -100,
              child: Container(
                width: 300,
                height: 300,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: AppColors.accent.withOpacity(0.1),
                ),
              ),
            ),
            // Content
            IndexedStack(
              index: _currentIndex,
              children: const [
                _HomeContent(),
                ProjectsPage(),
                ExperiencePage(),
                EducationPage(),
              ],
            ),
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomNavBar(),
      floatingActionButton: FloatingActionButton(
        onPressed: () => launchUrl(Uri.parse('mailto:ruel.ybanez18@gmail.com')),
        backgroundColor: AppColors.accent,
        child: const Icon(Icons.email, color: Colors.white),
      ),
    );
  }

  Widget _buildBottomNavBar() {
    return Container(
      margin: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(30),
        color: Colors.black.withOpacity(0.3),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 20,
            spreadRadius: 2,
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(30),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) => setState(() => _currentIndex = index),
          backgroundColor: Colors.transparent,
          elevation: 0,
          type: BottomNavigationBarType.fixed,
          selectedItemColor: Colors.white,
          unselectedItemColor: Colors.white.withOpacity(0.6),
          showSelectedLabels: false,
          showUnselectedLabels: false,
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.person_outline),
              activeIcon: Icon(Icons.person),
              label: 'About',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.work_outline),
              activeIcon: Icon(Icons.work),
              label: 'Projects',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.business_center_outlined),
              activeIcon: Icon(Icons.business_center),
              label: 'Experience',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.school_outlined),
              activeIcon: Icon(Icons.school),
              label: 'Education',
            ),
          ],
        ),
      ),
    );
  }
}

class _HomeContent extends StatelessWidget {
  const _HomeContent();

  final List<FeaturedProject> featuredProjects = const [
    FeaturedProject(
      title: 'luvpark',
      description: 'Smart parking management system for cities',
      clientLogo: 'assets/images/gc_c_logo.png',
      appLogo: 'assets/images/luvpark_logo.png',
      appStoreLink: 'https://apps.apple.com/ph/app/luvpark/id6473724622',
      playStoreLink:
          'https://play.google.com/store/apps/details?id=com.cmds.luvpark',
      technologies: ['Flutter', 'Firebase', 'Google Maps'],
    ),
    FeaturedProject(
      title: 'ZPay Wallet',
      description: 'QR-based fare payment system for public transport',
      clientLogo: 'assets/images/zettasolutions_logo.png',
      appLogo: 'assets/images/zpay_logo.png',
      technologies: ['Flutter', 'Node.js', 'MySQL'],
    ),
  ];

  final List<ProfessionalMilestone> milestones = const [
    ProfessionalMilestone(
      year: '2022-Present',
      title: 'Senior Flutter Developer',
      company: 'GC&C Group of Companies',
      description: 'Leading mobile development for smart city solutions',
      logo: 'assets/images/gc_c_logo.png',
    ),
    ProfessionalMilestone(
      year: '2019-2022',
      title: 'Flutter Developer',
      company: 'ZettaSolutions',
      description: 'Built transportation and payment systems',
      logo: 'assets/images/zettasolutions_logo.png',
    ),
    ProfessionalMilestone(
      year: '2017-2019',
      title: 'Web Developer Intern',
      company: 'Litecloud',
      description: 'Developed business management systems',
      logo: 'assets/images/litecloud_logo.png',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final isWideScreen = MediaQuery.of(context).size.width > 800;
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 100),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Hello, I\'m',
                      style: TextStyles.heading2.copyWith(
                        color: AppColors.accent,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Ruel Ybañez',
                      style: TextStyles.heading1.copyWith(
                        fontSize: isWideScreen ? 72 : 48,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      'Web & Web Developer',
                      style: TextStyles.heading3.copyWith(
                        color: Colors.white.withOpacity(0.8),
                        fontSize: isWideScreen ? 32 : 24,
                      ),
                    ),
                    const SizedBox(height: 24),
                    Text(
                      'I build exceptional digital experiences with Flutter. '
                      '5+ years crafting mobile and web applications that solve '
                      'real-world problems.',
                      style: TextStyles.body.copyWith(
                        fontSize: isWideScreen ? 16 : 14,
                      ),
                    ),
                    const SizedBox(height: 32),
                    Wrap(
                      spacing: 16,
                      runSpacing: 16,
                      children: [
                        _buildContactButton(
                          icon: Icons.email,
                          text: 'Email Me',
                          onTap: () => launchUrl(
                            Uri.parse('mailto:ruel.ybanez18@gmail.com'),
                          ),
                        ),
                        _buildContactButton(
                          icon: Icons.phone,
                          text: 'Call Me',
                          onTap: () =>
                              launchUrl(Uri.parse('tel:+639617019129')),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              if (isWideScreen) // Only show picture on wider screens
                Padding(
                  padding: const EdgeInsets.only(left: 80),
                  child: GlassCard(
                    width: 300,
                    height: 300,
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: Image.asset(
                        'assets/images/profile.jpg',
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 80),

          Text('Featured Projects', style: TextStyles.sectionTitle),
          const SizedBox(height: 12),
          Text(
            'Selected projects that showcase my technical capabilities',
            style: TextStyles.sectionSubtitle,
          ),
          const SizedBox(height: 40),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: MediaQuery.of(context).size.width > 800 ? 2 : 1,
              crossAxisSpacing: 24,
              mainAxisSpacing: 24,
              childAspectRatio: 1.5,
            ),
            itemCount: featuredProjects.length,
            itemBuilder: (context, index) =>
                _buildProjectCard(featuredProjects[index]),
          ),
          const SizedBox(height: 80),

          Text('Professional Journey', style: TextStyles.sectionTitle),
          const SizedBox(height: 12),
          Text(
            'Key milestones in my career development',
            style: TextStyles.sectionSubtitle,
          ),
          const SizedBox(height: 40),
          Column(
            children: [
              for (int i = 0; i < milestones.length; i++)
                _buildMilestoneCard(milestones[i], i == milestones.length - 1),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildContactButton({
    required IconData icon,
    required String text,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: AppColors.accent.withOpacity(0.3)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 20, color: AppColors.accent),
            const SizedBox(width: 8),
            Text(text, style: TextStyles.button),
          ],
        ),
      ),
    );
  }

  Widget _buildProjectCard(FeaturedProject project) {
    return GestureDetector(
      onTap: () {
        if (project.webLink != null) {
          launchUrl(Uri.parse(project.webLink!));
        }
      },
      child: GlassCard(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  // Client Logo
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(8),
                      color: Colors.white,
                    ),
                    padding: const EdgeInsets.all(4),
                    child: Image.asset(project.clientLogo),
                  ),
                  const SizedBox(width: 12),
                  // App Logo
                  Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: AppColors.accent.withOpacity(0.3),
                      ),
                    ),
                    child: Image.asset(project.appLogo),
                  ),
                ],
              ),
              const SizedBox(height: 20),
              Text(project.title, style: TextStyles.cardTitle),
              const SizedBox(height: 8),
              Text(
                project.description,
                style: TextStyles.body.copyWith(fontSize: 14),
              ),
              const Spacer(),
              // Store badges row
              if (project.playStoreLink != null ||
                  project.appStoreLink != null ||
                  project.webLink != null)
                Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: Wrap(
                    spacing: 12,
                    runSpacing: 12,
                    children: [
                      if (project.playStoreLink != null)
                        GestureDetector(
                          onTap: () =>
                              launchUrl(Uri.parse(project.playStoreLink!)),
                          child: Container(
                            height: 40,
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(8),
                              color: Colors.black.withOpacity(0.2),
                            ),
                            padding: const EdgeInsets.symmetric(horizontal: 12),
                            child: Image.asset(
                              'assets/images/play_store.png',
                              height: 30,
                            ),
                          ),
                        ),
                      if (project.appStoreLink != null)
                        GestureDetector(
                          onTap: () =>
                              launchUrl(Uri.parse(project.appStoreLink!)),
                          child: Container(
                            height: 40,
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(8),
                              color: Colors.black.withOpacity(0.2),
                            ),
                            padding: const EdgeInsets.symmetric(horizontal: 12),
                            child: Image.asset(
                              'assets/images/app_store.png',
                              height: 30,
                            ),
                          ),
                        ),
                      if (project.webLink != null)
                        GestureDetector(
                          onTap: () => launchUrl(Uri.parse(project.webLink!)),
                          child: Container(
                            height: 40,
                            decoration: BoxDecoration(
                              borderRadius: BorderRadius.circular(8),
                              color: Colors.black.withOpacity(0.2),
                            ),
                            padding: const EdgeInsets.symmetric(horizontal: 12),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(
                                  Icons.public,
                                  color: Colors.white,
                                  size: 20,
                                ),
                                const SizedBox(width: 6),
                                Text(
                                  'Visit Website',
                                  style: TextStyles.chip.copyWith(
                                    color: Colors.white,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              // Technologies chips
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: project.technologies
                    .map(
                      (tech) => Container(
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
                          tech,
                          style: TextStyles.chip.copyWith(
                            color: AppColors.accent,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ),
                    )
                    .toList(),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildMilestoneCard(ProfessionalMilestone milestone, bool isLast) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final isMobile = constraints.maxWidth < 600;

        return Container(
          margin: EdgeInsets.only(bottom: isMobile ? 16 : 24),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Year and timeline - always visible
              SizedBox(
                width: isMobile ? 60 : 80,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Text(
                      milestone.year,
                      style: TextStyles.cardSubtitle.copyWith(
                        fontSize: isMobile ? 12 : 14,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 8),
                    Container(
                      width: 2,
                      height: isLast ? 20 : (isMobile ? 40 : 60),
                      color: AppColors.accent.withOpacity(0.3),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              // Content card - responsive layout
              Expanded(
                child: GlassCard(
                  child: Padding(
                    padding: EdgeInsets.all(isMobile ? 12 : 16),
                    child: isMobile
                        ? Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  // Company Logo - smaller on mobile
                                  Container(
                                    width: 40,
                                    height: 40,
                                    padding: const EdgeInsets.all(4),
                                    decoration: BoxDecoration(
                                      borderRadius: BorderRadius.circular(8),
                                      color: Colors.white.withOpacity(0.1),
                                    ),
                                    child: Image.asset(milestone.logo),
                                  ),
                                  const SizedBox(width: 12),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          milestone.title,
                                          style: TextStyles.cardTitle.copyWith(
                                            fontSize: 16,
                                          ),
                                        ),
                                        Text(
                                          milestone.company,
                                          style: TextStyles.cardSubtitle
                                              .copyWith(fontSize: 12),
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 12),
                              Text(
                                milestone.description,
                                style: TextStyles.body.copyWith(fontSize: 12),
                              ),
                            ],
                          )
                        : Row(
                            children: [
                              // Company Logo - regular size
                              Container(
                                width: 60,
                                height: 60,
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  borderRadius: BorderRadius.circular(8),
                                  color: Colors.white.withOpacity(0.1),
                                ),
                                child: Image.asset(milestone.logo),
                              ),
                              const SizedBox(width: 16),
                              // Details
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      milestone.title,
                                      style: TextStyles.cardTitle,
                                    ),
                                    Text(
                                      milestone.company,
                                      style: TextStyles.cardSubtitle,
                                    ),
                                    const SizedBox(height: 8),
                                    Text(
                                      milestone.description,
                                      style: TextStyles.body.copyWith(
                                        fontSize: 14,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
