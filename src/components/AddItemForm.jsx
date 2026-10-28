function AddItemForm({ value, onChange, onSubmit }) {
  return (
    <>
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

      <form onSubmit={onSubmit} className="stream-form">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Enter a movie or program..."
          aria-label="Movie or program title"
        />

        <button type="submit">
          <span className="material-symbols-outlined">add</span>
          Add to List
        </button>
      </form>
    </>
  );
}

export default AddItemForm;
