['imdb','download_links'].forEach(element => {
  chrome.storage.local.get(element, function(data){
    const slider = document.querySelector(`#${element} span`);

    let value = (data[element] != null) ? data[element] :  true;
    document.querySelector(`#${element} input`).checked  = value

    setTimeout(() => {
      slider.classList.remove('non_slider');
      slider.classList.add('slider');
    }, 0);
  });
});