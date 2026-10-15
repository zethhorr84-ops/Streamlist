/**
 * @typedef {import('./itemUtils').StreamItem} StreamItem
 */

/**
 * Renders a single list item, either in edit mode or display mode.
 */
function StreamItem({
  item,
  isEditing,
  editValue,
  onEditValueChange,
  onEditSave,
  onEditCancel,
  onComplete,
  onEditStart,
  onDelete,
}) {
  if (isEditing) {
    return (
      <li className="stream-item">
        <form
          className="edit-container"
          onSubmit={(event) => {
            event.preventDefault();
            onEditSave(item.id);
          }}
        >
          <input
            type="text"
            value={editValue}
            onChange={(event) => onEditValueChange(event.target.value)}
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
              onClick={onEditCancel}
              title="Cancel editing"
              aria-label="Cancel editing"
            >
              <span className="material-symbols-outlined">
                close
              </span>
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li
      className={
        item.completed ? 'stream-item completed' : 'stream-item'
      }
    >
      <button
        type="button"
        className="complete-button"
        onClick={() => onComplete(item.id)}
        title={
          item.completed ? 'Mark as incomplete' : 'Mark as completed'
        }
        aria-label={
          item.completed ? 'Mark as incomplete' : 'Mark as completed'
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
          onClick={() => onEditStart(item)}
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
          onClick={() => onDelete(item.id)}
          title="Delete item"
          aria-label={`Delete ${item.title}`}
        >
          <span className="material-symbols-outlined">
            delete
          </span>
        </button>
      </div>
    </li>
  );
}

export default StreamItem;
