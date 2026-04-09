import 'package:flutter_test/flutter_test.dart';
import 'package:mobile/models/user.dart';
import 'package:mobile/models/driver.dart';
import 'package:mobile/models/trip.dart';
import 'package:latlong2/latlong.dart';

void main() {
  group('Data Models Serialization/Deserialization', () {
    test('User model should correctly serialize/deserialize', () {
      final user = User(
        id: 'USR-001',
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+628123456789',
        role: 'passenger',
        createdAt: DateTime.parse('2024-04-09T10:00:00Z'),
      );

      final json = user.toJson();
      expect(json['id'], 'USR-001');
      expect(json['name'], 'John Doe');

      final fromJson = User.fromJson(json);
      expect(fromJson.id, user.id);
      expect(fromJson.name, user.name);
      expect(fromJson.createdAt, user.createdAt);
    });

    test('Driver model should correctly serialize/deserialize with LatLng', () {
      final driver = Driver(
        id: 'DRV-001',
        name: 'Ahmad Rizki',
        phone: '+628987654321',
        vehicle: const Vehicle(
          id: 'VEH-001',
          plate: 'B 1234 XYZ',
          model: 'Toyota Avanza',
          color: 'Black',
          vehicleClass: 'car',
        ),
        status: DriverStatus.online,
        rating: 4.9,
        totalTrips: 150,
        location: const LatLng(-6.2088, 106.8456),
      );

      final json = driver.toJson();
      expect(json['location']['latitude'], -6.2088);
      expect(json['location']['longitude'], 106.8456);

      final fromJson = Driver.fromJson(json);
      expect(fromJson.location?.latitude, driver.location?.latitude);
      expect(fromJson.location?.longitude, driver.location?.longitude);
    });

    test('Trip model should correctly handle status transitions', () {
      final trip = Trip(
        id: 'TRP-001',
        passengerId: 'USR-001',
        pickup: const TripLocation(label: 'Home', coords: LatLng(-6.2088, 106.8456)),
        dropoff: const TripLocation(label: 'Office', coords: LatLng(-6.1751, 106.8650)),
        vehicleClass: 'car',
        status: TripStatus.searching,
        fare: 25000,
        paymentMethod: 'wallet',
        createdAt: DateTime.now(),
      );

      final updatedTrip = trip.copyWith(status: TripStatus.onTrip);
      expect(updatedTrip.status, TripStatus.onTrip);
      expect(updatedTrip.id, trip.id);
    });
  });
}
