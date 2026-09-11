
const API_URL = "https://news-api-proxy.jharjeet95.workers.dev";

window.addEventListener("load", () => {
    fetchNews("india");
});

function reload() {
    window.location.reload();
}
// ========================================
// LOADING SPINNER
// ========================================

function showLoading() {
    const spinner = document.getElementById("loading-spinner");

    if (spinner) {
        spinner.classList.add("show");
    }
}

function hideLoading() {
    const spinner = document.getElementById("loading-spinner");

    if (spinner) {
        spinner.classList.remove("show");
    }
}
async function fetchNews(query) {

    query = query.trim();

    if (!query) {
        return;
    }

    // Show spinner
    showLoading();

    try {

        const res = await fetch(
            `${API_URL}?q=${encodeURIComponent(query)}`
        );

        const data = await res.json();

        if (!res.ok) {

            console.error("API Error:", data);

            showError(
                data.message || "Unable to load news right now."
            );

            return;
        }

        if (data.status !== "ok") {

            console.error("NewsAPI Error:", data);

            showError(
                data.message || "Unable to load news."
            );

            return;
        }

        bindData(data.articles || []);

    } catch (error) {

        console.error("Fetch Error:", error);

        showError(
            "Something went wrong. Please check your internet connection."
        );

    } finally {

        // Hide spinner whether success or error
        hideLoading();

    }
}


// ========================================
// DISPLAY NEWS CARDS
// ========================================

function bindData(articles) {

    const cardsContainer =
        document.getElementById("cards-container");

    const newsCardTemplate =
        document.getElementById("template-news-card");


    cardsContainer.innerHTML = "";


    if (!articles || articles.length === 0) {

        cardsContainer.innerHTML = `
            <p class="no-news">
                No news found.
            </p>
        `;

        return;
    }


    articles.forEach((article) => {

        // Skip articles without image
        if (!article.urlToImage) {
            return;
        }


        const cardClone =
            newsCardTemplate.content.cloneNode(true);


        fillData(cardClone, article);


        cardsContainer.appendChild(cardClone);

    });
}


// ========================================
// FILL NEWS CARD
// ========================================

function fillData(cardClone, article) {

    const newsImg =
        cardClone.querySelector("#news-img");

    const newsTitle =
        cardClone.querySelector("#news-title");

    const newsSource =
        cardClone.querySelector("#news-source");

    const newsDesc =
        cardClone.querySelector("#news-desc");


    // ------------------------------------
    // IMAGE
    // ------------------------------------

    newsImg.src = article.urlToImage;

    newsImg.alt =
        article.title || "News article image";


    // ------------------------------------
    // TITLE
    // ------------------------------------

    newsTitle.textContent =
        article.title || "Untitled News";


    // ------------------------------------
    // DESCRIPTION
    // ------------------------------------

    newsDesc.textContent =
        article.description || "Read the full story.";


    // ------------------------------------
    // SOURCE + DATE
    // ------------------------------------

    let date = "Date unavailable";


    if (article.publishedAt) {

        date = new Date(
            article.publishedAt
        ).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata"
        });

    }


    const sourceName =
        article.source?.name || "Unknown Source";


    newsSource.textContent =
        `${sourceName} : ${date}`;


    // ------------------------------------
    // OPEN ARTICLE
    // ------------------------------------

    const card =
        cardClone.firstElementChild;


    if (article.url) {

        card.style.cursor = "pointer";


        card.addEventListener("click", () => {

            window.open(
                article.url,
                "_blank",
                "noopener,noreferrer"
            );

        });

    }
}


// ========================================
// SHOW ERROR
// ========================================

function showError(message) {

    const cardsContainer =
        document.getElementById("cards-container");


    cardsContainer.innerHTML = `
        <div class="news-error">
            <h3>Oops!</h3>
            <p>${message}</p>
        </div>
    `;
}


// ========================================
// NAVIGATION
// ========================================

let currentSelectedNav = null;


function onNavClick(id) {

    // Fetch selected category
    fetchNews(id);


    // Find selected navigation item
    const navItem =
        document.getElementById(id);


    if (!navItem) {
        return;
    }


    // Remove previous active class
    currentSelectedNav?.classList.remove("active");


    // Set new active item
    currentSelectedNav = navItem;


    currentSelectedNav.classList.add("active");
}


// ========================================
// SEARCH
// ========================================

const searchBtn =
    document.getElementById("searchBtn");


const searchText =
    document.getElementById("newsInput");


searchBtn.addEventListener("click", () => {

    const query =
        searchText.value.trim();


    if (!query) {
        return;
    }


    fetchNews(query);


    // Remove active category
    currentSelectedNav?.classList.remove("active");

});


// ========================================
// SEARCH WITH ENTER KEY
// ========================================

searchText.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        searchBtn.click();

    }

});


// ========================================
// MOBILE MENU
// ========================================

const menuToggle =
    document.getElementById("menu-toggle");


const navLinks =
    document.getElementById("nav-links");


// Toggle menu
menuToggle.addEventListener("click", () => {

    const isOpen =
        navLinks.classList.toggle("open");


    menuToggle.classList.toggle(
        "is-active",
        isOpen
    );


    menuToggle.setAttribute(
        "aria-expanded",
        isOpen
    );

});


// ========================================
// CLOSE MOBILE MENU AFTER NAVIGATION
// ========================================

const originalOnNavClick =
    onNavClick;


onNavClick = function (id) {

    originalOnNavClick(id);


    if (navLinks.classList.contains("open")) {

        menuToggle.classList.remove(
            "is-active"
        );


        navLinks.classList.remove(
            "open"
        );


        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

    }

};