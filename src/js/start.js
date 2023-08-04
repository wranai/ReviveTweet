'use strict';
((chrome) => {
const
    content_script = document.createElement('script');
content_script.async = false;
content_script.src = chrome.runtime.getURL('js/content.js');
document.documentElement.insertBefore(content_script, document.documentElement.firstChild);
content_script.remove();

const
    reg_post = /(?:ポスト|post)/gi,
    replace_map = {
        "ポスト": "ツイート",
        "post": "tweet",
    },
    replace_words = () => {
        [...document.querySelectorAll('[data-testid="pillLabel"] span')]
        .filter(span => reg_post.test(span.textContent))
        .map(span => span.textContent = span.textContent.replace(reg_post, (m) => replace_map[m.toLowerCase()] ?? m));
    },
    observer = new MutationObserver((records) => {
        stop_observe();
        replace_words();
        start_observe();
    }),
    start_observe = () => observer.observe(document.documentElement, {childList: true, subtree: true}),
    stop_observe = () => observer.disconnect();
replace_words();
start_observe();
})(((typeof browser != 'undefined') && browser.runtime) ? browser : chrome);
