const BASE_URL = 'https://30nama.com'

document.addEventListener('DOMContentLoaded', (event) => {
    addBtns();
});

var controlBar;
function addBtns() {
    controlBar = document.querySelector('.vjs-control-bar');
    chrome.storage.local.get('player', function ({ player }) {
        if (player == null || player != null && player == true) {
            if (controlBar) {
                injectDownloadBtn();
                injectStreamLinkBtn();
            }
        }
    });
}

function createControllerButton() {
    const wrapper = document.createElement('div');
    wrapper.classList.add('vjs-menu-button');
    wrapper.classList.add('vjs-menu-button-popup');
    wrapper.classList.add('vjs-control');
    wrapper.classList.add('vjs-button');

    const space = document.querySelector('.vjs-custom-control-spacer.vjs-spacer');
    controlBar.insertBefore(wrapper, space.nextSibling);

    wrapper.addEventListener('mouseenter', function () {
        wrapper.classList.add('vjs-hover');
    });

    wrapper.addEventListener('mouseleave', function () {
        wrapper.classList.remove('vjs-hover');
    });

    return wrapper;
}

function createButton(parent, icon) {
    const downloadBtn = document.createElement('button');
    downloadBtn.classList.add('vjs-control');
    downloadBtn.classList.add('vjs-button');
    downloadBtn.innerHTML = icon;
    parent.appendChild(downloadBtn);

    return downloadBtn;
}

function createMenu(parent, itemWidth) {

    // menu
    const menu = document.createElement('div');
    menu.classList.add('vjs-menu');
    parent.appendChild(menu);

    // content menu
    const menuContent = document.createElement('ul');
    menuContent.classList.add('vjs-menu-content');
    menuContent.setAttribute('role', 'menu');
    menuContent.style.width = itemWidth ? itemWidth : '12em';

    menu.appendChild(menuContent);


    function addItem(props, onClick) {
        const item = document.createElement('li');
        item.classList.add('vjs-menu-item');
        if (props.link) {
            item.innerHTML = `<a style='text-decoration: none' href='${props.link}' ${props.filename ? `download='${props.filename}'` : ''}>${props.text}</a>`;
        } else {
            item.innerHTML = `<span>${props.text}</span>`
        }

        item.onclick = onClick;
        menuContent.appendChild(item);

        return item;
    }

    return { addItem, menu };
}

function injectDownloadBtn() {

    const subLinks = getSubtitleLinks();

    if (!subLinks)
        return;

    const wrapper = createControllerButton();

    createButton(wrapper, `<svg width="36" height="36" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>`);

    const menu = createMenu(wrapper, '15em');

    if (subLinks.fa){
        menu.addItem({
            text: 'دانلود زیرنویس فارسی',
            link: subLinks.fa,
            filename: `${subLinks.filename}_fa.srt`
        });
    }

    menu.addItem({
        text: 'دانلود زیرنویس انگلیسی',
        link: subLinks.en,
        filename: `${subLinks.filename}_en.srt`
    });

}



function getSubtitleLinks() {
    const scripts = document.getElementsByTagName('script');
    for (const script of scripts) {

        const faLink = script.innerText.match(/"persian":"(.*?)"/);
        const enLink = script.innerText.match(/"english":"(.*?)"/);

        if (!faLink && !enLink) {
            continue;
        }
        
        const faSub = faLink && `${BASE_URL}${faLink[1]}`
        const enSub = enLink && `${BASE_URL}${enLink[1]}`

        let fileName = script.innerText.match(/\/(.*)_(fa|en)\.srt/)[1];
        fileName = fileName.split('/');
        fileName = fileName[fileName.length - 1];

        if (enSub) {
            return {
                fa: faSub,
                en: enSub,
                filename: fileName
            }
        }
    }
}


function injectStreamLinkBtn() {
    const wrapper = createControllerButton();

    createButton(wrapper, `<svg width="34" height="34" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>`);

    const menu = createMenu(wrapper);

    getStreamLinks().then(streamLinks => {
        streamLinks.forEach(link => {
            menu.addItem({ text: link.label === 'خودکار' ? `لینک استریم ${link.label}` : `${link.label} لینک استریم` }, () => {
                copyTextToClipboard(link.src);
            });
        });
    });

}


async function getStreamLinks() {
    const scripts = document.getElementsByTagName('script');
    for (const script of scripts) {

        let autoQualityStream = script.innerText.match(/src":"(.*\.m3u8)","label":"خودکار"/);

        if (!autoQualityStream) {
            continue;
        }
        autoQualityStream = autoQualityStream[1];
        const baseLink = autoQualityStream.replace(/([^\/]+$)/, '');

        const result = [{ src: autoQualityStream, label: 'خودکار' }];

        let response = await fetch(autoQualityStream);
        response = await response.text();

        const links = response.match(/(.*\.m3u8)/g);

        links.reverse().forEach(link => {
            result.push({
                src: `${baseLink}${link}`,
                label: link.match(/(.*?)[\.\/]/)[1]
            });
        });


        return result;

    }
}


function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(() => {
        createToastMessage('با موفقیت کپی شد', 'green');

    }).catch(err => {
        createToastMessage('متاسفانه مشکلی رخ داده است', 'red');
    });
}

function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;


    textArea.style.width = '2em';
    textArea.style.height = '2em';

    textArea.style.padding = 0;

    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';

    textArea.style.background = 'transparent';

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        createToastMessage('با موفقیت کپی شد', 'green');

    } catch (err) {
        createToastMessage('متاسفانه مشکلی رخ داده است', 'red');

    }

    document.body.removeChild(textArea);
}

function createToastMessage(text, color) {
    const container = document.createElement('div');
    container.classList.add('ca-toast-msg-container');

    const toastMsg = document.createElement('div');
    toastMsg.classList.add('ca-toast-msg');
    toastMsg.classList.add('ca-zoom-in');
    toastMsg.classList.add(`ca-${color}`);
    toastMsg.innerText = text;

    container.appendChild(toastMsg);

    document.body.appendChild(container);

    setTimeout(() => {
        toastMsg.classList.add('ca-zoom-out');
        setTimeout(() => {
            document.body.removeChild(container);
        }, 500);
    }, 2000);
}