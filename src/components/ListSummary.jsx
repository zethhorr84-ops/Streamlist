/**
 * @typedef {import('./itemUtils').StreamItem} StreamItem
 */

const FILTER_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'To Watch' },
  { value: 'completed', label: 'Completed' },
];

function ListSummary({ totalCount, activeCount, completedCount, filter, onFilterChange }) {
  return (
    <>
      <div className="list-header">
        <div>
          <h2>Your StreamList</h2>

          <p className="list-summary">
            {totalCount === 0
              ? 'Your list is ready for your next favorite.'
              : `${activeCount} to watch • ${completedCount} completed`}
          </p>
        </div>

        <div className="list-count">{totalCount}</div>
      </div>

      <div className="filter-buttons">
        {FILTER_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={
              filter === option.value
                ? 'filter-button active'
                : 'filter-button'
            }
            onClick={() => onFilterChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </>
  );
}

export default ListSummary;
