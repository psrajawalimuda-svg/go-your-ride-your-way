import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class LocationPin extends StatelessWidget {
  final bool isDestination;

  const LocationPin({super.key, this.isDestination = false});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(8),
      decoration: BoxDecoration(
        color: isDestination ? AppColors.mobilityBlue : AppColors.trustGreen,
        shape: BoxShape.circle,
        border: Border.all(color: Colors.white, width: 2),
        boxShadow: [
          BoxShadow(
            color: Colors.black26,
            blurRadius: 8,
            offset: Offset(0, 4),
          ),
        ],
      ),
      child: Icon(
        isDestination ? Icons.location_on : Icons.my_location,
        color: Colors.white,
        size: 20,
      ),
    );
  }
}

class DriverMarker extends StatelessWidget {
  final double heading;

  const DriverMarker({super.key, this.heading = 0.0});

  @override
  Widget build(BuildContext context) {
    return Transform.rotate(
      angle: heading,
      child: Container(
        padding: const EdgeInsets.all(6),
        decoration: BoxDecoration(
          color: AppColors.white,
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(
              color: Colors.black12,
              blurRadius: 10,
              spreadRadius: 2,
            ),
          ],
        ),
        child: Icon(
          Icons.directions_car,
          color: AppColors.trustGreen,
          size: 24,
        ),
      ),
    );
  }
}
