(() => {
'use strict';
const
    request = new XMLHttpRequest();
request.open('GET', location.href, false);
request.send(null);
if (request.status !== 200) return;

const
    doc = new DOMParser().parseFromString(request.responseText, "text/html"),
    script_i18n_ja = doc.querySelector('script[src*="/i18n/ja"]');
if (! script_i18n_ja) return; // 旧TweetDeck(Cookieのtweetdeck_version=legacy)だと存在しない
request.open('GET', script_i18n_ja.src, false);
request.send(null);
if (request.status !== 200) return;

const
    script_text = [
        ['再投稿', 'リツイート'],
        ['投稿', 'ツイート'],
        ['[Rr]epost', (m) => m.charAt(0) + 'etweet'],
        ['[Pp]ost', (m) => (m.charAt(0) == 'P' ? 'T' : 't') + 'weet'],
        ['XPro', 'TweetDeck' ],
        [' X ', ' Twitter '],
        ['"青"', '"Twitter Blue"'],
    ].reduce((acc, conf) => {
        return acc.replace(new RegExp(conf[0], 'g'), conf[1]);
    }, request.responseText),
    observer = new MutationObserver((records) => {
        stop_observe();
        const
            target_script = document.querySelector('script[src*="/i18n/ja"]');
        if (! target_script) {
            start_observe();
            return;
        }
        const
            inject_script = document.createElement('script');
        inject_script.setAttribute('type', target_script.getAttribute('type'));
        inject_script.setAttribute('charset', target_script.getAttribute('charset'));
        inject_script.setAttribute('nonce', target_script.getAttribute('nonce'));
        inject_script.async = false;
        inject_script.textContent = script_text;
        target_script.after(inject_script);
    }),
    start_observe = () => observer.observe(document.documentElement, {childList: true, subtree: true}),
    stop_observe = () => observer.disconnect();
start_observe();
})();
