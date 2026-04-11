

## Plan: Add Promo & Ad Carousel to Home Page

### What
Add an auto-scrolling carousel between the service cards and recent places section on `/home`, showing promotional banners and ads (demo data with colorful gradient cards).

### Implementation

**Modify `src/pages/Index.tsx`**:
- Import `Carousel`, `CarouselContent`, `CarouselItem` from the existing carousel component and Autoplay plugin
- Add a `promoSlides` array with 4 demo promo banners (discount codes, new features, referral bonuses) using gradient backgrounds and text
- Place the carousel between the "Ride Now / Shuttle" grid and "Recent Places"
- Each slide: rounded-2xl card with gradient bg, title, subtitle, and optional CTA badge
- Add dot indicators below the carousel showing current slide
- Auto-scroll every 4 seconds with loop enabled
- Install `embla-carousel-autoplay` package for autoplay support

### Files
| Action | File |
|--------|------|
| Modify | `src/pages/Index.tsx` — add promo carousel section |

### Package
- Install: `embla-carousel-autoplay`

