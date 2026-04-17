# Design System Specification: The Conscious Curator

## 1. Overview & Creative North Star
The "Creative North Star" for this design system is **The Digital Curator.** 

Moving away from the rigid, boxed-in layouts of traditional SaaS, this system adopts an editorial approach to sustainability. It treats data like a high-end fashion lookbook—prioritizing white space, intentional asymmetry, and "breathable" layouts. We reject the "template" look by using a high-contrast typography scale and a depth model based on physical layers rather than digital containers. The goal is to make environmental data feel as premium and desirable as the garments being analyzed.

---

## 2. Colors: Tonal Depth & The \"No-Line\" Rule
This system relies on a sophisticated palette of off-whites and semantic earth tones to communicate authority and calm.

### Color Tokens
- **Background & Surfaces:**
  - `surface`: #f8f9fa (The canvas)
  - `surface_container_low`: #f3f4f5 (Sectioning)
  - `surface_container_highest`: #e1e3e4 (Elevated elements)
  - `surface_container_lowest`: #ffffff (Card highlights)
- **Primary & Semantic:**
  - `primary`: #575e70 (Muted slate for utility)
  - `secondary`: #006c49 (Sustainability/Pass)
  - `tertiary`: #795900 (Warning/Consider)
  - `error`: #ba1a1a (Avoid/Alert)

### The \"No-Line\" Rule
**Designers are prohibited from using 1px solid borders for sectioning.** To define boundaries, use background color shifts. A `surface_container_low` section sitting against a `surface` background provides all the separation the eye needs without the \"digital noise\" of a stroke.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use `surface_container` tiers to create depth:
1. **Base Layer:** `surface`
2. **Structural Sections:** `surface_container_low`
3. **Interactive Components:** `surface_container_lowest` (creates a \"lifted\" white paper effect).

### The \"Glass & Gradient\" Rule
Floating overlays (modals, tooltips, navigation bars) must use **Glassmorphism**. Combine `surface_container_lowest` at 80% opacity with a `20px` backdrop-blur. For main Call-to-Actions, use a subtle linear gradient from `secondary` to `secondary_fixed_dim` to give the UI a \"soul\" that flat fills cannot replicate.

---

## 3. Typography: Editorial Authority
We use **Inter** (or Geist) with an aggressive scale to create an editorial hierarchy.

- **Display (Large/Med):** 3.5rem / 2.75rem. Use these for AI-generated scores or hero impact statements. Letter-spacing should be set to `-0.02em`.
- **Headline (Sm/Med):** 1.5rem / 1.75rem. Used for section titles. These should feel like magazine headers.
- **Body (Md):** 0.875rem. The workhorse. High-contrast `#191c1d` on light backgrounds ensures maximum readability.
- **Label (Sm):** 0.6875rem. All-caps for metadata or small tags to provide a technical, \"scanned\" aesthetic.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are often a crutch for poor contrast. This system uses **Tonal Layering** first.

- **The Layering Principle:** Depth is achieved by \"stacking.\" Place a `surface_container_lowest` card on a `surface_container_low` background to create a soft, natural lift.
- **Ambient Shadows:** When a floating effect is required (e.g., a \"Buy\" button or AI FAB), use an extra-diffused shadow: `0 20px 40px rgba(25, 28, 29, 0.04)`. The shadow must feel like ambient light, not a dark glow.
- **The \"Ghost Border\" Fallback:** If accessibility requires a border (e.g., in input fields), use `outline_variant` at **20% opacity**. Never use 100% opaque strokes.
- **Glassmorphism:** Use semi-transparent surface colors to let content bleed through, making the layout feel integrated and premium.

---

## 5. Components: Soft Minimalist Primitives

### Buttons
- **Primary:** High-contrast fill (`secondary` or `on_surface`). Large horizontal padding (24px) and `DEFAULT` (8px) corner radius.
- **Secondary:** `surface_container_high` fill with `on_surface` text. No border.
- **Tertiary:** Text only with `label-md` styling and a 1px underline that appears on hover.

### Cards & Lists
**Strict Rule:** No divider lines. Separate content using `Spacing Scale` (vertical white space) or subtle shifts between `surface_container` tiers. 
- AI Result Cards should use `surface_container_lowest` with a `lg` (16px) corner radius to feel like a distinct, tactile object.

### Sustainability Badges (Chips)
Use the semantic palette with a \"Ghost Fill.\"
- **Pass:** `secondary_container` background with `on_secondary_container` text.
- **Avoid:** `error_container` background with `on_error_container` text.
- Radius: `full` (pill shape).

### AI Input Fields
- Use `surface_container_low` as the field background. 
- Transition to `surface_container_lowest` on focus to \"lift\" the field toward the user. 
- Use `title-md` for user input text to maintain an editorial feel.

---

## 6. Do's and Don'ts

### Do
- **Embrace Asymmetry:** Place high-contrast Display text off-center to create a modern, high-fashion look.
- **Use \"Breathing Room\":** If you think there is enough margin, double it. Space is a luxury.
- **Layer with Intent:** Ensure that every \"layer\" has a clear hierarchical purpose.

### Don't
- **Don't use Dividers:** If you feel the need to use a `\u003chr\u003e` or a border, try using a 40px gap or a background color shift instead.
- **Don't use Pure Black:** Always use `on_surface` (#191c1d) for text to keep the aesthetic \"soft-modern.\"
- **Don't Over-Round:** Stick to the `DEFAULT` (8px) and `lg` (16px) scales. Avoid 100% rounded corners except for small interaction chips.
- **Don't use Box Shadows on everything:** Let the tonal shifts do the heavy lifting. Reserve shadows for elements that truly \"float\" over the UI.