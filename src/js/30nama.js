const FILTERED = /(https*:\/\/.*?)\//g;
const NON_FILTERED = 'https://176.9.2.39/';

const queries = [
    ".fdl", // For Movies
    ".dl-series a:not(.series-sub):not(#series-sub)", // For Series [single episode]
    ".all_links", // For Series (Show all links)
];

chrome.storage.local.get('download_links', function ({ download_links }) {

    if (download_links == null || download_links != null && download_links == true) {

        queries.forEach((query) => {
            Array.from(document.querySelectorAll(query)).forEach((element) => {
                if (element.tagName.toLowerCase() === "a")
                    element.href = element.href.replace(FILTERED, NON_FILTERED)
                else
                    element.value = element.value.replaceAll(FILTERED, NON_FILTERED)
            });
        });
    }
});

