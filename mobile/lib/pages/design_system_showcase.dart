import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import '../widgets/app_button.dart';
import '../widgets/ride_option_card.dart';
import '../widgets/map_bottom_sheet.dart';
import '../widgets/map_overlay.dart';

class DesignSystemShowcase extends StatefulWidget {
  const DesignSystemShowcase({super.key});

  @override
  State<DesignSystemShowcase> createState() => _DesignSystemShowcaseState();
}

class _DesignSystemShowcaseState extends State<DesignSystemShowcase> {
  int _selectedRide = 0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Design System Showcase', style: AppTypography.heading1),
        backgroundColor: AppColors.white,
        elevation: 0,
        centerTitle: false,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildSectionTitle('Typography'),
            Text('Display Text', style: AppTypography.display),
            Text('Heading 1', style: AppTypography.heading1),
            Text('Heading 2', style: AppTypography.heading2),
            Text('Body Large', style: AppTypography.bodyLarge),
            Text('Body Small', style: AppTypography.bodySmall),
            Text('Micro Text', style: AppTypography.micro),
            
            const SizedBox(height: 32),
            _buildSectionTitle('Colors'),
            _buildColorPalette(),
            
            const SizedBox(height: 32),
            _buildSectionTitle('Buttons'),
            AppButton(
              text: 'Primary Action',
              onPressed: () {},
            ),
            const SizedBox(height: 12),
            AppButton(
              text: 'Secondary Action',
              onPressed: () {},
              isPrimary: false,
            ),
            const SizedBox(height: 12),
            AppButton(
              text: 'Loading...',
              onPressed: () {},
              isLoading: true,
            ),
            
            const SizedBox(height: 32),
            _buildSectionTitle('Ride Options'),
            RideOptionCard(
              title: 'GoRide',
              subtitle: 'Efficient motorcycle ride',
              price: 'IDR 15,000',
              icon: Icons.motorcycle,
              isSelected: _selectedRide == 0,
              onTap: () => setState(() => _selectedRide = 0),
            ),
            const SizedBox(height: 12),
            RideOptionCard(
              title: 'GoCar',
              subtitle: 'Comfortable car ride',
              price: 'IDR 45,000',
              icon: Icons.directions_car,
              isSelected: _selectedRide == 1,
              onTap: () => setState(() => _selectedRide = 1),
            ),
            
            const SizedBox(height: 32),
            _buildSectionTitle('Map Overlays'),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                Column(
                  children: [
                    LocationPin(),
                    const SizedBox(height: 8),
                    Text('Pickup', style: AppTypography.micro),
                  ],
                ),
                Column(
                  children: [
                    LocationPin(isDestination: true),
                    const SizedBox(height: 8),
                    Text('Destination', style: AppTypography.micro),
                  ],
                ),
                Column(
                  children: [
                    DriverMarker(heading: 0.5),
                    const SizedBox(height: 8),
                    Text('Driver', style: AppTypography.micro),
                  ],
                ),
              ],
            ),
            
            const SizedBox(height: 32),
            _buildSectionTitle('Bottom Sheets'),
            AppButton(
              text: 'Show Bottom Sheet',
              onPressed: () {
                showModalBottomSheet(
                  context: context,
                  backgroundColor: Colors.transparent,
                  builder: (context) => MapBottomSheet(
                    title: 'Trip Details',
                    children: [
                      _buildDetailRow(Icons.location_on, 'Pickup', 'Central Station'),
                      const Divider(height: 24),
                      _buildDetailRow(Icons.flag, 'Destination', 'Green Office Park'),
                      const SizedBox(height: 24),
                      AppButton(text: 'Confirm Booking', onPressed: () => Navigator.pop(context)),
                    ],
                  ),
                );
              },
            ),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title.toUpperCase(), style: AppTypography.micro.copyWith(letterSpacing: 1.2, fontWeight: FontWeight.bold)),
          const Divider(),
        ],
      ),
    );
  }

  Widget _buildColorPalette() {
    return Wrap(
      spacing: 12,
      runSpacing: 12,
      children: [
        _buildColorBox(AppColors.trustGreen, 'Primary'),
        _buildColorBox(AppColors.mobilityBlue, 'Secondary'),
        _buildColorBox(AppColors.warningAmber, 'Accent'),
        _buildColorBox(AppColors.onyxBlack, 'Neutral'),
        _buildColorBox(AppColors.slateGray, 'Slate'),
      ],
    );
  }

  Widget _buildColorBox(Color color, String label) {
    return Column(
      children: [
        Container(
          width: 60,
          height: 60,
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.borderGray),
          ),
        ),
        const SizedBox(height: 4),
        Text(label, style: AppTypography.micro),
      ],
    );
  }

  Widget _buildDetailRow(IconData icon, String label, String value) {
    return Row(
      children: [
        Icon(icon, color: AppColors.slateGray, size: 20),
        const SizedBox(width: 12),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(label, style: AppTypography.micro),
            Text(value, style: AppTypography.bodyLarge),
          ],
        ),
      ],
    );
  }
}
