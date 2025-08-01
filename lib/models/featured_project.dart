class FeaturedProject {
  final String title;
  final String description;
  final String clientLogo;
  final String appLogo;
  final List<String> technologies;
  final String? playStoreLink;
  final String? appStoreLink;
  final String? webLink;

  const FeaturedProject({
    required this.title,
    required this.description,
    required this.clientLogo,
    required this.appLogo,
    required this.technologies,
    this.playStoreLink,
    this.appStoreLink,
    this.webLink,
  });
}
