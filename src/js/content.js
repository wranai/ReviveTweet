'use strict';
(() => {
const
    request = new XMLHttpRequest();
request.open('GET', location.href, false);
request.send(null);
if (request.status !== 200) return;

const
    support_langs = ['ja', 'en',],
    css_selector_i18n = support_langs.map(lang => `script[src*="/i18n/${lang}."]`).join(','),
    doc = new DOMParser().parseFromString(request.responseText, "text/html"),
    script_i18n = doc.querySelector(css_selector_i18n);
if (! script_i18n) return; // 旧TweetDeck(Cookieのtweetdeck_version=legacy)だと存在しない
request.open('GET', script_i18n.src, false);
request.send(null);
if (request.status !== 200) return;

const
    script_text = [
        ['再投稿', 'リツイート'],
        ['投稿', 'ツイート'],
        ['Repost', (m) => m.charAt(0) + 'etweet'],
        ['Post', (m) => (m.charAt(0) == 'P' ? 'T' : 't') + 'weet'],
        ['XPro', 'TweetDeck' ],
        ['"(青|Blue)"', '"Twitter Blue"'],
        [/([" 、。]|[々〇〻\u3400-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF]|[\u3041-\u3096]|[\u30A1-\u30FA])X([" .、。]|[々〇〻\u3400-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF]|[\u3041-\u3096]|[\u30A1-\u30FA])/, '$1Twitter$2', 'g'],
    ].reduce((acc, conf) => {
        return acc.replace(new RegExp(conf[0], conf[2] ?? 'gi'), conf[1]);
    }, request.responseText),
    observer = new MutationObserver((records) => {
        stop_observe();
        const
            target_script = document.querySelector(css_selector_i18n);
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
