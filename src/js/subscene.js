const URL = location.href;
chrome.storage.local.get('subscene', function({subscene}){

    if (subscene == null || subscene != null && subscene == true){
        
        if(URL.includes("subscene.com/subtitles/")){

            const cnamalink = create30namaLink(document.querySelector('.imdb').href)
            if(URL.match(/\d+\/?$/)){
                const parent = document.querySelector('h1')
                parent.insertBefore(create30namaText(cnamalink), parent.firstElementChild.nextSibling);
            }else{
                const parent = document.querySelector('.header h2')
                parent.insertBefore(create30namaText(cnamalink), parent.firstElementChild);
            }
        
        }
        else if(URL.endsWith("subscene.com/")){

            Array.from(document.querySelectorAll('.title')).forEach(element => {
                const cnamalink = create30namaLink(element.querySelector('.imdb').href)
                element.insertBefore(create30namaText(cnamalink), element.firstElementChild.nextSibling);
            });
        }
    }
});

function create30namaLink(URL) {
    const imdbID = URL.match('imdb.com/title/tt(\\d+)')[1];
    return `https://30nama.com/movies/${imdbID}.html/`;
};

function create30namaText(link30nama) {
    const link = document.createElement('a');
    link.href = link30nama;
    link.className = "imdb";
    link.innerText = " 30nama ";
    link.target = "_blank"
    
    return link;
};