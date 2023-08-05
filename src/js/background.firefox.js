'use strict';
((browser) => {
const
    reg_i18n_script_url = new RegExp('^https?://([^.]*\\.)?twimg\\.com/.*?/i18n/..\\.');

browser.webRequest.onBeforeRequest.addListener((details) => {
    if (reg_i18n_script_url.test(details.url)) {
        // i18nスクリプトを拒否(※別に取得し、文字列を置換してから実行)
        // [覚書] cancelするためには、manifest.jsonの"permissions"への登録が必要
        return {
            cancel : true
        };
    }
}, {
    urls : [
        '*://*.twimg.com/*',
    ],
    types : [
        'script',
    ]
}, ['blocking']);

browser.webRequest.onHeadersReceived.addListener((details) => {
    const
        // CSPヘッダ無効化(TODO: 文字列置換後のスクリプトを実行するためにこれ以外の方法が思いつかない)
        // [覚書] ヘッダ書き換えの場合、manifest.jsonの"permissions"への登録は不要な模様
        responseHeaders = details.responseHeaders.filter((element) => element.name.toLowerCase() != 'content-security-policy');
    return {
        responseHeaders
    };
}, {
    urls : [
        '*://*.twitter.com/*',
        '*://*.x.com/*',
    ],
    types : [
        'main_frame',
        'sub_frame',
        'xmlhttprequest'
    ]
}, ['blocking', 'responseHeaders']);
})(((typeof browser != 'undefined') && browser.runtime) ? browser : chrome);
