import 'package:flutter/material.dart';
import 'package:portfolio/models/project.dart';
import 'package:portfolio/widgets/project_card.dart';
import 'package:portfolio/widgets/section_header.dart';

class ProjectsPage extends StatelessWidget {
  const ProjectsPage({super.key});

  final List<Project> projects = const [
    Project(
      title: 'Benchmarking System',
      description:
          'Gathering of Electrical and Mechanical parts from more than 50 vehicles to compare multiple vehicles depending on criteria. Helps engineers in decision making to produce high quality with lower cost.',
      technologies: 'Angular JS, ORACLE PL/SQL',
      year: '2021',
      icon: Icons.assessment,
      features: [
        'Database of 1,200+ vehicle components',
        'Multi-criteria comparison engine',
        '3D part visualization with metadata overlay',
        'Cost-performance ratio calculations',
        'Supplier database integration',
        'Automated data validation checks',
        'Version control for component revisions',
        'API integration with Trend Tool',
        'Bulk import/export capabilities',
        'Audit trail for all comparisons',
      ],
    ),
    Project(
      title: 'Trend Tool',
      description:
          'Advanced analytics platform that processes Benchmarking System data to identify patterns and trends in vehicle components, enabling data-driven decision making for automotive engineers.',
      technologies: 'Angular JS, ORACLE PL/SQL, D3.js',
      year: '2021',
      icon: Icons.trending_up,
      features: [
        'Dynamic criteria builder using Benchmarking System database',
        'Real-time trend visualization for mechanical/electrical parts',
        'Customizable time-series analysis (1-5 year trends)',
        'Correlation engine between part attributes and failure rates',
        'Predictive modeling for part lifecycle estimation',
        'Automated report generation with key insights',
        'Team collaboration with shared analysis sessions',
        'Integration with Benchmarking System (shared data models)',
        'Anomaly detection alerts for unusual patterns',
        'Export trends to CAD/PLM software formats',
        'Role-based dashboard (engineer, manager, executive)',
        'Mobile-responsive web interface for field engineers',
      ],
    ),
    Project(
      title: 'Lupark',
      description:
          'A parking management solution that allows drivers to quickly find available parking spots, reserve them in advance and make payments online which the City officials can view in real-time.',
      technologies: 'Flutter, Firebase, Google Maps API',
      year: '2022-Current',
      icon: Icons.local_parking,
      features: [
        'Real-time parking spot availability visualization on interactive maps',
        'Reservation system with time-based booking slots',
        'Digital payment integration (GCash, PayMaya, credit cards)',
        'Admin dashboard for city officials with real-time analytics',
        'Dynamic pricing algorithm for peak/off-peak hours',
        'License plate recognition for VIP parking',
        'User rating and feedback system',
        'Push notifications for reservation reminders',
        'QR code-based entry/exit system',
        'Multi-language support for tourists',
      ],
    ),
    Project(
      title: 'ZPay Wallet',
      description:
          'Uses Quick Response (QR) Technology to pay for fare. Part of an Automated Fare Collection System (AFCS) for modern public utility vehicles.',
      technologies: 'Flutter, Node.js, MySQL',
      year: '2019-2022',
      icon: Icons.account_balance_wallet,
      features: [
        'QR code generation and scanning for fare payments',
        'Digital wallet with balance management',
        'Transaction history with detailed receipts',
        'Offline payment capability for low-connectivity areas',
        'Driver verification system with photo confirmation',
        'Fare calculation based on distance traveled',
        'Auto-top-up feature when balance is low',
        'Loyalty points system for frequent commuters',
        'Real-time transaction synchronization',
        'Admin portal for dispute resolution',
      ],
    ),
    Project(
      title: 'Health Services Management',
      description:
          'Barangay Information System with Data Analytics (Thesis Project). A mobile application that allows doctors/nurses to manage their patients.',
      technologies: 'Flutter, Firebase',
      year: 'Freelance',
      icon: Icons.medical_services,
      features: [
        'Patient registration with biometric verification',
        'Electronic medical records system',
        'Appointment scheduling with SMS reminders',
        'Inventory management for medical supplies',
        'Disease outbreak heatmap visualization',
        'Prescription generation with barcode system',
        'Telemedicine consultation module',
        'Vaccination tracking with automated follow-ups',
        'Data analytics dashboard for public health trends',
        'Offline-first design for rural areas',
        'Multi-user roles (doctor, nurse, admin)',
        'Secure HIPAA-compliant data storage',
      ],
    ),
  ];

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 100),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SectionHeader(
            title: 'My Projects',
            subtitle:
                'A collection of my work across different domains and technologies',
          ),
          const SizedBox(height: 60),
          GridView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: MediaQuery.of(context).size.width > 1000
                  ? 3
                  : MediaQuery.of(context).size.width > 600
                  ? 2
                  : 1,
              crossAxisSpacing: 24,
              mainAxisSpacing: 24,
              childAspectRatio: 0.9,
            ),
            itemCount: projects.length,
            itemBuilder: (context, index) =>
                ProjectCard(project: projects[index]),
          ),
        ],
      ),
    );
  }
}
