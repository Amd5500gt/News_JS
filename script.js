const API_KEY = "f493b7506ac149319730412d416f4e08"
const url = "https://newsapi.org/v2/everything?q="
window.addEventListener('load', () =>fetchNews("india"));


function reload(){
    window.location.reload();
}

async function fetchNews(query){
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}`)
    const data = await res.json();
    bindData(data.articles)
}

function bindData(articles){
 const cardsContainer = document.getElementById("cards-container");
 const newsCardTemplate = document.getElementById("template-news-card");

 cardsContainer.innerHTML = '';
 
 articles.forEach((article) =>{
    if(!article.urlToImage) return;
    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillData(cardClone,article);
    cardsContainer.appendChild(cardClone);
 })
}
 function fillData(cardClone,article){
    const newsImg = cardClone.querySelector('#news-img')
    const newsTitle = cardClone.querySelector('#news-title')
    const newsSource= cardClone.querySelector('#news-source')
    const newsDesc = cardClone.querySelector('#news-desc')

    newsImg.src  = article.urlToImage;
    newsTitle.innerHTML = article.title;

    newsDesc.innerHTML = article.description;

    const date = new Date(article.publishedAt).toLocaleString("en-US",{
        timeZone:"Asia/Kolkata"
    })
     newsSource.innerHTML = `${article.source.name} : ${date}`;
     cardClone.firstElementChild.addEventListener("click",()=>{
        window.open(article.url,"_blank")
     })
 }
 let currentSelectedNav = null;
 function onNavClick(id){
   fetchNews(id);
   const navItem = document.getElementById(id)
   currentSelectedNav?.classList.remove("active")
   currentSelectedNav = navItem;
   currentSelectedNav.classList.add("active")
 }

 const searchBtn = document.getElementById("searchBtn")
 const searchText = document.getElementById("newsInput")
 searchBtn.addEventListener("click",()=>{
    const query = searchText.value;
    if(!query) return;
    fetchNews(query);
    currentSelectedNav?.classList.remove('active')
 })

 const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

// Toggle menu on click
menuToggle.addEventListener("click", () => {
    menuToggle.classList.toggle("is-active");
    navLinks.classList.toggle("open");
});

// Automatically close the menu drawer after selecting a topic channel
const originalOnNavClick = onNavClick; 
onNavClick = function(id) {
    originalOnNavClick(id); // Execute your standard nav function logic
    
    // Close the drawer safely if it's currently open on mobile view
    if (navLinks.classList.contains("open")) {
        menuToggle.classList.remove("is-active");
        navLinks.classList.remove("open");
    }
};