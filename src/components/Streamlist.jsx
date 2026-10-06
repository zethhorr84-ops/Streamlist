import { useState } from 'react';

function StreamList() {
  const [movieInput, setMovieInput] = useState('');
  const [streamList, setStreamList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editInput, setEditInput] = useState('');
  const [filter, setFilter] = useState('all');

  const handleSubmit = (event) => {
    event.preventDefault();

    if (movieInput.trim() === '') {
      return;
    }

    const newItem = {
      id: Date.now(),
      title: movieInput.trim(),
      completed: false,
    };

    setStreamList([...streamList, newItem]);

    console.log('StreamList Item:', newItem.title);

    setMovieInput('');
  };

  const handleDelete = (id) => {
    setStreamList(
      streamList.filter((item) => item.id !== id)
    );
  };

  const handleComplete = (id) => {
    setStreamList(
      streamList.map((item) =>
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
    if (editInput.trim() === '') {
      return;
    }

    setStreamList(
      streamList.map((item) =>
        item.id === id
          ? { ...item, title: editInput.trim() }
          : item
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

        <p className="eyebrow">
          EZTechMovie presents
        </p>

        <h1>
          Build Your StreamList
        </h1>

        <p className="hero-text">
          Keep track of movies and programs you want to watch.
          Add, edit, complete, or remove items from your personal
          streaming list.
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

        <form
          onSubmit={handleSubmit}
          className="stream-form"
        >

          <input
            type="text"
            value={movieInput}
            onChange={(event) =>
              setMovieInput(event.target.value)
            }
            placeholder="Enter a movie or program..."
            aria-label="Movie or program title"
          />

          <button type="submit">
            <span className="material-symbols-outlined">
              add
            </span>

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

            <div className="list-count">
              {streamList.length}
            </div>

          </div>

          <div className="filter-buttons">

            <button
              className={
                filter === 'all'
                  ? 'filter-button active'
                  : 'filter-button'
              }
              onClick={() => setFilter('all')}
            >
              All
            </button>

            <button
              className={
                filter === 'active'
                  ? 'filter-button active'
                  : 'filter-button'
              }
              onClick={() => setFilter('active')}
            >
              To Watch
            </button>

            <button
              className={
                filter === 'completed'
                  ? 'filter-button active'
                  : 'filter-button'
              }
              onClick={() => setFilter('completed')}
            >
              Completed
            </button>

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

                    <div className="edit-container">

                      <input
                        type="text"
                        value={editInput}
                        onChange={(event) =>
                          setEditInput(event.target.value)
                        }
                        className="edit-input"
                        autoFocus
                      />

                      <div className="edit-actions">

                        <button
                          className="action-button save-button"
                          onClick={() =>
                            handleEditSave(item.id)
                          }
                          title="Save changes"
                        >
                          <span className="material-symbols-outlined">
                            check
                          </span>
                        </button>

                        <button
                          className="action-button cancel-button"
                          onClick={handleEditCancel}
                          title="Cancel editing"
                        >
                          <span className="material-symbols-outlined">
                            close
                          </span>
                        </button>

                      </div>

                    </div>

                  ) : (

                    <>

                      <button
                        className="complete-button"
                        onClick={() =>
                          handleComplete(item.id)
                        }
                        title={
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
                          className="action-button edit-button"
                          onClick={() =>
                            handleEditStart(item)
                          }
                          title="Edit item"
                        >
                          <span className="material-symbols-outlined">
                            edit
                          </span>
                        </button>

                        <button
                          className="action-button delete-button"
                          onClick={() =>
                            handleDelete(item.id)
                          }
                          title="Delete item"
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