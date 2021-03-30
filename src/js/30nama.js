const FILTERED = 'https://eu.cdn.oneandonly.cloud';
const NON_FILTERED = 'https://176.9.2.39';

chrome.storage.local.get('download_links', function ({ download_links }) {

    if (download_links == null || download_links != null && download_links == true) {

        // For Movies & Series [single episode]
        Array.from(document.links).forEach((link) => {
            if (link.href.startsWith(FILTERED)) {
                link.href = link.href.replace(FILTERED, NON_FILTERED)
            }
        });

        // For Series (Show all links)
        Array.from(document.querySelectorAll(".all_links")).forEach((season) => {
            season.value = season.value.replaceAll(FILTERED, NON_FILTERED)
        });

    }
});

