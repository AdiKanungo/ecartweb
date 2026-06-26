# 🎨 AK INDUSTRY - DESIGN SYSTEM & STYLE GUIDE v3.0

## COLOR PALETTE

### Primary Colors
```
┌─────────────────────────────────────────┐
│ Primary Dark          #1a1a2e           │ ████████ (Very Dark Blue)
│ Primary Color         #0f3460           │ ████████ (Ocean Blue)
│ Accent Gold           #d4af37           │ ████████ (Premium Gold)
└─────────────────────────────────────────┘
```

### Secondary Colors
```
┌─────────────────────────────────────────┐
│ Secondary Red         #e94560           │ ████████ (Vibrant Red)
│ Light Accent          #16213e           │ ████████ (Dark Navy)
│ Success Green         #27ae60           │ ████████ (Positive Green)
│ Warning Red           #e74c3c           │ ████████ (Alert Red)
└─────────────────────────────────────────┘
```

### Neutral Colors
```
┌─────────────────────────────────────────┐
│ Text Dark             #2c3e50           │ ████████ (Dark Text)
│ Text Light            #ecf0f1           │ ████████ (Light Text)
│ Background Light      #f8f9fa           │ ████████ (Off-white)
│ Background Dark       #f1f3f6           │ ████████ (Light Gray)
│ Border Gray           #e9ecef           │ ████████ (Subtle Border)
│ Placeholder           #9ca3af           │ ████████ (Muted Text)
└─────────────────────────────────────────┘
```

---

## TYPOGRAPHY SYSTEM

### Font Family
```
Primary Font:  'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif
Fallbacks:     Tahoma, Geneva, Verdana, Arial
Rendering:     System fonts (fast, native look)
```

### Font Weights & Sizes
```
┌──────────────────────────────────────────────────┐
│ DISPLAY SIZES (Large Headlines)                  │
│ ─────────────────────────────────────────────────│
│ h1      3.0rem   700 bold    Hero titles         │
│ h2      2.2rem   700 bold    Section headers     │
│ h3      1.8rem   600 semi    Subsections        │
│ h4      1.5rem   600 semi    Tertiary headers   │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ TEXT SIZES (Body & Small)                        │
│ ─────────────────────────────────────────────────│
│ Body     1.0rem   400 regular  Main content     │
│ Small    0.95rem  400 regular  Descriptions    │
│ Caption  0.85rem  400 regular  Metadata        │
│ Label    0.8rem   600 semi     Form labels     │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ WEIGHT SYSTEM                                    │
│ ─────────────────────────────────────────────────│
│ 400 (Regular)     Default text, body content    │
│ 600 (Semi-bold)   Emphasis, labels, subtitles  │
│ 700 (Bold)        Headers, titles, CTAs        │
└──────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────┐
│ LINE HEIGHT                                      │
│ ─────────────────────────────────────────────────│
│ 1.2    Headlines, compact text                  │
│ 1.4    Descriptions, medium spacing             │
│ 1.6    Body text, comfortable reading           │
└──────────────────────────────────────────────────┘
```

---

## SPACING SYSTEM

### Grid Spacing (8px base)
```
┌────────────────────────────────────────────┐
│ Tight        4px      ▮                     │
│ Compact      8px      ▮ ▮                  │
│ Comfortable  16px     ▮ ▮ ▮                │
│ Normal       20px     ▮ ▮ ▮ ▮              │
│ Spacious     24px     ▮ ▮ ▮ ▮ ▮            │
│ Large        32px     ▮ ▮ ▮ ▮ ▮ ▮          │
│ XL           40px     ▮ ▮ ▮ ▮ ▮ ▮ ▮        │
│ 2XL          60px     ▮ ▮ ▮ ▮ ▮ ▮ ▮ ▮      │
└────────────────────────────────────────────┘
```

### Component Spacing
```
Navigation Bar:     0px padding (full width)
Sections:          40px-60px vertical margin
Content Area:      20px-40px padding
Card Content:      20px padding
Modals:            40px padding
Input Fields:      12px padding
Buttons:           12px padding
```

---

## SHADOW SYSTEM

