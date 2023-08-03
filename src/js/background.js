const
    net_request_rules = [
        {
            "id": 1,
            "priority": 1,
            "action": {
                "type": "modifyHeaders",
                "responseHeaders": [
                    {
                        "header": "Content-Security-Policy",
                        "operation": "remove"
                    }
                ]
            },
            "condition": {
                "urlFilter":"||twitter.com",
                "resourceTypes":[
                    "main_frame",
                    "sub_frame",
                    "xmlhttprequest"
                ]
            }
        },
        {
            "id": 2,
            "priority": 1,
            "action": {
                "type": "block"
            },
            "condition" : {
                "urlFilter": "||twimg.com/*/i18n/ja",
                "resourceTypes" : ["script"],
                //"excludedResourceTypes": ["xmlhttprequest"]
            }
        }
    ];


chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds : net_request_rules.map(rule => rule.id),
    addRules : net_request_rules,
}, () => {
    //【覚書】
    //  onRuleMatchedDebugイベントはデバッグ時（パッケージされていない拡張機能時）のみ有効
    //  参照: https://developer.chrome.com/docs/extensions/reference/declarativeNetRequest/#event-onRuleMatchedDebug
    if ( typeof chrome.declarativeNetRequest?.onRuleMatchedDebug?.addListener == 'function' ) {
        try {
            chrome.declarativeNetRequest.onRuleMatchedDebug.addListener(function (obj) {
                console.debug( '[declarativeNetRequest.onRuleMatchedDebug]', obj.request.url, obj );
            });
        }
        catch ( error ) {
            log_error( error );
        }
    }
});