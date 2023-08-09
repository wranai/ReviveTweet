/*
// i18n対応用スクリプト上のキーワードを置換した上で適用
*/
'use strict';
(async () => {
// ■オリジナルのi18nスクリプト内容を取得
// [覚書] i18nスクリプトを取得するまでの処理を、当初は‎実行順が気になったのでXMLHttpRequestを用いて同期的に実行していた→どうやら非同期でも問題ない模様
const
    support_langs = ['ja', 'en',],
    i18n_script_selector = support_langs.map(lang => `script[src*="/i18n/${lang}."]`).join(','),
    doc = await fetch(location.href).then(response => {
        if (! response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }
        return response.text();
    }).then(html => new DOMParser().parseFromString(html, "text/html")).catch(error => console.error(error));
if (! doc) return;

const
    i18n_script = doc.querySelector(i18n_script_selector);
if (! i18n_script) return; // 旧TweetDeck(Cookieのtweetdeck_version=legacy)だと存在しない

const
    original_script_text = await fetch(i18n_script.src).then(response => {
        if (! response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }
        return response.text();
    }).catch(error => console.error(error));
if (! original_script_text) return;

// ■スクリプト上のキーワードを置換
const
    patched_script_text = [
        ['再投稿', 'リツイート'],
        ['投稿', 'ツイート'],
        ['ポスト', 'ツイート'],
        ['Repost', (m) => m.charAt(0) + 'etweet'],
        ['Post', (m) => (m.charAt(0) == 'P' ? 'T' : 't') + 'weet'],
        ['XPro', 'TweetDeck' ],
        ['"(青|Blue)"', '"Twitter Blue"'],
        ['Premium', 'Twitter Blue', 'g'],
        [/([" 、。]|[々〇〻\u3400-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF]|[\u3041-\u3096]|[\u30A1-\u30FA])X([" .、。]|[々〇〻\u3400-\u9FFF\uF900-\uFAFF]|[\uD840-\uD87F][\uDC00-\uDFFF]|[\u3041-\u3096]|[\u30A1-\u30FA])/, '$1Twitter$2', 'g'],
    ].reduce((acc_script_text, conf) => {
        return acc_script_text.replace(new RegExp(conf[0], conf[2] ?? 'gi'), conf[1]);
    }, original_script_text);
    
await new Promise((resolve, reject) => {
    const
        final_decision = () => {
            if (document.querySelector(i18n_script_selector)) {
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

// ■置換後のスクリプトを適用
(new Function(patched_script_text))();
// ※これでself.webpackChunk_twitter_responsive_web(配列)上にi18n関連処理が追加される模様

//【未解決な問題】
//  SCRIPT要素にしろFunction()にしろ、CSPにより制限されているためそのままだと動作しない
//
//  - manifest.json内でのcontent_security_policyではscript-srcの'unsafe-inline'や'unsafe-eval'は設定不可
//  - sandboxな隠しiframeを埋め込んでそこで実行した場合にはCSPにかからないようにできるが、最終的な結果のオブジェクトに関数が含まれるため、postMessage()による受け渡しは不可
//    > Uncaught DOMException: Failed to execute 'postMessage' on 'Window': <Object> could not be cloned.
//  - webRequest.onCompletedで監視してページのHTTP Responseヘッダ(Content-Security-Policy)よりnonceを取得することも考えたが、details.type="main_frame"のものはほぼ捉えられない（ページをスーパーリロード(Ctrl+F5)した場合には捉えられるため、おそらくキャッシュ絡み）
//
// →現状、declarativeNetRequestによりresponseHeadersのContent-Security-Policyをremoveする実装方法しか思いつかない
})();