### Elevation Levels
```
┌─────────────────────────────────────────────┐
│ SOFT SHADOW (UI Elements)                   │
│ 0 2px 8px rgba(0, 0, 0, 0.08)               │
│ ▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦            │
│ Use for: Cards, buttons, subtle elevation  │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ MEDIUM SHADOW (Hovered Elements)            │
│ 0 4px 16px rgba(0, 0, 0, 0.12)              │
│ ▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦      │
│ Use for: Hover states, floating elements   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ STRONG SHADOW (Modals, Dropdowns)           │
│ 0 8px 24px rgba(0, 0, 0, 0.16)              │
│ ▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦▦  │
│ Use for: Modals, menus, prominent layers   │
└─────────────────────────────────────────────┘
```

---

## BORDER RADIUS

### Consistency Scale
```
┌────────────────────────────────────────┐
│ None       0px     Hard edges          │
│ Sharp      4px     Subtle rounding     │
│ Round      6px     Standard components │
│ Rounded    8px     Cards, modals       │
│ Rounded    10px    Product cards       │
│ Pill       30px    Badges, buttons     │
│ Full       50%     Circular elements   │
└────────────────────────────────────────┘
```

---

## BUTTON SYSTEM

### Button Styles
```
┌─────────────────────────────────────────────┐
│ PRIMARY BUTTON                              │
│ Background:  Linear gradient               │
│   From: #e94560 (Secondary Red)            │
│   To: #d63447 (Darker Red)                 │
│ Text: White (white)                        │
│ Padding: 12px 30px                         │
│ Border Radius: 6px                         │
│ Hover: Scale 1.05, Enhanced shadow         │
│ Active: Scale 0.98                         │
│ ┌──────────────────────────────────────┐   │
│ │  Click Here (Primary Action)        │   │
│ └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ SECONDARY BUTTON                            │
│ Background: #ecf0f1 (Light Gray)           │
│ Text: #2c3e50 (Dark Text)                 │
│ Padding: 12px 30px                         │
│ Border Radius: 6px                         │
│ Hover: Background -> #d5dbdb               │
│ ┌──────────────────────────────────────┐   │
│ │  Cancel (Secondary Action)           │   │
│ └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ ICON BUTTON (Cart Add)                      │
│ Background: #0f3460 to #1a1a2e gradient    │
│ Text: White                                │
│ Icon: fa-cart-plus                         │
│ Padding: 10px 16px                         │
│ Hover: Background reverse, Scale 1.05      │
│ ┌──────────────────────────────────────┐   │
│ │  🛒 Add                              │   │
│ └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Button Sizes
```
Small:    8px 12px     (Search, close)
Regular:  12px 30px    (Standard action)
Large:    16px 40px    (Main CTAs)
Full:     100% width   (Modal buttons)
```

---

## FORM ELEMENTS

### Input Fields
```
┌────────────────────────────────────────┐
│ STANDARD INPUT                         │
│ Background: White                      │
│ Border: 1px solid #ddd                 │
│ Border Radius: 6px                     │
│ Padding: 12px                          │
│ Font Size: 1rem                        │
│ ┌──────────────────────────────────────┤
│ │ Placeholder text here...             │
│ └──────────────────────────────────────┘
│                                        │
│ FOCUS STATE:                           │
│ Border Color: #e94560 (Secondary Red)  │
│ Box Shadow: 0 0 0 3px                 │
│           rgba(233, 69, 96, 0.1)      │
│ ┌──────────────────────────────────────┤
│ │ Focused input field...               │ ◄─ Active
│ └──────────────────────────────────────┘
└────────────────────────────────────────┘
```

### Label & Validation
```
Label Styling:
  Font Size: 0.9rem
  Font Weight: 600
  Color: #2c3e50 (Dark Text)
  Margin Bottom: 8px

Success State:
  Border Color: #27ae60 (Green)
  Background: #d4edda (Light Green)
  Message: "✓ All set!"

Error State:
  Border Color: #e74c3c (Red)
  Background: #ffebee (Light Red)
  Message: "✗ Error message"
