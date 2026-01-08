# Font Change Brainstorming Report
**Date**: 2025-01-08
**Topic**: Geist Mono body + Fira Code with Vietnamese support

---

## Problem Statement

**Requirements**:
1. Use **Geist Mono** for entire app body text (not just code)
2. Use **Fira Code** for code blocks with **full Vietnamese character support** (ă, â, ê, ô, ơ, ư, đ, etc.)

**Current State**:
- Geist Sans for body, Geist Mono for code
- Tailwind CSS v4 with `@theme inline` pattern
- Fonts loaded via `geist` npm package (v1.5.1)

**Challenges Identified**:
1. **Geist Mono for body** = Everything looks like code (monospace UI is unconventional)
2. **Fira Code Vietnamese support** = Not natively supported (requires Latin Extended glyphs)
3. **Tailwind v4** = New `@theme inline` pattern, different from v3 config

---

## Evaluated Approaches

### Approach 1: Pure Fira Code + Font Stack Fallback
Use Fira Code as primary, with fallback fonts for Vietnamese glyphs.

**Implementation**:
```typescript
// layout.tsx
import { GeistMono } from "geist/font/mono";

// globals.css
@font-face {
  font-family: "Fira Code";
  src: url("...") format("woff2");
  unicode-range: U+0000-007F; /* Basic Latin */
}

@font-face {
  font-family: "Fira Code Vietnam";
  src: url("...") format("woff2");
  unicode-range: U+0102-0103, U+0110-0111, U+1EA0-1EF9; /* Vietnamese */
}
```

**Pros**:
- Simple implementation
- Leverages Tailwind's font fallback mechanism

