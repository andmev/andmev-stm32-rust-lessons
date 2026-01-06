# Contributing to STM32 Rust Lessons

Thank you for your interest in contributing to STM32 Rust Lessons! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and collaborative environment for all contributors.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected behavior**
- **Actual behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, Node.js version, browser)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear title and description**
- **Rationale** for the enhancement
- **Possible implementation** approach (if you have ideas)
- **Examples** from other projects (if applicable)

### Contributing Content

#### Adding New Lessons

1. **Fork the repository** and create a new branch:

   ```bash
   git checkout -b lesson/your-lesson-name
   ```

2. **Create lesson file** in the appropriate language directory:

   ```
   src/content/{lang}/lessons/your-lesson-name.mdx
   ```

3. **Add frontmatter** with required fields:

   ```yaml
   ---
   title: 'Your Lesson Title'
   description: 'Brief description of the lesson'
   order: 10 # Determines position in navigation
   category: 'Category Name'
   ---
   ```

4. **Write content** using MDX (Markdown + JSX components)

5. **Test locally**:

   ```bash
   npm run dev
   ```

6. **Submit a pull request**

#### Translating Content

We welcome translations! To translate existing lessons:

1. **Check** if the language directory exists in `src/content/{lang}/`
2. **Create directory** if needed: `src/content/{lang}/lessons/`
3. **Add language** to `LANGUAGE_NAMES` in `src/utils/languages.ts`
4. **Translate** existing lessons, maintaining the same file structure
5. **Create static pages**: `{lang}/home.mdx` and `{lang}/about.mdx`
6. **Test** the language switcher works correctly

### Contributing Code

#### Development Workflow

1. **Fork the repository** and clone your fork:

   ```bash
   git clone https://github.com/your-username/stm32-rust-lessons.git
   cd stm32-rust-lessons
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Create a feature branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make your changes** following our coding standards

5. **Test your changes**:

   ```bash
   npm run test        # Run tests
   npm run lint        # Check code quality
   npm run type-check  # Check TypeScript types
   npm run build       # Ensure build succeeds
   ```

6. **Commit your changes**:

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

   Follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding or updating tests
   - `chore:` - Maintenance tasks

7. **Push to your fork**:

   ```bash
   git push origin feature/your-feature-name
   ```

8. **Create a Pull Request** on GitHub

## Coding Standards

### TypeScript/JavaScript

- Use **TypeScript** for type safety
- Follow **ESLint** rules (run `npm run lint`)
- Use **meaningful variable names**
- Add **JSDoc comments** for exported functions
- Prefer **functional programming** patterns
- Keep functions **small and focused**

### Astro Components

- Use `.astro` for static components
- Use `.tsx` for interactive (client-side) components
- Follow **component composition** patterns
- Add **type definitions** for props
- Use **@/ alias** for imports from `src/`

### CSS/Styling

- Use **TailwindCSS utility classes** when possible
- Add **custom CSS** in `src/styles/` for complex styles
- Follow **mobile-first** approach
- Ensure **accessibility** (color contrast, keyboard navigation)

### Testing

- Write **unit tests** for utility functions
- Write **component tests** for interactive components
- Aim for **>80% code coverage**
- Tests run automatically in pre-commit hooks

## Pull Request Process

1. **Update documentation** if you're changing functionality
2. **Add tests** for new features
3. **Ensure all tests pass** (`npm run test`)
4. **Ensure build succeeds** (`npm run build`)
5. **Update CHANGELOG.md** if applicable
6. **Request review** from maintainers
7. **Address feedback** in a timely manner

### PR Title Format

Follow Conventional Commits format:

```
feat(component): add language picker keyboard navigation
fix(layout): correct mobile menu positioning
docs(readme): update installation instructions
```

## Project Structure

```
stm32-rust-lessons/
├── src/
│   ├── components/      # Reusable components
│   ├── content/         # MDX content files
│   ├── layouts/         # Page layouts
│   ├── pages/           # Route definitions
│   ├── styles/          # Global styles
│   └── utils/           # Utility functions
├── public/              # Static assets
├── .github/             # GitHub Actions workflows
└── tests/               # Test files
```

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Code style (formatting, missing semicolons, etc.)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding missing tests
- `chore`: Changes to build process or tools

**Example:**

```
feat(lessons): add GPIO configuration lesson

Add comprehensive lesson covering GPIO pin configuration
including input/output modes and pull-up/pull-down resistors.

Closes #123
```

## Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Run type checking
npm run type-check
```

## Building and Previewing

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Getting Help

- **Documentation**: Check the [README.md](README.md)
- **Issues**: Browse [existing issues](https://github.com/andmev/andmev-stm32-rust-lessons/issues)
- **Discussions**: Start a discussion in the repository
- **Questions**: Open an issue with the `question` label

## Recognition

Contributors will be recognized in:

- GitHub contributors list
- Project documentation (if significant contributions)
- Release notes (for feature contributions)

## License

By contributing to STM32 Rust Lessons, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to STM32 Rust Lessons! Your efforts help make embedded systems education accessible to everyone.
