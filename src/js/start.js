(() => {
'use strict';
const
    script = document.createElement('script');
script.async = false;
script.src = chrome.runtime.getURL('js/content.js');
document.documentElement.insertBefore(script, document.documentElement.firstChild);
script.remove();
})();
