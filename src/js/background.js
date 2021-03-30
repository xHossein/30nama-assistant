['imdb', 'download_links', 'player'].forEach(id => {
    const checkbox = document.querySelector(`#${id} input`);
    if (checkbox != null) {
        checkbox.addEventListener('change', function (e) {
            chrome.storage.local.set({ [id]: this.checked });
        });
    }
});