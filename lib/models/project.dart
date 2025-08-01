import 'package:flutter/material.dart';

class Project {
  final String title;
  final String description;
  final String technologies;
  final String year;
  final IconData icon;
  final List<String>? features;

  const Project({
    required this.title,
    required this.description,
    required this.technologies,
    required this.year,
    required this.icon,
    required this.features,
  });
}
