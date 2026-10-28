import { useEffect, useState } from 'react';

import AddItemForm from './AddItemForm';
import Hero from './Hero';
import ListSummary from './ListSummary';
import StreamItem from './StreamItem';
import {
  STORAGE_KEY,
  createItem,
  filterItems,
  loadSavedItems,
  updateItem,
} from './itemUtils';

/**
 * @typedef {import('./itemUtils').StreamItem} StreamItem
 */

function StreamList() {
  const [movieInput, setMovieInput] = useState('');
  const [streamList, setStreamList] = useState(loadSavedItems);
  const [editingId, setEditingId] = useState(null);
  const [editInput, setEditInput] = useState('');
  const [filter, setFilter] = useState('all');

  // Save the list whenever it changes.
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(streamList)
      );
    } catch (error) {
      console.error('Could not save StreamList:', error);
    }
  }, [streamList]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const title = movieInput.trim();

    if (!title) {
      return;
    }

    setStreamList((currentList) => [...currentList, createItem(title)]);
    setMovieInput('');
  };

  const handleDelete = (id) => {
    setStreamList((currentList) =>
      currentList.filter((item) => item.id !== id)
    );

    if (editingId === id) {
      setEditingId(null);
      setEditInput('');
    }
  };

  const handleComplete = (id) => {
    setStreamList((currentList) =>
      currentList.map((item) =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  };

  const handleEditStart = (item) => {
    setEditingId(item.id);
    setEditInput(item.title);
  };

  const handleEditSave = (id) => {
    const title = editInput.trim();

    if (!title) {
      return;
    }

    setStreamList((currentList) => updateItem(currentList, id, { title }));

    setEditingId(null);
    setEditInput('');
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditInput('');
  };

  const filteredList = filterItems(streamList, filter);

  const completedCount = streamList.filter(
    (item) => item.completed
  ).length;

  const activeCount = streamList.length - completedCount;

  return (
    <section className="streamlist-section">
      <Hero />

      <div className="streamlist-card">
        <AddItemForm
          value={movieInput}
          onChange={(event) => setMovieInput(event.target.value)}
          onSubmit={handleSubmit}
        />

        <div className="list-container">
          <ListSummary
            totalCount={streamList.length}
            activeCount={activeCount}
            completedCount={completedCount}
            filter={filter}
            onFilterChange={setFilter}
          />

          {filteredList.length === 0 ? (
            <div className="empty-state">
              <span className="material-symbols-outlined empty-icon">
                movie
              </span>

              <h3>
                {streamList.length === 0
                  ? 'Your list is empty'
                  : 'No items in this category'}
              </h3>

              <p>
                {streamList.length === 0
                  ? 'Add a movie or program above to get started.'
                  : 'Try selecting another filter.'}
              </p>
            </div>
          ) : (
            <ul className="stream-list">
              {filteredList.map((item) => (
                <StreamItem
                  key={item.id}
                  item={item}
                  isEditing={editingId === item.id}
                  editValue={editInput}
                  onEditValueChange={setEditInput}
                  onEditSave={handleEditSave}
                  onEditCancel={handleEditCancel}
                  onComplete={handleComplete}
                  onEditStart={handleEditStart}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export default StreamList;
