let checkbox = document.querySelector("#imdb input");
if (checkbox != null){
    checkbox.addEventListener('change', function() {
        chrome.storage.local.set({'imdb': this.checked});
    });
}

checkbox = document.querySelector("#download_links input");
if (checkbox != null){
    checkbox.addEventListener('change', function() {
        chrome.storage.local.set({'download_links': this.checked});
    });
}