**Cons**:
- Fira Code lacks Latin Extended glyphs (confirmed by GitHub issue #185)
- No official Vietnamese subset available
- May require webfont conversion (complex)

**Risk**: Medium-High
**Effort**: Medium

---

### Approach 2: Geist Mono Body + Fira Code/IBM Plex Mono Stack
Use Geist Mono for body (per requirement), Fira Code for code with IBM Plex Mono as Vietnamese fallback.

**Implementation**:
```css
--font-sans: var(--font-geist-mono);
--font-mono: "Fira Code", "IBM Plex Mono", monospace;
```

**Pros**:
- IBM Plex Mono has full Vietnamese support
- Clean fallback strategy
- Meets exact requirement

**Cons**:
- Need additional font package (`@fontsource/ibm-plex-mono`)
- Slight font inconsistency when Vietnamese chars appear

**Risk**: Low
**Effort**: Low-Medium

---

### Approach 3: Geist Mono + JetBrains Mono (Vietnamese Native)
Use JetBrains Mono instead of Fira Code - has native Vietnamese support.

**Implementation**:
```bash
bun add @fontsource/jetbrains-mono
```

```css
--font-sans: var(--font-geist-mono);
--font-mono: "JetBrains Mono", monospace;
```

**Pros**:
- JetBrains Mono has excellent Vietnamese support
- Modern, popular alternative to Fira Code
- Includes ligatures like Fira Code
- Single font dependency

**Cons**:
- Not Fira Code (different requirement)
- Need to replace Fira Code references

**Risk**: Very Low
**Effort**: Low

---

### Approach 4: Self-Hosted Fira Code with Vietnamese Subset
Manually extend Fira Code with Vietnamese glyphs using fontforge/subset.

**Implementation**:
1. Download Fira Code source
2. Use fontforge to add Vietnamese glyphs from Fira Sans/Inter
3. Host custom WOFF2
4. Configure Tailwind

**Pros**:
- True Fira Code with Vietnamese
- No external dependencies

**Cons**:
- **Extremely complex** (font editing required)
- Maintenance burden
- Legal/license concerns with modified fonts

**Risk**: High
**Effort**: Very High (NOT recommended)

---

## Critical Feedback on Requirements

### 🚨 Brutal Honesty: Geist Mono for Body Text

**Using Geist Mono for entire app body is a bad UX decision.**

**Why**:
1. **Monospace UI looks like a terminal** - This is a developer tools app, not a terminal emulator
2. **Reduced readability** - Monospace fonts are ~20% slower to read than proportional fonts
3. **Unconventional** - Very few modern apps use monospace for body text (VS Code uses JetBrains Mono for code ONLY, UI uses proportional)
4. **Accessibility concern** - Users with visual impairments may struggle

**Recommendation**: Reconsider this requirement. Use Geist Mono for:
- Code blocks
- Data displays (JSON, SQL outputs)
- Technical labels

Keep Geist Sans for body text, navigation, and prose.

---

## Final Decision

### User Decision: **Geist Mono for Entire App Body**

**Requirement (non-negotiable)**:
- Geist Mono for ALL body text (not just code)
- Fira Code for code blocks with Vietnamese support

**Solution**: **Approach 2 - Font Stack with Fallback**

```css
--font-sans: var(--font-geist-mono);
--font-mono: "Fira Code", "JetBrains Mono", monospace;
```

**How it works**:
1. Geist Mono → Primary font for entire app body
2. Fira Code → Primary for code blocks
3. JetBrains Mono → Fallback for Vietnamese glyphs (ă, â, ê, ô, ơ, ư, đ)

**Vietnamese Support**: ✅ Yes (via JetBrains Mono fallback)

---

## Implementation Steps

### 1. Install JetBrains Mono (for Vietnamese fallback)

```bash
bun add @fontsource/jetbrains-mono
```

### 2. Update `src/app/layout.tsx`

Remove Geist Sans import, keep only Geist Mono:

```typescript
import { GeistMono } from "geist/font/mono";
import "@fontsource/jetbrains-mono"; // Add this

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistMono.variable} suppressHydrationWarning>
      {/* ... */}
    </html>
  );
}
```

### 3. Update `src/app/globals.css`

Change font variables in `@theme inline`:

```css
@theme inline {
  --font-sans: var(--font-geist-mono);     /* Changed from Geist Sans */
  --font-mono: "Fira Code", "JetBrains Mono", monospace;
  /* ... rest of theme ... */
}
```

### 4. (Optional) Add Fira Code via CDN or package

If you want actual Fira Code, install:
```bash
bun add @fontsource/fira-code
```

Then import in `layout.tsx`:
```typescript
import "@fontsource/fira-code";
```

### 5. Test Vietnamese Characters

Test with: `ă, â, ê, ô, ơ, ư, đ, Ớ, Ờ`

**Expected behavior**:
- English text → Geist Mono (body) / Fira Code (code)
- Vietnamese chars → JetBrains Mono fallback (if Fira Code lacks glyph)

---

## Sources

- [Fira Code Vietnamese Support Issue #185](https://github.com/tonsky/FiraCode/issues/185)
- [Tailwind CSS Font Family Documentation](https://tailwindcss.com/docs/font-family)
- [Fira Code on Google Fonts](https://fonts.google.com/specimen/Fira+Code)
- [Languages supported by latin vs latin-extended glyphs](https://stackoverflow.com/questions/14303677/languages-supported-by-latin-vs-latin-extended-glyphs-in-fonts-on-web)

---

## Summary

| Approach | Vietnamese Support | Effort | Risk | Status |
|----------|-------------------|--------|------|--------|
| 1. Pure Fira Code | ❌ Partial | Medium | Med-High | ❌ Rejected |
| 2. Fira Code + JetBrains Mono | ✅ Yes | Low | Low | ✅ **SELECTED** |
| 3. JetBrains Mono Only | ✅ Yes | Low | Very Low | ❌ Not Fira Code |
| 4. Custom Fira Code Build | ✅ Yes | Very High | High | ❌ Too Complex |

---

## Final Solution: Geist Mono Body + Fira Code/JetBrains Mono Stack

```
Body Text:    Geist Mono
Code Blocks:  Fira Code → JetBrains Mono → monospace
Vietnamese:   JetBrains Mono (automatic fallback)
```

**Packages needed**:
- `geist` (already installed)
- `@fontsource/jetbrains-mono` (add)
- `@fontsource/fira-code` (optional, for Fira Code)

**Implementation**: Ready - see steps above

**Files to modify**:
1. `src/app/layout.tsx` - Remove Geist Sans, add font imports
2. `src/app/globals.css` - Change `--font-sans` and `--font-mono`
