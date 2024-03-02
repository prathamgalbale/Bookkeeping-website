const allBooksTab = document.getElementById("allBooksTab");
const favoritesTab = document.getElementById("favoritesTab");
const searchInput = document.getElementById("searchInput");
const booksContainer = document.getElementById("booksContainer");
const favouriteIcon = document.getElementById("favouriteIcon");
const searchResultsContainer = document.getElementById("searchResultsContainer");

const url =
  "https://book-finder1.p.rapidapi.com/api/search?series=Wings%20of%20fire&book_type=Fiction&lexile_min=600&lexile_max=800&results_per_page=25&page=1";
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "d364677815msh362232896635341p1bc4f2jsnb9f4779c1f4d",
    "X-RapidAPI-Host": "book-finder1.p.rapidapi.com",
  },
};

let booksData = JSON.parse(localStorage.getItem("booksData")) || [] ;
let favouriteBooks = JSON.parse(localStorage.getItem("favouriteBooks")) || [];

fetchBooks();

async function fetchBooks() {
  try {
    let response = await fetch(url, options);
    let data = await response.json();
    booksData = data.results.map((book) => {
      return { ...book, isFavorite: false }
    });
    displayBooks(booksData);
  } catch (error) {
    console.error("Error fetching books:", error);
  }
}


searchInput.addEventListener("input", () => {
  const searchTerm = searchInput.value.toLowerCase();
  
  const searchResults = booksData.filter((book) => {
      const title = book.title_search.toLowerCase();
      const author = `${book.author_first_names} ${book.author_last_names}`.toLowerCase();
      
      return title.includes(searchTerm) || author.includes(searchTerm);
  });

  displayBooks(searchResults);
});


function displayBooks(books) {
  booksContainer.innerHTML = "";
  books.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.classList.add("bookCard");
    bookCard.innerHTML = `
                  <h3>${book.title_search}</h3>
                  <p>Author: ${book.author_first_names} ${book.author_last_names}</p>
                  <p>Series: ${book.series_name}</p>
                  <p>Book Type: ${book.book_type}</p>
                  <img>
                    <svg id="favoriteIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>                  
                  </img>`;

    const favoriteIcon = bookCard.querySelector("#favoriteIcon");
    
    favoriteIcon.style.fill = book.isFavorite ? "red" : "grey";

    favoriteIcon.addEventListener("click", () => {
      book.isFavorite = !book.isFavorite;
      favoriteIcon.style.fill = book.isFavorite ? "red" : "grey";
      localStorage.setItem("booksData", JSON.stringify(booksData));
    });
    booksContainer.appendChild(bookCard);
  });
}


allBooksTab.addEventListener("click", () => {
  allBooksTab.classList.add("active");
  allBooksTab.style.borderBottom = "4px solid #333";
  favouritesTab.style.borderBottom = "none";
  favouritesTab.classList.remove("active");
  displayBooks(booksData);
  showSearchBar(); 
});

favouritesTab.addEventListener("click", () => {
  favouritesTab.classList.add("active");
  allBooksTab.classList.remove("active");
  allBooksTab.style.borderBottom = "none";
  favouritesTab.style.borderBottom = "4px solid #333";
  favouriteBooks = booksData.filter((book) => book.isFavorite);
  localStorage.setItem("booksData", JSON.stringify(favouriteBooks));
  displayBooks(favouriteBooks);
  hideSearchBar(); 
});

function showSearchBar() {
  searchInput.style.display = "block";
  searchResultsContainer.style.display = "block";
}

function hideSearchBar() {
  searchInput.style.display = "none";
  searchResultsContainer.style.display = "none";
}

showSearchBar();














