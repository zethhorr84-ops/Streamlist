
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'streamlist-items';

function loadSavedItems() {
  try {
    const savedItems = localStorage.getItem(STORAGE_KEY);

    if (!savedItems) {
      return [];
    }

    const parsedItems = JSON.parse(savedItems);

    return Array.isArray(parsedItems) ? parsedItems : [];
  } catch (error) {
    console.error('Could not load StreamList:', error);
    return [];
  }
}

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

    const newItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title,
      completed: false,
    };

    setStreamList((currentList) => [...currentList, newItem]);
    console.log('StreamList Item:', title);
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

    setStreamList((currentList) =>
      currentList.map((item) =>
        item.id === id ? { ...item, title } : item
      )
    );

    setEditingId(null);
    setEditInput('');
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditInput('');
  };

  const filteredList = streamList.filter((item) => {
    if (filter === 'completed') {
      return item.completed;
    }

    if (filter === 'active') {
      return !item.completed;
    }

    return true;
  });

  const completedCount = streamList.filter(
    (item) => item.completed
  ).length;

  const activeCount = streamList.length - completedCount;

  return (
    <section className="streamlist-section">
      <div className="hero">
        <p className="eyebrow">EZTechMovie presents</p>

        <h1>Build Your StreamList</h1>

        <p className="hero-text">
          Keep track of movies and programs you want to watch.
          Your list is saved automatically on this device.
        </p>
      </div>

      <div className="streamlist-card">
        <div className="card-heading">
          <div>
            <h2>Add to Your List</h2>
            <p className="card-description">
              What do you want to watch?
            </p>
          </div>

          <span className="material-symbols-outlined heading-icon">
            movie
          </span>
        </div>

        <form onSubmit={handleSubmit} className="stream-form">
          <input
            type="text"
            value={movieInput}
            onChange={(event) => setMovieInput(event.target.value)}
            placeholder="Enter a movie or program..."
            aria-label="Movie or program title"
          />

          <button type="submit">
            <span className="material-symbols-outlined">add</span>
            Add to List
          </button>
        </form>

        <div className="list-container">
          <div className="list-header">
            <div>
              <h2>Your StreamList</h2>

              <p className="list-summary">
                {streamList.length === 0
                  ? 'Your list is ready for your next favorite.'
                  : `${activeCount} to watch • ${completedCount} completed`}
              </p>
            </div>

            <div className="list-count">{streamList.length}</div>
          </div>

          <div className="filter-buttons">
            {[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'To Watch' },
              { value: 'completed', label: 'Completed' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                className={
                  filter === option.value
                    ? 'filter-button active'
                    : 'filter-button'
                }
                onClick={() => setFilter(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

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
                <li
                  key={item.id}
                  className={
                    item.completed
                      ? 'stream-item completed'
                      : 'stream-item'
                  }
                >
                  {editingId === item.id ? (
                    <form
                      className="edit-container"
                      onSubmit={(event) => {
                        event.preventDefault();
                        handleEditSave(item.id);
                      }}
                    >
                      <input
                        type="text"
                        value={editInput}
                        onChange={(event) =>
                          setEditInput(event.target.value)
                        }
                        className="edit-input"
                        aria-label="Edit movie title"
                        autoFocus
                      />

                      <div className="edit-actions">
                        <button
                          type="submit"
                          className="action-button save-button"
                          title="Save changes"
                          aria-label="Save changes"
                        >
                          <span className="material-symbols-outlined">
                            check
                          </span>
                        </button>

                        <button
                          type="button"
                          className="action-button cancel-button"
                          onClick={handleEditCancel}
                          title="Cancel editing"
                          aria-label="Cancel editing"
                        >
                          <span className="material-symbols-outlined">
                            close
                          </span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="complete-button"
                        onClick={() => handleComplete(item.id)}
                        title={
                          item.completed
                            ? 'Mark as incomplete'
                            : 'Mark as completed'
                        }
                        aria-label={
                          item.completed
                            ? 'Mark as incomplete'
                            : 'Mark as completed'
                        }
                      >
                        <span className="material-symbols-outlined">
                          {item.completed
                            ? 'check_circle'
                            : 'radio_button_unchecked'}
                        </span>
                      </button>

                      <div className="stream-item-content">
                        <span className="movie-icon">
                          <span className="material-symbols-outlined">
                            movie
                          </span>
                        </span>

                        <span className="stream-item-title">
                          {item.title}
                        </span>
                      </div>

                      <div className="item-actions">
                        <button
                          type="button"
                          className="action-button edit-button"
                          onClick={() => handleEditStart(item)}
                          title="Edit item"
                          aria-label={`Edit ${item.title}`}
                        >
                          <span className="material-symbols-outlined">
                            edit
                          </span>
                        </button>

                        <button
                          type="button"
                          className="action-button delete-button"
                          onClick={() => handleDelete(item.id)}
                          title="Delete item"
                          aria-label={`Delete ${item.title}`}
                        >
                          <span className="material-symbols-outlined">
                            delete
                          </span>
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

export default StreamList;
