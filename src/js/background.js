'use strict';
(async (chrome) => {
const
    net_request_rules = [
        { // i18nスクリプトを拒否(※別に取得し、文字列を置換してから実行)
            "id": 1,
            "priority": 1,
            "action": {
                "type": "block" // [覚書] "block"の場合、manifest.jsonの"host_permissions"に登録が無くても動作する模様
            },
            "condition" : {
                "regexFilter": "^https?://([^.]*\\.)?twimg\\.com/.*?/i18n/..\\.",
                "resourceTypes": [
                    "script"
                ]
            }
        },
        { // CSP設定無効化(TODO: 文字列置換後のスクリプトを実行するためにこれ以外の方法が思いつかない)
            "id": 2,
            "priority": 1,
            "action": {
                "type": "modifyHeaders",
                "responseHeaders": [
                    {
                        "header": "Content-Security-Policy",
                        "operation": "remove" // [覚書] "remove"の場合、manifest.jsonの"host_permissions"に登録が必要
                    }
                ]
            },
            "condition": {
                "regexFilter": "^https?://([^.]*\\.)?(twitter|x)\\.com",
                "resourceTypes":[
                    "main_frame",
                    "sub_frame",
                    "xmlhttprequest"
                ]
            }
        }
    ],
    old_rules = await chrome.declarativeNetRequest.getDynamicRules(),
    old_rule_ids = old_rules.map(rule => rule.id);

await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds : old_rule_ids,
    addRules : net_request_rules,
});

//【覚書】
//  onRuleMatchedDebugイベントはデバッグ時（パッケージされていない拡張機能時）のみ有効
//  参照: https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/#event-onRuleMatchedDebug
if (typeof chrome.declarativeNetRequest?.onRuleMatchedDebug?.addListener == 'function') {
    try {
        chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(function (obj) {
            console.debug('[declarativeNetRequest.onRuleMatchedDebug]', obj.request.url, obj);
        });
    }
    catch (error) {
        console.error(error);
    }
}
})(((typeof browser != 'undefined') && browser.runtime) ? browser : chrome);