```

---

## CARD COMPONENTS

### Product Card
```
┌─────────────────────────────────────┐
│ ┌─────────────────────────────────┐ │
│ │                                 │ │ 250px height
│ │    [Product Image]              │ │
│ │         ⭐ 4.9                  │ │ Badge
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Handmade Jewelry                    │ Category
│                                     │
│ Handcrafted Silver Filigree         │ Product Name
│ Necklace                            │ (2 lines max)
│                                     │
│ Exquisite silver filigree...        │ Description
│                                     │
│ ★★★★★ (156 reviews)                │ Rating
│                                     │
│ ₹2,499        [🛒 Add]              │ Price + CTA
│                                     │
└─────────────────────────────────────┘
```

### Category Box
```
┌──────────────────────────────────┐
│ Handmade Jewelry                 │ Title
│                                  │
│ ┌──────────────────────────────┐ │
│ │                              │ │
│ │    [Category Image]          │ │ 180px
│ │                              │ │
│ └──────────────────────────────┘ │
│                                  │
│ Explore Collection →             │ CTA
│                                  │
└──────────────────────────────────┘
```

---

## RESPONSIVE BREAKPOINTS

### Desktop (≥1200px)
```
┌──────────────────────────────────────────────┐
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐            │
│ │ 1   │ │ 2   │ │ 3   │ │ 4   │            │
│ │     │ │     │ │     │ │     │            │
│ └─────┘ └─────┘ └─────┘ └─────┘            │
│                                            │
│ 4 columns, full navigation                │
└──────────────────────────────────────────────┘
```

### Tablet (768px - 1200px)
```
┌─────────────────────────────────┐
│ ┌───────┐ ┌───────┐ ┌───────┐  │
│ │ 1     │ │ 2     │ │ 3     │  │
│ │       │ │       │ │       │  │
│ └───────┘ └───────┘ └───────┘  │
│                                 │
│ 3 columns, adjusted spacing     │
└─────────────────────────────────┘
```

### Mobile (480px - 768px)
```
┌──────────────┐
│ ┌──────────┐ │
│ │ 1        │ │
│ │          │ │
│ └──────────┘ │
│              │
│ ┌──────────┐ │
│ │ 2        │ │
│ │          │ │
│ └──────────┘ │
│              │
│ 2 columns    │
└──────────────┘
```

### Small Mobile (<480px)
```
┌────────────┐
│ ┌────────┐ │
│ │ 1      │ │
│ │        │ │
│ └────────┘ │
│            │
│ ┌────────┐ │
│ │ 2      │ │
│ │        │ │
│ └────────┘ │
│            │
│ 1 column   │
└────────────┘
```

---

## NAVIGATION BAR

### Structure
```
┌─────────────────────────────────────────────────────┐
│ [LOGO] [Deliver to India] [🔍 Search ▼] [EN ▼] [A&L] [Orders] [🛒] │
│ Height: 70px  |  Sticky: top 0, z-index 100       │
│ Background: Linear gradient (dark blue)            │
│ Shadow: Strong elevation shadow                    │
└─────────────────────────────────────────────────────┘

Sub-bar:
┌─────────────────────────────────────────────────────┐
│ [≡ CATEGORIES] [Exclusive] [Gifts] [Bestsellers]... │
│ Background: #16213e  |  Padding: 10px             │
└─────────────────────────────────────────────────────┘
```

---

## MODAL DIALOG

### Layout
```
┌─ MODAL BACKDROP ─────────────────────────────────┐
│                                                   │
│    ┌─── MODAL CONTENT ───────────────────────┐   │
│    │                                         │   │
│    │ Title                            [✕]   │   │
│    │ ─────────────────────────────────────   │   │
│    │                                         │   │
│    │ Content Area (scrollable)               │   │
│    │                                         │   │
│    │ ┌─────────────────────────────────────┐│   │
│    │ │ Buttons / Actions                   ││   │
│    │ └─────────────────────────────────────┘│   │
│    │                                         │   │
│    └─────────────────────────────────────────┘   │
│                                                   │
└───────────────────────────────────────────────────┘

Backdrop:     rgba(0, 0, 0, 0.5) (50% opacity)
Modal Width:  90% / max 600px
Animation:    slideUp 0.3s ease
```

---

## NOTIFICATIONS

### Types & Colors
```
┌──────────────────────────────────────────┐
│ ✓ SUCCESS NOTIFICATION                   │
│ ├─ Border Left: #27ae60 (Green)          │
│ ├─ Background: Linear gradient green     │
│ ├─ Text: #155724 (Dark Green)            │
│ └─ Message: Operation successful!        │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ ✗ ERROR NOTIFICATION                     │
│ ├─ Border Left: #e74c3c (Red)            │
│ ├─ Background: Linear gradient red       │
│ ├─ Text: #721c24 (Dark Red)              │
│ └─ Message: Something went wrong         │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│ ℹ INFO NOTIFICATION                      │
│ ├─ Border Left: #0f3460 (Primary Blue)   │
│ ├─ Background: Linear gradient blue      │
│ ├─ Text: #0c5460 (Dark Blue)             │
│ └─ Message: Please note this information │
└──────────────────────────────────────────┘
```

### Animation
```
Entry:  slideInRight 0.3s ease
  From: translateX(400px)
  To:   translateX(0)

