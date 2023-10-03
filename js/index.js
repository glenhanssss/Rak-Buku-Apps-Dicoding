(() => {
    let books = [];

    // Event listener untuk menambahkan buku
    function add(event) {
        event.preventDefault();

        const titleInput = document.querySelector("#inputBookTitle");
        const authorInput = document.querySelector("#inputBookAuthor");
        const yearInput = document.querySelector("#inputBookYear");
        const isCompleteInput = document.querySelector("#inputBookIsComplete");

        const newBook = {
            id: +new Date(),
            title: titleInput.value,
            author: authorInput.value,
            year: yearInput.value,
            isComplete: isCompleteInput.checked,
        };

        books.push(newBook);

        console.log(newBook);
        document.dispatchEvent(new Event("bookChanged"));
    }

    // Event listener untuk mencari buku
    function search(event) {
        event.preventDefault();

        const searchInput = document.querySelector("#searchBookTitle");
        const query = searchInput.value.toLowerCase();

        if (query) {
            const filteredBooks = books.filter((book) =>
                book.title.toLowerCase().includes(query)
            );
            renderBooks(filteredBooks);
        } else {
            renderBooks(books);
        }
    }

    // Event listener for marking a book as complete
    function handleMarkAsComplete(event) {
        const bookId = Number(event.target.id);
        const bookIndex = books.findIndex((book) => book.id === bookId);

        if (bookIndex !== -1) {
            books[bookIndex].isComplete = true;
            document.dispatchEvent(new Event("bookChanged"));
        }
    }

    // Event listener for marking a book as incomplete
    function handleMarkAsIncomplete(event) {
        const bookId = Number(event.target.id);
        const bookIndex = books.findIndex((book) => book.id === bookId);

        if (bookIndex !== -1) {
            books[bookIndex].isComplete = false;
            document.dispatchEvent(new Event("bookChanged"));
        }
    }

    // Event listener for deleting a book
    function handleDeleteBook(event) {
        const bookId = Number(event.target.id);
        const bookIndex = books.findIndex((book) => book.id === bookId);

        if (bookIndex !== -1) {
            books.splice(bookIndex, 1);
            document.dispatchEvent(new Event("bookChanged"));
        }
    }

    // Render the list of books
    function renderBooks(bookList) {
        const incompleteBookshelf = document.querySelector("#incompleteBookshelfList");
        const completeBookshelf = document.querySelector("#completeBookshelfList");

        incompleteBookshelf.innerHTML = "";
        completeBookshelf.innerHTML = "";

        for (const book of bookList) {
            const bookCard = document.createElement("article");
            bookCard.classList.add("card");

            const titleHeading = document.createElement("h3");
            titleHeading.classList.add("header-h3");
            titleHeading.innerText = "Judul Buku: " + book.title;

            const authorParagraph = document.createElement("p");
            authorParagraph.classList.add("leading-relaxed");
            authorParagraph.innerText = "Penulis: " + book.author;

            const yearParagraph = document.createElement("p");
            yearParagraph.classList.add("leading-relaxed");
            yearParagraph.innerText = "Tahun: " + book.year;

            bookCard.appendChild(titleHeading);
            bookCard.appendChild(authorParagraph);
            bookCard.appendChild(yearParagraph);

            const actionButtons = document.createElement("div");
            actionButtons.classList.add("mt-3");

            const deleteButton = document.createElement("button");
            deleteButton.id = book.id;
            deleteButton.innerText = "Hapus";
            deleteButton.classList.add("btn-delete");
            deleteButton.addEventListener("click", handleDeleteBook);

            actionButtons.appendChild(deleteButton);

            if (book.isComplete) {
                const markIncompleteButton = document.createElement("button");
                markIncompleteButton.id = book.id;
                markIncompleteButton.innerText = "Belum Selesai dibaca";
                markIncompleteButton.classList.add("btn-warning");
                markIncompleteButton.addEventListener("click", handleMarkAsIncomplete);

                actionButtons.appendChild(markIncompleteButton);
                completeBookshelf.appendChild(bookCard);
            } else {
                const markCompleteButton = document.createElement("button");
                markCompleteButton.id = book.id;
                markCompleteButton.innerText = "Selesai dibaca";
                markCompleteButton.classList.add("btn-done");
                markCompleteButton.addEventListener("click", handleMarkAsComplete);

                actionButtons.appendChild(markCompleteButton);
                incompleteBookshelf.appendChild(bookCard);
            }

            bookCard.appendChild(actionButtons);
        }
    }

    // Save books to local storage and render
    function save() {
        localStorage.setItem("books", JSON.stringify(books));
        renderBooks(books);
    }

    // Initialize the app
    window.addEventListener("load", () => {
        books = JSON.parse(localStorage.getItem("books")) || [];
        renderBooks(books);

        const addBookForm = document.querySelector("#inputBook");
        const searchBookForm = document.querySelector("#searchBook");

        addBookForm.addEventListener("submit", add);
        searchBookForm.addEventListener("submit", search);
        document.addEventListener("bookChanged", save);
    });
})();
