# StaticFruit Next.js Starter - Architecture Plan

## 1. Overview

This document outlines the proposed architecture for the StaticFruit Next.js application. The goal is to create a maintainable, scalable, and consistent codebase that follows modern React and Next.js best practices while integrating the StaticFruit blockchain design system.

## 2. Folder Structure

```
staticfruit_next_starter/
├── app/                     # Next.js App Router structure
│   ├── (routes)/           # Route groups for related pages
│   │   ├── home/           # Home page
│   │   ├── horoscope/      # Horoscope feature
│   │   ├── bars/           # Bars feature
│   │   └── markets/        # Markets feature
│   ├── api/                # API route handlers
│   ├── components/         # Root-level shared components
│   ├── lib/                # Shared utilities and libraries
│   ├── styles/             # Global styles and design tokens
│   └── public/             # Static assets
├── components/             # Shared UI components
│   ├── ui/                 # Primitive UI components
│   ├── layout/             # Layout components (Header, Footer, etc.)
│   └── feature/            # Feature-specific components
├── lib/                    # Shared libraries and utilities
├── hooks/                  # Custom React hooks
├── types/                  # TypeScript type definitions
├── styles/                 # Design system styles
└── public/                 # Static assets
```

## 3. Component Hierarchy

### 3.1 UI Components
- **Primitives**: Button, Card, Input, Textarea, etc.
- **Layout**: Header, BottomNav, Layout
- **Feature Components**: HoroscopeCard, BarCard, MarketCard, etc.

### 3.2 Page Components
- Home Page
- Horoscope Page
- Bars Page
- Markets Page

## 4. Design System Integration

### 4.1 Color Palette
- Primary: Deep Space Black, Electric Purple, Neon Green
- Accent: Gold, Cyan, Crimson
- Supporting: Charcoal, Silver, White

### 4.2 Typography
- Orbitron: Headings
- Inter: Body text
- JetBrains Mono: Code/data
- Poppins: Marketing content
- Space Grotesk: Modern interfaces
- Fira Code: Developer-focused

### 4.3 Component Styling
- Use Tailwind CSS with custom color definitions
- Consistent spacing and sizing scale
- Responsive design patterns

## 5. Data Flow and API Integration

### 5.1 API Layer
- Centralized API client in `lib/api.ts`
- SWR for data fetching and caching
- Error handling and loading states

### 5.2 State Management
- Zustand for global state management
- React Context for theme and user data
- Component-level state for UI interactions

## 6. Development Practices

### 6.1 Code Organization
- Feature-based organization within app router
- Reusable components in shared directories
- Clear separation of concerns

### 6.2 Naming Conventions
- PascalCase for components
- camelCase for variables and functions
- UPPER_SNAKE_CASE for constants
- Descriptive naming for files and functions

### 6.3 TypeScript Usage
- Strict typing for all components and functions
- Shared type definitions in `types/` directory
- Type-safe API responses

## 7. Future Extensibility

### 7.1 Adding New Features
1. Create new route group in `app/`
2. Implement page components
3. Add necessary UI components
4. Extend API layer if needed

### 7.2 Design System Evolution
- Centralized token management
- Component documentation
- Accessibility compliance