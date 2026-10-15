/**
 * @typedef {Object} StreamItem
 * @property {string} id - Unique identifier for the item.
 * @property {string} title - Title of the movie or program.
 * @property {boolean} completed - Whether the item has been watched.
 */

/**
 * Validates that a parsed value is a well-formed StreamItem.
 * @param {*} item - The value to check.
 * @returns {StreamItem|null} A sanitized StreamItem, or null if invalid.
 */
function sanitizeItem(item) {
  if (!item || typeof item !== 'object') {
    return null;
  }

  const { id, title, completed } = item;

  if (typeof id !== 'string' || typeof title !== 'string') {
    return null;
  }

  return {
    id,
    title,
    completed: completed === true,
  };
}

/**
 * Loads and sanitizes the saved list from localStorage.
 * @returns {StreamItem[]}
 */
function loadSavedItems() {
  try {
    const savedItems = localStorage.getItem(STORAGE_KEY);

    if (!savedItems) {
      return [];
    }

    const parsedItems = JSON.parse(savedItems);

    return Array.isArray(parsedItems)
      ? parsedItems
        .map(sanitizeItem)
        .filter(Boolean)
      : [];
  } catch (error) {
    console.error('Could not load StreamList:', error);
    return [];
  }
}

/**
 * Creates a new StreamItem with a unique id.
 * @param {string} title - The trimmed item title.
 * @returns {StreamItem}
 */
function createItem(title) {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    title,
    completed: false,
  };
}

/**
 * Returns a copy of the list with one item patched.
 * @param {StreamItem[]} list
 * @param {string} id
 * @param {Partial<StreamItem>} patch
 * @returns {StreamItem[]}
 */
function updateItem(list, id, patch) {
  return list.map((item) => (item.id === id ? { ...item, ...patch } : item));
}

/**
 * Filters the list according to the selected filter value.
 * @param {StreamItem[]} list
 * @param {'all'|'active'|'completed'} filter
 * @returns {StreamItem[]}
 */
function filterItems(list, filter) {
  if (filter === 'completed') {
    return list.filter((item) => item.completed);
  }

  if (filter === 'active') {
    return list.filter((item) => !item.completed);
  }

  return list;
}

/** @type {string} */
const STORAGE_KEY = 'streamlist-items';

export { createItem, filterItems, loadSavedItems, sanitizeItem, updateItem, STORAGE_KEY };
