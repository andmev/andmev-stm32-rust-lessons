# STM32 Rust Lessons

A multilingual static site for learning STM32 microcontroller programming with Rust. Built with modern web technologies and optimized for performance and accessibility.

## ✨ Features

- 🌍 **Multilingual Support** - Content available in English, Spanish, Ukrainian, French, and German
- 📚 **MDX-based Content** - Write lessons with Markdown and JSX components
- 🎨 **Modern Styling** - TailwindCSS 4 with custom design system
- ⚡ **Fast & Optimized** - Astro 5 static site generation for optimal performance
- 🧪 **Quality Assured** - Comprehensive testing with Vitest
- 🔍 **SEO Optimized** - Full Open Graph and Twitter Card support
- ♿ **Accessible** - WCAG compliant with keyboard navigation support
- 🚀 **Auto-deployed** - Continuous deployment to GitHub Pages

## 🏗️ Project Structure

```text
stm32-rust-lessons/
├── public/                      # Static assets
│   ├── images/layout/          # Layout images (logo, decorations)
│   └── favicon.svg
├── src/
│   ├── components/             # Reusable components
│   │   ├── LanguagePickerIsland.tsx  # Client-side language switcher
│   │   ├── LessonCard.tsx            # Lesson display card
│   │   └── SEOHead.astro             # SEO metadata component
│   ├── content/                # Content collections
│   │   ├── {lang}/lessons/    # Lesson MDX files by language
│   │   └── {lang}/{home,about}.mdx   # Static pages
│   ├── layouts/               # Page layouts
│   │   └── BaseLayout.astro   # Main layout with navigation
│   ├── pages/                 # Route definitions
│   │   └── [lang]/            # Language-specific routes
│   ├── styles/                # Global styles
│   │   └── global.css         # TailwindCSS with custom theme
│   └── utils/                 # Utility functions
│       ├── languages.ts       # Language detection & utilities
│       └── url.ts             # URL helper functions
├── astro.config.mjs           # Astro configuration
├── tailwind.config.js         # TailwindCSS configuration
└── vitest.config.ts           # Test configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/andmev/andmev-stm32-rust-lessons.git
cd stm32-rust-lessons

# Install dependencies
npm install
```

### Development

```bash
# Start development server at http://localhost:4321
npm run dev

# Run tests
npm run test        # Watch mode
npm run test:run    # Single run

# Code quality checks
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues
npm run format      # Format with Prettier
npm run type-check  # TypeScript type checking
```

### Building for Production

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Build for GitHub Pages (with base path)
GITHUB_PAGES=true npm run build
```

## 📝 Adding Content

### Adding a New Lesson

1. Create a new MDX file in `src/content/{lang}/lessons/`:

```markdown
---
title: 'Getting Started with STM32'
description: 'Learn the basics of STM32 programming with Rust'
order: 1
category: 'Basics'
---

Your lesson content here...
```

2. The lesson will be automatically discovered and added to navigation

### Adding a New Language

1. Create directory structure: `src/content/{lang}/lessons/`
2. Add static pages: `{lang}/home.mdx`, `{lang}/about.mdx`
3. Update `LANGUAGE_NAMES` in `src/utils/languages.ts`
4. Language will be auto-detected and added to the language picker

## 🧞 Commands Reference

| Command                 | Action                                       |
| :---------------------- | :------------------------------------------- |
| `npm install`           | Install dependencies                         |
| `npm run dev`           | Start dev server at `localhost:4321`         |
| `npm run build`         | Build production site to `./dist/`           |
| `npm run preview`       | Preview production build locally             |
| `npm run test`          | Run tests in watch mode                      |
| `npm run test:run`      | Run tests once                               |
| `npm run test:coverage` | Run tests with coverage report               |
| `npm run lint`          | Lint JavaScript, TypeScript, and Astro files |
| `npm run lint:fix`      | Auto-fix linting issues                      |
| `npm run format`        | Format all files with Prettier               |
| `npm run format:check`  | Check formatting without changes             |
| `npm run type-check`    | Run TypeScript type checking                 |
| `npm run astro ...`     | Run Astro CLI commands                       |

## 🌐 Multilingual Architecture

The site uses Astro's content collections with automatic language detection:

- **URL Structure**: `/{lang}/{slug}/` (e.g., `/en/getting-started/`, `/es/primeros-pasos/`)
- **Language Detection**: Automatically detects available languages from content directory
- **Default Language**: English (en) at root path `/`
- **Language Persistence**: Language picker state persists across navigation

## 🎨 Styling

- **TailwindCSS 4**: Modern utility-first CSS framework
- **Custom Design System**: Consistent colors, typography, and spacing
- **Typography Plugin**: Beautiful prose styling for lesson content
- **Custom Fonts**:
  - Instrument Serif (headings)
  - JetBrains Mono (code)
  - PT Sans (body text)

## 🧪 Testing

- **Unit Tests**: Vitest for utility functions and components
- **Component Tests**: Testing Library for Preact components
- **Coverage**: Aim for >80% code coverage
- **Pre-commit Hooks**: Automatic test execution before commits

## 🚀 Deployment

The site automatically deploys to GitHub Pages when you push to the `main` branch:

- **Live Site**: https://andmev.github.io/andmev-stm32-rust-lessons
- **CI/CD**: GitHub Actions workflow
- **Build Time**: ~2-3 minutes

Manual deployment:

```bash
# Trigger manual deployment from GitHub Actions tab
# or push to main branch
```

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Documentation**: [Astro Docs](https://docs.astro.build)
- **GitHub Repository**: https://github.com/andmev/andmev-stm32-rust-lessons
- **Issues**: https://github.com/andmev/andmev-stm32-rust-lessons/issues

## 💬 Support

For questions or issues:

1. Check existing [GitHub Issues](https://github.com/andmev/andmev-stm32-rust-lessons/issues)
2. Create a new issue with detailed description
3. Join discussions in the repository

---

Built with ❤️ using [Astro](https://astro.build)
