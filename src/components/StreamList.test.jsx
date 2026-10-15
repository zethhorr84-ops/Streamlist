import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import StreamList from './StreamList';

const STORAGE_KEY = 'streamlist-items';

async function addItem(title) {
  const user = userEvent.setup();
  const input = screen.getByLabelText('Movie or program title');
  await user.type(input, title);
  await user.click(screen.getByRole('button', { name: /add to list/i }));
}

async function markComplete(title) {
  const user = userEvent.setup();
  const item = screen.getByText(title).closest('li');
  await user.click(within(item).getByLabelText('Mark as completed'));
}

describe('StreamList', () => {
  it('adds an item to the list', async () => {
    render(<StreamList />);

    await addItem('Inception');

    expect(screen.getByText('Inception')).toBeInTheDocument();
    expect(screen.getByLabelText('Movie or program title')).toHaveValue('');
  });

  it('does not add empty or whitespace-only titles', async () => {
    render(<StreamList />);

    await addItem('   ');

    expect(screen.getByText('Your list is empty')).toBeInTheDocument();
    expect(screen.getByText(String('0'))).toBeInTheDocument();
  });

  it('persists the list to localStorage and restores it on reload', async () => {
    render(<StreamList />);
    await addItem('The Matrix');
    await markComplete('The Matrix');

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(saved).toHaveLength(1);
    expect(saved[0].title).toBe('The Matrix');
    expect(saved[0].completed).toBe(true);
  });

  it('loads previously saved items from localStorage', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        { id: 'a', title: 'Saved Movie', completed: false },
      ])
    );

    render(<StreamList />);

    expect(screen.getByText('Saved Movie')).toBeInTheDocument();
  });

  it('ignores malformed saved data', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify('not-an-array'));
    render(<StreamList />);
    expect(screen.getByText('Your list is empty')).toBeInTheDocument();
  });

  it('toggles completion on an item', async () => {
    render(<StreamList />);
    await addItem('Dune');
    await markComplete('Dune');

    const item = screen.getByText('Dune').closest('li');
    expect(item).toHaveClass('completed');
    expect(
      within(item).getByLabelText('Mark as incomplete')
    ).toBeInTheDocument();
  });

  it('edits an existing item title', async () => {
    const user = userEvent.setup();
    render(<StreamList />);
    await addItem('Interstellar');

    const item = screen.getByText('Interstellar').closest('li');
    await user.click(within(item).getByLabelText('Edit Interstellar'));

    const editInput = screen.getByLabelText('Edit movie title');
    await user.clear(editInput);
    await user.type(editInput, 'Interstellar Part 2');
    await user.click(screen.getByLabelText('Save changes'));

    expect(screen.getByText('Interstellar Part 2')).toBeInTheDocument();
  });

  it('cancels editing without saving changes', async () => {
    const user = userEvent.setup();
    render(<StreamList />);
    await addItem('Casablanca');

    const item = screen.getByText('Casablanca').closest('li');
    await user.click(within(item).getByLabelText('Edit Casablanca'));

    const editInput = screen.getByLabelText('Edit movie title');
    await user.clear(editInput);
    await user.type(editInput, 'Changed Title');
    await user.click(screen.getByLabelText('Cancel editing'));

    expect(screen.getByText('Casablanca')).toBeInTheDocument();
    expect(screen.queryByText('Changed Title')).not.toBeInTheDocument();
  });

  it('deletes an item from the list', async () => {
    const user = userEvent.setup();
    render(<StreamList />);
    await addItem('Alien');

    const item = screen.getByText('Alien').closest('li');
    await user.click(within(item).getByLabelText('Delete Alien'));

    expect(screen.queryByText('Alien')).not.toBeInTheDocument();
    expect(screen.getByText('Your list is empty')).toBeInTheDocument();
  });

  it('filters the list by active and completed', async () => {
    render(<StreamList />);
    await addItem('Watched Film');
    await addItem('Unwatched Film');
    await markComplete('Watched Film');

    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'To Watch' }));
    expect(screen.queryByText('Watched Film')).not.toBeInTheDocument();
    expect(screen.getByText('Unwatched Film')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Completed' }));
    expect(screen.getByText('Watched Film')).toBeInTheDocument();
    expect(screen.queryByText('Unwatched Film')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'All' }));
    expect(screen.getByText('Watched Film')).toBeInTheDocument();
    expect(screen.getByText('Unwatched Film')).toBeInTheDocument();
  });
});
