'use strict';
((chrome) => {
const
    content_script = document.createElement('script');
content_script.async = false;
content_script.src = chrome.runtime.getURL('js/content.js');
document.documentElement.insertBefore(content_script, document.documentElement.firstChild);
content_script.remove();
})(((typeof browser != 'undefined') && browser.runtime) ? browser : chrome);
