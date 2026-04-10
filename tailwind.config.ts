import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ─── DESIGN SYSTEM ───────────────────────────────────────────────────────
      // Color palette: premium dark enterprise SaaS
      // Philosophy: Deep space backgrounds, crisp text, electric brand blue,
      // subtle gold accent. Feels like Bloomberg Terminal meets Linear.
      // ─────────────────────────────────────────────────────────────────────────
      colors: {
        // --- Base backgrounds ---
        background: {
          DEFAULT: "hsl(var(--background))",
          subtle: "hsl(var(--background-subtle))",
          raised: "hsl(var(--background-raised))",
        },
        surface: {
          DEFAULT: "hsl(var(--surface))",
          raised: "hsl(var(--surface-raised))",
          overlay: "hsl(var(--surface-overlay))",
        },
        // --- Border ---
        border: {
          DEFAULT: "hsl(var(--border))",
          subtle: "hsl(var(--border-subtle))",
          strong: "hsl(var(--border-strong))",
        },
        // --- Text ---
        text: {
          primary: "hsl(var(--text-primary))",
          secondary: "hsl(var(--text-secondary))",
          muted: "hsl(var(--text-muted))",
          disabled: "hsl(var(--text-disabled))",
          inverse: "hsl(var(--text-inverse))",
        },
        // --- Brand (primary action color) ---
        brand: {
          DEFAULT: "hsl(var(--brand))",
          light: "hsl(var(--brand-light))",
          dark: "hsl(var(--brand-dark))",
          muted: "hsl(var(--brand-muted))",
          foreground: "hsl(var(--brand-foreground))",
        },
        // --- Accent (gold) ---
        accent: {
          DEFAULT: "hsl(var(--accent))",
          light: "hsl(var(--accent-light))",
          foreground: "hsl(var(--accent-foreground))",
        },
        // --- Semantic ---
        success: {
          DEFAULT: "hsl(var(--success))",
          muted: "hsl(var(--success-muted))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          muted: "hsl(var(--warning-muted))",
          foreground: "hsl(var(--warning-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          muted: "hsl(var(--destructive-muted))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          muted: "hsl(var(--info-muted))",
          foreground: "hsl(var(--info-foreground))",
        },
        // --- shadcn/ui required tokens ---
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        foreground: "hsl(var(--foreground))",
      },

      // ─── TYPOGRAPHY ──────────────────────────────────────────────────────────
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "JetBrains Mono", "monospace"],
        display: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        // Display sizes (hero, section headings)
        "display-2xl": ["4.5rem", { lineHeight: "1.1", letterSpacing: "-0.03em" }],
        "display-xl": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.025em" }],
        "display-lg": ["3rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        "display-md": ["2.25rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        "display-sm": ["1.875rem", { lineHeight: "1.25", letterSpacing: "-0.015em" }],
        // Body sizes
        "body-xl": ["1.25rem", { lineHeight: "1.75" }],
        "body-lg": ["1.125rem", { lineHeight: "1.75" }],
        "body-md": ["1rem", { lineHeight: "1.6" }],
        "body-sm": ["0.875rem", { lineHeight: "1.5" }],
        "body-xs": ["0.75rem", { lineHeight: "1.5" }],
        // Label sizes
        "label-lg": ["1rem", { lineHeight: "1.5", letterSpacing: "0.01em" }],
        "label-md": ["0.875rem", { lineHeight: "1.5", letterSpacing: "0.01em" }],
        "label-sm": ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.02em" }],
        "label-xs": ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.05em" }],
      },

      // ─── SPACING ─────────────────────────────────────────────────────────────
      spacing: {
        // Component internal spacing
        "component-xs": "0.375rem",   // 6px  — inline elements
        "component-sm": "0.625rem",   // 10px — badges, chips
        "component-md": "0.875rem",   // 14px — form fields
        "component-lg": "1.125rem",   // 18px — buttons, cards
        // Section spacing
        "section-sm": "4rem",         // 64px
        "section-md": "6rem",         // 96px
        "section-lg": "8rem",         // 128px
        "section-xl": "10rem",        // 160px
      },

      // ─── BORDER RADIUS ───────────────────────────────────────────────────────
      borderRadius: {
        // System-wide radius tokens
        "2xs": "0.125rem",  // 2px  — tiny badges
        xs: "0.25rem",      // 4px  — chips
        sm: "0.375rem",     // 6px  — buttons (secondary)
        DEFAULT: "0.5rem",  // 8px  — standard elements
        md: "0.625rem",     // 10px
        lg: "0.75rem",      // 12px — cards
        xl: "1rem",         // 16px — panels
        "2xl": "1.25rem",   // 20px — large cards
        "3xl": "1.5rem",    // 24px — hero elements
        full: "9999px",     // pill
        // shadcn/ui
        radius: "var(--radius)",
      },

      // ─── SHADOWS ─────────────────────────────────────────────────────────────
      boxShadow: {
        // Elevation system
        "elevation-0": "none",
        "elevation-1": "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
        "elevation-2": "0 2px 8px -1px rgba(0, 0, 0, 0.4), 0 1px 3px -1px rgba(0, 0, 0, 0.3)",
        "elevation-3": "0 8px 24px -4px rgba(0, 0, 0, 0.5), 0 2px 8px -2px rgba(0, 0, 0, 0.4)",
        "elevation-4": "0 16px 48px -8px rgba(0, 0, 0, 0.6), 0 4px 16px -4px rgba(0, 0, 0, 0.4)",
        // Brand glow effects
        "brand-glow": "0 0 0 1px hsl(var(--brand) / 0.3), 0 4px 16px -2px hsl(var(--brand) / 0.25)",
        "brand-glow-lg": "0 0 0 1px hsl(var(--brand) / 0.4), 0 8px 32px -4px hsl(var(--brand) / 0.3)",
        // Inset shadow for pressed state
        "inner-sm": "inset 0 1px 2px 0 rgba(0, 0, 0, 0.3)",
      },

      // ─── ANIMATIONS ──────────────────────────────────────────────────────────
      keyframes: {
        // Entrance
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-down": {
          from: { opacity: "0", transform: "translateY(-12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        // Looping
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
        // Slide
        "slide-in-from-left": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "slide-in-from-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        // Border gradient rotation
        "border-spin": {
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "fade-in-up": "fade-in-up 0.4s ease-out",
        "fade-in-down": "fade-in-down 0.4s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        shimmer: "shimmer 2s linear infinite",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "slide-in-left": "slide-in-from-left 0.3s ease-out",
        "slide-in-right": "slide-in-from-right 0.3s ease-out",
        "border-spin": "border-spin 3s linear infinite",
      },

      // ─── BACKGROUND GRADIENTS ─────────────────────────────────────────────
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-brand": "linear-gradient(135deg, hsl(var(--brand)), hsl(var(--brand-light)))",
        "gradient-brand-subtle": "linear-gradient(135deg, hsl(var(--brand) / 0.15), hsl(var(--brand-light) / 0.05))",
        "gradient-surface": "linear-gradient(180deg, hsl(var(--surface)), hsl(var(--background)))",
        "shimmer-gradient": "linear-gradient(90deg, transparent 0%, hsl(var(--surface-raised)) 50%, transparent 100%)",
        "noise": "url('/images/noise.png')",
      },

      // ─── TRANSITIONS ─────────────────────────────────────────────────────
      transitionTimingFunction: {
        "bounce-soft": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "ease-out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "ease-in-expo": "cubic-bezier(0.7, 0, 0.84, 0)",
      },
      transitionDuration: {
        "50": "50ms",
        "150": "150ms",
        "250": "250ms",
        "350": "350ms",
        "450": "450ms",
      },

      // ─── LAYOUT ──────────────────────────────────────────────────────────
      maxWidth: {
        "8xl": "90rem",   // 1440px
        "9xl": "100rem",  // 1600px
        "screen-2xl": "1536px",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms")({ strategy: "class" }),
  ],
} satisfies Config;

export default config;
