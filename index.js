const autoCompleteConfig = {
  root: document.querySelector("#left-autocomplete"),
  renderMenuOption: (movie) => {
    const posterSrc = movie.Poster === "N/A" ? "" : movie.Poster;
    return `
    <img  src="${posterSrc}" />
    ${movie.Title} (${movie.Year})
  `;
  },
  onOptionSelect: async (movie) => {
    document.querySelector(".tutorial").classList.add("is-hidden");
    const response = await axios.get("http://www.omdbapi.com/", {
      params: {
        i: movie.imdbID,
        apikey: "382fab15",
      },
    });

    document.querySelector("#summary").innerHTML = movieTemplate(response.data);
  },
  inputValue: (movie) => {
    return movie.Title;
  },
  fetchData: async (searchParam) => {
    try {
      const res = await axios.get("http://www.omdbapi.com/", {
        params: {
          s: searchParam,
          apikey: "382fab15",
        },
      });

      if (res.data.Error) {
        return [];
      }

      return res.data.Search;
    } catch (error) {
      throw new Error("Failed to fetch.");
    }
  },
};

createAutocomplete({
  ...autoCompleteConfig,
  root: document.querySelector("#left-autocomplete"),
  onOptionSelect: async (movie) => {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#left-summary"), "left");
  },
});

createAutocomplete({
  ...autoCompleteConfig,
  root: document.querySelector("#right-autocomplete"),
  onOptionSelect: async (movie) => {
    document.querySelector(".tutorial").classList.add("is-hidden");
    onMovieSelect(movie, document.querySelector("#right-summary"), "right");
  },
});

let leftMovie;
let rightMovie;

const onMovieSelect = async (movie, el, side) => {
  const response = await axios.get("http://www.omdbapi.com/", {
    params: {
      i: movie.imdbID,
      apikey: "382fab15",
    },
  });

  el.innerHTML = movieTemplate(response.data);

  if (side === "right") {
    rightMovie = response.data;
  } else {
    leftMovie = response.data;
  }

  if (leftMovie && rightMovie) {
    clearMovieComparison();
    runComparison();
  }
};

const runComparison = () => {
  const leftSideStats = document.querySelectorAll(
    "#left-summary .notification"
  );
  const rightSideStats = document.querySelectorAll(
    "#right-summary .notification"
  );

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];
    const leftStatDataValue = leftStat.getAttribute("data-value");
    const rightStatDataValue = rightStat.getAttribute("data-value");

    if (parseInt(leftStatDataValue) > parseInt(rightStatDataValue)) {
      rightStat.classList.remove("has-background-success");
      rightStat.classList.add("has-background-danger");
    } else {
      leftStat.classList.remove("has-background-success");
      leftStat.classList.add("has-background-danger");
    }
  });
};
const clearMovieComparison = () => {
  const leftSideStats = document.querySelectorAll(
    "#left-summary .notification"
  );
  const rightSideStats = document.querySelectorAll(
    "#right-summary .notification"
  );

  leftSideStats.forEach((leftStat, index) => {
    const rightStat = rightSideStats[index];

    rightStat.classList.add("has-background-success");
    leftStat.classList.add("has-background-success");
    rightStat.classList.remove("has-background-danger");
    leftStat.classList.remove("has-background-danger");
  });
};

const movieTemplate = (movieDetails) => {
  const dollars =
    movieDetails.BoxOffice !== "N/A"
      ? parseInt(movieDetails.BoxOffice.replace(/\$/g, "").replace(/,/g, ""))
      : 0;
  const metascore = parseInt(movieDetails.Metascore);
  const imdbRating = parseFloat(movieDetails.imdbRating);
  const imdbVotes = parseInt(movieDetails.imdbVotes.replace(/,/g, ""));

  const awards = movieDetails.Awards.split(" ").reduce((total, word) => {
    const value = parseInt(word);
    if (!isNaN(value)) {
      return total + value;
    } else {
      return total;
    }
  }, 0);

  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetails.Poster}" alt=""/>
        </p>
      </figure>
      <div class="content">
        <div class="content">
          <h1>${movieDetails.Title}</h1>
          <h4>${movieDetails.Genre}</h4>
          <p>${movieDetails.Plot}</p>
        </div>
      </div>
    </article>
    <article data-value=${awards} class="notification has-text-light has-background-success">
      <p class="title">${movieDetails.Awards}</p>
      <p class="subtittle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification has-text-light has-background-success">
      <p class="title">${
        movieDetails.BoxOffice ? movieDetails.BoxOffice : "N/A"
      }</p>
      <p class="subtittle">Box Office</p>
    </article>
    <article data-value=${metascore} class="notification has-text-light has-background-success">
      <p class="title">${movieDetails.Metascore}</p>
      <p class="subtittle">Metascore</p>
    </article>
    <article data-value=${imdbRating} class="notification has-text-light has-background-success">
      <p class="title">${movieDetails.imdbRating}</p>
      <p class="subtittle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification has-text-light has-background-success">
      <p class="title">${movieDetails.imdbVotes}</p>
      <p class="subtittle">IMDB Votes</p>
    </article>
  `;
};
