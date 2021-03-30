const URL = location.href;
chrome.storage.local.get('imdb', function({imdb}){

    if (imdb == null || imdb != null && imdb == true){
        
        if (URL.includes("imdb.com/title/")){
            const link30nama = create30namaLink(URL)

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
        else if(URL.includes("imdb.com/chart/")){

            const elements_query = "tbody tr";
            const name_query = "td[class=titleColumn]";

            Array.from(document.querySelectorAll(elements_query)).forEach(element => {

                const cnama = create30namaText(
                                create30namaLink(element.querySelector(`${name_query} a`).href)
                                );

                if (URL.includes("imdb.com/chart/boxoffice"))
                    element.querySelector(name_query).appendChild(cnama);
                else
                    element.querySelector(`${name_query} span`).appendChild(cnama);
  
            });
        }
        else if(URL.includes("imdb.com/list/") || URL.includes("/search/title/")){

            const elements_query = URL.includes("/search/title/") ? ".lister-item.mode-advanced" : ".lister-item.mode-detail";
            const name_query = "div:nth-child(1) h3";

            Array.from(document.querySelectorAll(elements_query)).forEach(element => {

                const cnama = create30namaText(
                                create30namaLink(element.querySelector(`${name_query} a`).href)
                            );

                element.querySelector(name_query).appendChild(cnama);
  
            });
        }
    }
});

function create30namaLink(URL) {
    const imdbID = URL.match('imdb.com/title/tt(\\d+)')[1];
    return `https://30nama.com/movies/${imdbID}.html`;
};

function create30namaText(link30nama) {
    const cnama = document.createElement('span');
    cnama.innerText = " | ";

    const link = document.createElement('a');
    link.href = link30nama;
    link.style = "color:red;";
    link.innerText = "30nama";
    
    cnama.appendChild(link);
    return cnama;
};