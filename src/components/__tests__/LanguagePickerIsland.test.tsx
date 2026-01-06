import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/preact';
import LanguagePickerIsland from '../LanguagePickerIsland';

describe('LanguagePickerIsland', () => {
  const defaultProps = {
    currentLang: 'en',
    availableLanguages: ['en', 'es', 'uk'],
    languageNames: {
      en: 'English',
      es: 'Español',
      uk: 'Українська',
    },
    currentPath: '/en/lesson/1',
    basePath: '',
  };

  it('renders correctly with current language', () => {
    render(<LanguagePickerIsland {...defaultProps} />);
    const button = screen.getByLabelText('Select language');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('English');
  });

  it('opens dropdown when clicked', async () => {
    render(<LanguagePickerIsland {...defaultProps} />);
    const button = screen.getByLabelText('Select language');

    // Dropdown should be closed initially
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();

    // Click to open
    fireEvent.click(button);

    const menu = await screen.findByRole('menu');
    expect(menu).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(3);
  });

  it('generates correct links for languages', async () => {
    render(<LanguagePickerIsland {...defaultProps} />);
    const button = screen.getByLabelText('Select language');
    fireEvent.click(button);

    const links = await screen.findAllByRole('menuitem');

    // English link
    expect(links[0]).toHaveAttribute('href', '/en/lesson/1');
    expect(links[0]).toHaveTextContent('English');

    // Spanish link
    expect(links[1]).toHaveAttribute('href', '/es/lesson/1');
    expect(links[1]).toHaveTextContent('Español');
  });

  it('closes dropdown when pressing Escape', async () => {
    render(<LanguagePickerIsland {...defaultProps} />);
    const button = screen.getByLabelText('Select language');
    fireEvent.click(button);

    expect(screen.getByRole('menu')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