Exit:   slideOutRight 0.3s ease
  Duration: 3000ms

Position: Fixed (top-right)
Spacing: 20px from edge
Max Width: 400px
```

---

## ANIMATIONS & TRANSITIONS

### Standard Transition
```
Property: all
Duration: 0.3s
Timing: cubic-bezier(0.4, 0, 0.2, 1) (Material Design)
```

### Keyframe Animations
```
fadeIn:
  0%   { opacity: 0 }
  100% { opacity: 1 }
  Duration: 0.3s

slideUp:
  0%   { transform: translateY(30px); opacity: 0 }
  100% { transform: translateY(0);    opacity: 1 }
  Duration: 0.3s

slideInRight:
  0%   { transform: translateX(400px); opacity: 0 }
  100% { transform: translateX(0);     opacity: 1 }
  Duration: 0.3s
```

### Hover Effects
- **Cards**: translateY(-8px) + shadow upgrade
- **Buttons**: Scale 1.05 + shadow enhance
- **Links**: Color change + opacity shift
- **Images**: Scale 1.05 (zoom effect)

---

## ACCESSIBILITY STANDARDS

### Color Contrast
- ✅ Text on background: 4.5:1+ ratio
- ✅ Large text: 3:1+ ratio
- ✅ Interactive elements: Visually distinct
- ✅ Not color-only: Icons + text used

### Focus States
```
Visible focus ring:
  Border: 2px solid #e94560
  Outline: none (removed default)
  Box-shadow: 0 0 0 3px rgba(233, 69, 96, 0.2)
  Keyboard navigation: Supported
```

### Text Sizing
- ✅ Readable: 16px+ on mobile
- ✅ Line height: 1.4-1.6
- ✅ Proper font weights
- ✅ Sufficient paragraph spacing

---

## USAGE GUIDELINES

### When to Use Each Color
- **Primary Blue**: Navigation, main branding
- **Secondary Red**: CTAs, important actions
- **Gold Accent**: Premium elements, badges
- **Gray**: Neutral text, backgrounds
- **Green**: Success states
- **Red**: Errors, warnings

### When to Use Each Shadow
- **Soft**: Regular cards, buttons
- **Medium**: Hovered elements, interactive states
- **Strong**: Modals, important overlays

### When to Use Each Button Style
- **Primary**: Main actions (Add to Cart, Buy Now)
- **Secondary**: Cancel, alternative actions
- **Icon**: Quick actions (add, remove, edit)

---

## IMPLEMENTATION NOTES

### CSS Custom Properties (Variables)
```css
:root {
    --primary-color: #0f3460;
    --secondary-color: #e94560;
    --accent-gold: #d4af37;
    --text-dark: #2c3e50;
    --shadow-soft: 0 2px 8px rgba(0, 0, 0, 0.08);
    --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Using Variables
```css
button {
    color: white;
    background: var(--secondary-color);
    transition: var(--transition);
    box-shadow: var(--shadow-soft);
}
```

---

## DESIGN PHILOSOPHY

### Principles
1. **Elegance**: Premium feel, sophisticated colors
2. **Clarity**: Clear hierarchy, readable text
3. **Consistency**: Unified design language
4. **Accessibility**: Inclusive design for all users
5. **Performance**: Optimized animations, fast rendering
6. **Trust**: Professional appearance builds confidence

### Goals
- ✅ Premium brand perception
- ✅ Easy navigation
- ✅ Clear calls-to-action
- ✅ Mobile-first responsive
- ✅ Fast, smooth interactions
- ✅ Accessible to all

---

**Design System v3.0**  
**Last Updated**: 2024  
**Status**: ✅ ACTIVE  
**Platforms**: Web (Desktop, Tablet, Mobile)

*Professional Premium Design for AK Industry Handmade Marketplace*
