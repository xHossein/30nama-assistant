const imdbID = location.href.match('imdb.com/title/tt(\\d+)')[1];
const link30nama = `https://30nama.com/movies/${imdbID}.html`;

chrome.storage.local.get('imdb', function({imdb}){
    
    if (imdb == null || imdb != null && imdb == true){
        // img
        const floatingButton = document.createElement('img');
        floatingButton.src = chrome.extension.getURL('/src/img/float-icon.png');
        floatingButton.width = 80;
        floatingButton.height = 80;
        
        // link
        const link = document.createElement('a');
        link.href = link30nama;
        link.appendChild(floatingButton);
        
        // container
        const container = document.createElement('div');
        container.classList.add('cnama-floating-btn');
        container.appendChild(link);
        
        document.body.appendChild(container);
    }
});