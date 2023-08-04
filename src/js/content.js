'use strict';
(async () => {
//【覚書】
// i18nスクリプトを取得するまでの処理を、当初は‎実行順が気になったのでXMLHttpRequestを用いて同期的に実行していた→どうやら非同期でも問題ない模様
const
    support_langs = ['ja', 'en',],
    css_selector_i18n = support_langs.map(lang => `script[src*="/i18n/${lang}."]`).join(','),
    doc = await fetch(location.href).then(response => {
        if (! response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }
        return response.text();
    }).then(html => new DOMParser().parseFromString(html, "text/html")).catch(error => console.error(error));
if (! doc) return;

const
    script_i18n = doc.querySelector(css_selector_i18n);
if (! script_i18n) return; // 旧TweetDeck(Cookieのtweetdeck_version=legacy)だと存在しない

const
    original_script_text = await fetch(script_i18n.src).then(response => {
        if (! response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }
        return response.text();
    }).catch(error => console.error(error));
if (! original_script_text) return;

const
    script_text = [
        ['再投稿', 'リツイート'],
        ['投稿', 'ツイート'],
        ['Repost', (m) => m.charAt(0) + 'etweet'],
        ['Post', (m) => (m.charAt(0) == 'P' ? 'T' : 't') + 'weet'],
        ['XPro', 'TweetDeck' ],
        ['"(青|Blue)"', '"Twitter Blue"'],
        [/([" 、。]|[々〇〻\u3400-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF]|[\u3041-\u3096]|[\u30A1-\u30FA])X([" .、。]|[々〇〻\u3400-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF]|[\u3041-\u3096]|[\u30A1-\u30FA])/, '$1Twitter$2', 'g'],
    ].reduce((acc_script_text, conf) => {
        return acc_script_text.replace(new RegExp(conf[0], conf[2] ?? 'gi'), conf[1]);
    }, original_script_text);
    
await new Promise((resolve, reject) => {
    const
        final_decision = () => {
            if (document.querySelector(css_selector_i18n)) {
                resolve();
                return true;
            }
            return false;
        },
        observer = new MutationObserver((records) => {
            stop_observe();
            if (final_decision()) return;
            start_observe();
        }),
        start_observe = () => observer.observe(document.documentElement, {childList: true, subtree: true}),
        stop_observe = () => observer.disconnect();
    
    if (final_decision()) return;
    start_observe();
});

(new Function(script_text))(); // self.webpackChunk_twitter_responsive_web(配列)が更新される
//【TODO】
//  SCRIPT要素にしろFunction()にしろ、CSPにより制限されているためそのままだと動作しない
//  ※manifest.json内でのcontent_security_policyではscript-srcの'unsafe-inline'や'unsafe-eval'は設定不可
//  ※sandboxな隠しiframeを埋め込んでそこで実行した場合にはCSPにかからないようにできるが、最終的な結果のオブジェクトに関数が含まれるため、postMessage()による受け渡しは不可
//        > Uncaught DOMException: Failed to execute 'postMessage' on 'Window': <Object> could not be cloned.
// →現状、declarativeNetRequestによりresponseHeadersのContent-Security-Policyをremoveする方法しか思いつかない
})();
