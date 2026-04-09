# PYU GO Branding & Asset Integration Guide

## 1. Visual Identity Overview
The **PYU GO** identity is built around a dynamic intersection of mobility and trust. The logo features a stylized 'P' icon with an integrated arrow, symbolizing movement and direction.

### 1.1 Core Branding Colors
| Element | Hex Code | Usage |
| :--- | :--- | :--- |
| **PYU (Dark Navy)** | `#1E293B` | Primary branding, text headings, dark surfaces |
| **GO (Emerald Green)** | `#22C55E` | Primary action color, success states, brand focus |
| **Accent Blue** | `#3B82F6` | Secondary actions, informational highlights |
| **Neutral Background** | `#F8FAFC` | Clean, high-legibility backgrounds |

## 2. App Icon Specifications (Mobile)
We use `flutter_launcher_icons` to automate the creation of platform-specific icons.

### 2.1 Asset Preparation
1.  **Main Logo**: `assets/branding/logo.png` (1024x1024px, no transparency for iOS).
2.  **Adaptive Icon (Android)**:
    - **Foreground**: `assets/branding/logo_icon.png` (512x512px, transparent background).
    - **Background**: Solid color `#FFFFFF`.

### 2.2 Conversion Command
Run the following command in the `mobile/` directory to generate all mipmap and AppIcon sizes:
```bash
flutter pub run flutter_launcher_icons
```
This will automatically update:
- **Android**: `mipmap-hdpi`, `mdpi`, `xhdpi`, `xxhdpi`, `xxxhdpi`.
- **iOS**: `AppIcon.appiconset` with all required Apple sizes.

## 3. Splash Screen Specifications
We use `flutter_native_splash` for a professional, high-resolution loading experience.

### 3.1 Design Guidelines
- **Image**: `assets/branding/logo_splash.png` (Centered logo, 2048x2048px recommended for high-DPI screens).
- **Background**: Solid `#FFFFFF` to ensure the logo pop and maintain Material/iOS consistency.
- **Android 12+**: Utilizes the Splash Screen API with adaptive icon support.

### 3.2 Integration Command
Run the following command in the `mobile/` directory:
```bash
flutter pub run flutter_native_splash:create
```

## 4. Technical Integration Steps
1.  **Colors**: Integrated via `AppColors` in Flutter and CSS variables in React.
2.  **Typography**: **Plus Jakarta Sans** is the official font, ensuring maximum readability.
3.  **UI Components**: Updated to use the Emerald Green (`primary`) and Dark Navy (`secondary`) hierarchy.

---
*Note: Ensure all image assets are placed in the `mobile/assets/branding/` directory before running the generation commands.*
