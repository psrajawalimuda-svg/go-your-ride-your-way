# Go Your Ride - Design System Documentation

## 1. Visual Design Strategy
A clean, minimal design aesthetic focused on mobility, trust, and efficiency. Inspired by industry leaders like Gojek and Grab, the system prioritizes ease of use in on-the-go scenarios.

### 1.1 Color Palette
The palette is divided into functional categories to ensure consistent meaning across the app.

| Category | Color Name | Hex | Usage |
| :--- | :--- | :--- | :--- |
| **Primary** | Emerald Green (GO) | `#22C55E` | Main actions, success, brand identity |
| **Secondary** | Dark Navy (PYU) | `#1E293B` | Supporting actions, headers, info |
| **Accent** | Mobility Blue | `#3B82F6` | Highlights, informational alerts |
| **Neutral** | Onyx Black | `#0F172A` | Primary text |
| **Neutral** | Slate Gray | `#64748B` | Secondary text, icons |
| **Neutral** | Ghost White | `#F8FAFC` | Backgrounds, surfaces |
| **System** | Error Red | `#EF4444` | Destructive actions, errors |

### 1.2 Typography
Using **Plus Jakarta Sans** for its high legibility and modern geometric feel.

- **Display**: 32px / 700 (Bold) - Onboarding, hero sections
- **Heading 1**: 24px / 700 (Bold) - Page titles
- **Heading 2**: 20px / 600 (Semi-bold) - Section headers
- **Body Large**: 16px / 500 (Medium) - Main content, input labels
- **Body Small**: 14px / 400 (Regular) - Secondary info, captions
- **Micro**: 12px / 400 (Regular) - Small labels, metadata

### 1.3 Spacing System
Based on a 4px grid for perfect alignment.
- `2xs`: 4px
- `xs`: 8px
- `sm`: 12px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px

## 2. Component Specifications

### 2.1 Button System
- **Primary Button**: Large (56px height), full width, green background, white text. Minimum 44px touch target.
- **Secondary Button**: Outline or Ghost style. Used for "Cancel" or "Edit".
- **IconButton**: Circular (48px), used for map controls and back buttons.

### 2.2 Card Components
- **Ride Option Card**: Horizontal layout, vehicle icon (left), price (right), duration/description (center).
- **Driver Info Card**: Compact, avatar, name, rating, vehicle plate.
- **Trip Detail Card**: Vertical layout, timeline of stops, total price, payment method.

### 2.3 Bottom Sheets
- **Interactive Drawer**: Smooth 300ms transition. Handle at the top for dragging. Multi-snap points (30%, 60%, 95%).
- **Map Information Overlay**: Translucent background (blur effect) for readability over maps.

### 2.4 Map Overlays
- **Location Pin**: Green for pickup, Blue for destination.
- **Route Highlight**: Solid blue line with 4px width and shadow.
- **Driver Marker**: Dynamic icon with heading (rotation) support.

## 3. Technical Standards
- **Touch Targets**: Minimum 44x44px for all interactive elements.
- **Responsive Range**: Optimized for 320px (iPhone SE) to 428px (iPhone 14 Pro Max).
- **Animations**: 200ms for small interactions, 300ms for page/sheet transitions using ease-out.
- **Accessibility**: WCAG 2.1 AA compliant. High contrast ratios (4.5:1 min for text).

## 4. User Experience (UX)
- **One-Hand Operation**: Primary action buttons placed in the "Thumb Zone" (bottom 1/3 of screen).
- **3-Tap Rule**: Any booking should be completed within 3 taps from the home screen.
- **Visual Weight**: Highest contrast for "Confirm" and "Book" actions.
