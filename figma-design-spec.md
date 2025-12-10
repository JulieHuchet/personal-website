# Design Capacity Planner - Figma Design Specification

## 🎨 Design System Tokens

### Colors
```
Primary Orange: #F97316 (orange-500)
Primary Orange Hover: #EA580C (orange-600)
Secondary Gray: #6B7280 (gray-500)
Text Primary: #111827 (gray-900)
Text Secondary: #6B7280 (gray-500)
Background: #F9FAFB (gray-50)
Card Background: #FFFFFF (white)
Border: #E5E7EB (gray-200)
Border Light: #F3F4F6 (gray-100)
Accent Orange Light: #FFF7ED (orange-50)
Accent Orange Medium: #FDBA74 (orange-300)
```

### Typography
```
Font Family: Inter
Font Weights: 300, 400, 500, 600, 700

Heading 1: 30px, Bold (700), Gray-900
Heading 2: 18px, Semibold (600), Gray-900
Body Large: 18px, Medium (500), Gray-600
Body: 16px, Regular (400), Gray-600
Body Small: 14px, Regular (400), Gray-600
Label: 14px, Medium (500), Gray-700
```

### Spacing
```
Base Unit: 4px
Small: 8px (2 units)
Medium: 16px (4 units)
Large: 24px (6 units)
XL: 32px (8 units)
XXL: 48px (12 units)
```

### Shadows
```
Card Shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)
Card Shadow Hover: 0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)
```

### Border Radius
```
Small: 6px
Medium: 8px
Large: 12px
XL: 16px
```

## 📱 Component Specifications

### DashboardCard Component
```
Background: White (#FFFFFF)
Border: 1px solid Gray-200 (#E5E7EB)
Border Radius: 8px
Shadow: Card Shadow
Padding: 24px
Hover State: Card Shadow Hover

Accent Variant:
- Left Border: 4px solid Orange-500 (#F97316)
```

### Button Components

#### Primary Button
```
Background: Orange-500 (#F97316)
Text Color: White (#FFFFFF)
Padding: 8px 16px
Border Radius: 6px
Font: 14px Medium
Hover: Orange-600 (#EA580C)
Focus: 2px ring Orange-500 with 2px offset
```

#### Secondary Button
```
Background: White (#FFFFFF)
Border: 1px solid Gray-300 (#D1D5DB)
Text Color: Gray-700 (#374151)
Padding: 8px 16px
Border Radius: 6px
Font: 14px Medium
Hover: Gray-50 (#F9FAFB)
Focus: 2px ring Blue-500 with 2px offset
```

#### Ghost Button
```
Background: Transparent
Text Color: Gray-600 (#4B5563)
Padding: 8px 16px
Border Radius: 6px
Font: 14px Medium
Hover: Gray-100 (#F3F4F6), Text Gray-900 (#111827)
```

### Badge Component
```
Padding: 2px 10px
Border Radius: 9999px (full)
Font: 12px Medium

Info Variant:
- Background: Blue-100 (#DBEAFE)
- Text: Blue-800 (#1E40AF)

Success Variant:
- Background: Green-100 (#DCFCE7)
- Text: Green-800 (#166534)

Warning Variant:
- Background: Yellow-100 (#FEF3C7)
- Text: Yellow-800 (#92400E)

Error Variant:
- Background: Red-100 (#FEE2E2)
- Text: Red-800 (#991B1B)
```

### Input/Select Components
```
Background: White (#FFFFFF)
Border: 1px solid Gray-300 (#D1D5DB)
Border Radius: 6px
Padding: 8px 12px
Font: 14px Regular
Placeholder: Gray-400 (#9CA3AF)
Focus: 2px ring Blue-500, Border Blue-500
Error State: Border Red-300, Ring Red-500
```

## 🖼️ Layout Specifications

### Main Layout
```
Container: Max-width 1280px, Centered
Padding: 24px
Background: Gray-50 (#F9FAFB)
Gap between sections: 24px
```

### Grid System
```
Desktop (lg): 2 columns
Mobile: 1 column
Gap: 24px
```

## 📋 Component Layouts

### Header Component
```
Container: DashboardCard
Padding: 24px

Content Layout:
1. Icon + Title Row (margin-bottom: 16px)
   - Icon: 48x48px, Orange gradient background, 24px border-radius
   - Title: H1 style, "Design Capacity Planner"
   - Subtitle: Body Large style, "Powered by Cloudflare"
   - Gap between icon and text: 16px

2. Description Text
   - Body style, Gray-600
   - Line height: 1.5
```

### Integration Bar Component
```
Container: DashboardCard with Accent (orange left border)
Padding: 24px

Content Layout:
1. Header Row (margin-bottom: 16px)
   - Icon: 32x32px, Orange-100 background, 8px border-radius
   - Title: H2 style, "Data Integration Setup"
   - Gap: 12px

2. Filter Bar (margin-bottom: 24px)
   - Background: Gray-50 (#F9FAFB)
   - Padding: 16px
   - Border Radius: 8px
   - Items: Label + Select, Dividers, Badges
   - Gap: 16px
   - Dividers: 1px wide, 24px tall, Gray-300

3. Button Row
   - Gap: 12px
   - Buttons: Primary, Secondary, Ghost variants
   - Icons: 16x16px, margin-right: 8px
```

### Icon Specifications
```
Dashboard Icon (Header):
- Size: 24x24px
- Stroke width: 2px
- Color: White

Lightning Icon (Integration):
- Size: 16x16px  
- Stroke width: 2px
- Color: Orange-600

Button Icons:
- Size: 16x16px
- Stroke width: 2px
- Color: Inherit from button text
```

## 🎯 Figma Creation Steps

### 1. Setup Design System
1. Create new Figma file: "Design Capacity Planner"
2. Create color styles from the color palette above
3. Create text styles from typography specifications
4. Create effect styles for shadows
5. Set up 8px grid system

### 2. Create Components
1. **DashboardCard**: Rectangle with styles, create component
2. **Button variants**: Create master component with variants (Primary, Secondary, Ghost)
3. **Badge variants**: Create master component with color variants
4. **Input/Select**: Form field components
5. **Icons**: Create icon components using vector tools

### 3. Build Layouts
1. **Header**: Combine icon, text, and card components
2. **Integration Bar**: Assemble with card, icons, buttons, badges
3. **Main Layout**: Create auto-layout frame with proper spacing
4. **Responsive**: Create tablet and mobile variants

### 4. Create Prototypes
1. Add hover states to interactive elements
2. Create component state variants
3. Set up basic interactions for buttons

## 📐 Measurements Reference

### Header Component
- Total height: ~140px
- Icon size: 48x48px
- Icon background: 48x48px with 12px border-radius
- Title font-size: 30px
- Subtitle font-size: 18px

### Integration Bar
- Total height: ~180px
- Header icon: 32x32px with 8px border-radius
- Filter bar height: ~56px
- Button height: ~40px
- Button min-width: ~120px

### Cards
- Border radius: 8px
- Padding: 24px all sides
- Shadow: 0 1px 3px rgba(0,0,0,0.1)
- Accent border: 4px left border

This specification provides all the details needed to recreate the design accurately in Figma!
