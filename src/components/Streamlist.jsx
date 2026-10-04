import { useState } from 'react';

function StreamList() {

  const [movieInput, setMovieInput] = useState('');
  const [streamList, setStreamList] = useState([]);

  const handleSubmit = (event) => {

    event.preventDefault();

    if (movieInput.trim() === '') {
      return;
    }

    const newItem = movieInput.trim();

    setStreamList([...streamList, newItem]);

    console.log('StreamList Item:', newItem);

    setMovieInput('');
  };

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
          Add your favorites to your personal streaming list.
        </p>

      </div>

      <div className="streamlist-card">

        <h2>Add to Your List</h2>

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
            + Add to List
          </button>

        </form>

        <div className="list-container">

          <h2>Your StreamList</h2>

          {streamList.length === 0 ? (

            <p className="empty-message">
              Your list is currently empty.
              Add a movie or program above!
            </p>

          ) : (

            <ul className="stream-list">

              {streamList.map((item, index) => (

                <li
                  key={index}
                  className="stream-item"
                >
                  <span>🎬</span>
                  {item}
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