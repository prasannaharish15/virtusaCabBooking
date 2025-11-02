# vCabs Design System - Quick Reference Guide

## 🎨 Color Palette

### Primary Colors
```css
Purple:  #AB47BC (500), #9C27B0 (600), #8E24AA (700)
Blue:    #3B82F6 (500), #2563EB (600), #1D4ED8 (700)
Green:   #10B981 (500), #059669 (600), #047857 (700)
Orange:  #F59E0B (500), #D97706 (600), #B45309 (700)
```

### Neutral Colors
```css
Gray-50:  #F9FAFB (Background)
Gray-100: #F3F4F6
Gray-200: #E5E7EB (Borders)
Gray-500: #6B7280 (Secondary text)
Gray-700: #374151
Gray-900: #111827 (Primary text)
```

## 📐 Component Patterns

### Header (All Pages)
```html
<header class="bg-white shadow-sm sticky top-0 z-30">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex justify-between items-center py-4">
      <!-- Content -->
    </div>
  </div>
</header>
```

### Stat Card (Gradient)
```html
<div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
  <p class="text-sm font-medium opacity-90 mb-1">Label</p>
  <p class="text-4xl font-bold">Value</p>
</div>
```

### Content Card (White)
```html
<div class="bg-white rounded-2xl shadow-md p-8">
  <h2 class="text-2xl font-bold text-gray-900 mb-6">Title</h2>
  <!-- Content -->
</div>
```

### Form Input
```html
<input class="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all" />
```

### Primary Button
```html
<button class="px-6 py-3 bg-gradient-to-br from-purple-500 to-purple-600 hover:shadow-xl text-white rounded-xl font-semibold transition-all duration-200 hover:scale-105">
  Button Text
</button>
```

### Danger Button
```html
<button class="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all duration-200">
  Button Text
</button>
```

### Status Badge
```html
<span class="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
  Status
</span>
```

## 📱 Responsive Grid
```html
<!-- 1 column mobile, 2 tablet, 4 desktop -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <!-- Items -->
</div>
```

## 🎯 Typography Scale

```css
Page Title:     text-2xl font-bold text-gray-900
Section Title:  text-2xl font-bold text-gray-900
Card Title:     text-xl font-bold text-gray-900
Body Text:      text-base text-gray-900
Secondary Text: text-sm text-gray-600
Label:          text-sm font-semibold text-gray-700
```

## 🔄 Common Utilities

### Spacing
```css
Container:  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
Section:    py-8
Card:       p-8
Gap:        gap-4, gap-6, gap-8
```

### Borders & Shadows
```css
Border Radius: rounded-xl (12px), rounded-2xl (24px)
Shadow:        shadow-md, shadow-lg
Border:        border-2 border-gray-200
```

### Transitions
```css
Standard:      transition-all duration-200
Hover Scale:   hover:scale-105
Hover Shadow:  hover:shadow-xl
```

## 🎨 Gradient Combinations

```css
Purple:  bg-gradient-to-br from-purple-500 to-purple-600
Blue:    bg-gradient-to-br from-blue-500 to-blue-600
Green:   bg-gradient-to-br from-green-500 to-green-600
Orange:  bg-gradient-to-br from-orange-500 to-orange-600
Mixed:   bg-gradient-to-br from-blue-600 to-purple-600
```

## 🚦 Status Colors

```css
Success: bg-green-100 text-green-800
Warning: bg-yellow-100 text-yellow-800
Error:   bg-red-100 text-red-800
Info:    bg-blue-100 text-blue-800
Purple:  bg-purple-100 text-purple-800
```

## 📋 Empty State Pattern

```html
<div class="text-center text-gray-500 py-16">
  <div class="text-6xl mb-4">🚗</div>
  <p class="text-xl font-semibold text-gray-700 mb-2">Main Message</p>
  <p class="text-gray-500">Subtext</p>
</div>
```

## 🔐 Modal Pattern

```html
<div class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
  <div class="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border-2 border-purple-200">
    <!-- Modal Content -->
  </div>
</div>
```

## 🎭 Icon Circles

```html
<div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
  🎯
</div>
```

## 📊 Usage Examples

### Dashboard Stats Row
```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
    <p class="text-sm font-medium opacity-90 mb-1">Today's Rides</p>
    <p class="text-4xl font-bold">12</p>
  </div>
  <!-- More cards -->
</div>
```

### Form Section
```html
<section class="bg-white rounded-2xl shadow-md p-8">
  <div class="flex items-center gap-3 mb-6">
    <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
      👤
    </div>
    <h2 class="text-2xl font-bold text-gray-900">Personal Details</h2>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Form fields -->
  </div>
</section>
```

### List Item with Hover
```html
<div class="p-6 rounded-xl border-2 border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all">
  <!-- Content -->
</div>
```

## 🎨 Color Usage Guidelines

- **Purple**: Primary actions, main branding
- **Blue**: Information, secondary actions
- **Green**: Success, earnings, positive actions
- **Orange**: Warnings, time-sensitive items
- **Red**: Errors, destructive actions
- **Gray**: Neutral content, backgrounds

## 📐 Spacing Scale

```css
xs:  4px   (0.25rem)
sm:  8px   (0.5rem)
md:  16px  (1rem)
lg:  24px  (1.5rem)
xl:  32px  (2rem)
2xl: 48px  (3rem)
```

## 🎯 Best Practices

1. **Always use design tokens** from `design-tokens.ts`
2. **Maintain consistent spacing** using Tailwind utilities
3. **Use semantic color names** (success, warning, error)
4. **Test responsive behavior** at all breakpoints
5. **Add hover states** to interactive elements
6. **Use transitions** for smooth animations
7. **Maintain accessibility** with focus states
8. **Follow the component patterns** for consistency

## 🔗 Related Files

- Design Tokens: `src/app/shared/design-tokens.ts`
- Tailwind Config: `tailwind.config.js`
- Global Styles: `src/styles.css`

---

**Quick Reference Version**: 1.0
**Last Updated**: November 2, 2024
