chrome.storage.local.get('imdb', function({imdb}){
    const URL = location.href;

    if (imdb == null || imdb != null && imdb == true){
        
        if (URL.includes("imdb.com/title/")){
            const imdbID = URL.match('imdb.com/title/tt(\\d+)')[1];
            const link30nama = `https://30nama.com/movies/${imdbID}.html`;

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
        else{
            // For imdb.com/list/...
            let elements_query = ".lister-item.mode-detail";
            let imdb_query = "div:nth-child(1) h3";

            // For imdb.com/chart/...
            if (URL.includes("imdb.com/chart/")){
                elements_query = "tbody tr";
                imdb_query = "td[class=titleColumn]";
            }
            
            Array.from(document.querySelectorAll(elements_query)).forEach(element => {

                const imdbID = element.querySelector(`${imdb_query} a`).href.match('imdb.com/title/tt(\\d+)')[1];
                const link30nama = `https://30nama.com/movies/${imdbID}.html`;
                
                const link = document.createElement('a');
                link.innerText = " | "
                link.href = link30nama;

                const cnama = document.createElement('span');
                cnama.style = "color:red;";
                cnama.innerText = "30nama";
                
                link.appendChild(cnama);

                if (URL.includes("imdb.com/chart/boxoffice") || URL.includes("imdb.com/list/"))
                    element.querySelector(imdb_query).appendChild(link);
                else
                    element.querySelector(`${imdb_query} span`).appendChild(link);
  
            });

        }
    }
});