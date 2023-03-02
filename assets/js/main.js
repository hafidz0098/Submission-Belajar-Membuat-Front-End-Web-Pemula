const RENDER_EVENT = "render-book";
const STORAGE_KEY = "BOOKS";

const books = [];

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");
  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function addBook() {
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const generateBookID = generateBookId();
  const bookObject = generateBookObject(
    generateBookID,
    title,
    author,
    year,
    isComplete
  );
  books.push(bookObject);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function generateBookId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBook = document.getElementById("incompleteBookshelfList");
  incompleteBook.innerHTML = "";

  const completeBook = document.getElementById("completeBookshelfList");
  completeBook.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isComplete) {
      completeBook.append(bookElement);
    } else {
      incompleteBook.append(bookElement);
    }
  }
});

function makeBook(bookObject) {
  const title = document.createElement("h3");
  title.innerText = bookObject.title;

  const author = document.createElement("p");
  author.innerText = "Penulis : " + bookObject.author;

  const year = document.createElement("p");
  year.innerText = "Tahun : " + bookObject.year;

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.append(title, author, year);
  container.setAttribute("id", `book-${bookObject.id}`);

  if (bookObject.isComplete) {
    const unreadButton = document.createElement("button");
    unreadButton.classList.add("green");
    unreadButton.innerText = "Belum selesai dibaca";

    unreadButton.addEventListener("click", function () {
      addBookToUncompleted(bookObject.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("red");
    deleteButton.innerText = "Hapus Buku";

    deleteButton.addEventListener("click", function () {
      if (!confirm("Yakin menghapus buku?")) {
      } else {
        removeBook(bookObject.id);
      }
    });

    const actionContainer = document.createElement("div");
    actionContainer.classList.add("action");
    actionContainer.append(unreadButton, deleteButton);

    container.append(actionContainer);
  } else {
    const sudahBacaButton = document.createElement("button");
    sudahBacaButton.classList.add("green");
    sudahBacaButton.innerText = "Selesai dibaca";

    sudahBacaButton.addEventListener("click", function () {
      addBookToCompleted(bookObject.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("red");
    deleteButton.innerText = "Hapus Buku";

    deleteButton.addEventListener("click", function () {
      if (!confirm("Yakin menghapus buku?")) {
      } else {
        removeBook(bookObject.id);
      }
    });

    const action = document.createElement("div");
    action.classList.add("action");
    action.append(sudahBacaButton, deleteButton);

    container.append(action);
  }

  return container;
}

function addBookToUncompleted(bookID) {
  const bookTarget = findBook(bookID);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function addBookToCompleted(bookID) {
  const bookTarget = findBook(bookID);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBook(bookID) {
  for (const bookItem of books) {
    if (bookItem.id == bookID) {
      return bookItem;
    }
  }
  return null;
}

function removeBook(bookID) {
  const bookTarget = findBookIndex(bookID);

  if (bookTarget === -1) {
    return;
  }

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

function findBookIndex(bookID) {
  for (const index in books) {
    if (books[index].id === bookID) {
      return index;
    }
  }

  return -1;
}

const cariBuku = document.getElementById("searchBook");
cariBuku.addEventListener("submit", function (event) {
  event.preventDefault();
  filterBuku();
});

const filterBuku = () => {
  const kataKunci = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();

  const hasilFilter = books.filter(function (book) {
    return book.title.toLowerCase().includes(kataKunci);
  });
  showFilteringBooks(hasilFilter);
};

document.addEventListener(RENDER_EVENT, hasilFilter);

function showFilteringBooks(books) {
  const incompleteBook = document.getElementById("incompleteBookshelfList");
  incompleteBook.innerHTML = "";

  const completeBook = document.getElementById("completeBookshelfList");
  completeBook.innerHTML = "";

  for (const bookItem of books) {
    const bookElement = makeBook(bookItem);
    if (bookItem.isComplete) {
      completeBook.append(bookElement);
    } else {
      incompleteBook.append(bookElement);
    }
  }
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
