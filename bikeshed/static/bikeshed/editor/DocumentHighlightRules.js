var TextHighlightRules = ace.require("ace/mode/text_highlight_rules").TextHighlightRules;


export class DocumentHighlightRules extends TextHighlightRules {
    constructor(){
        var keywordMapper = this.createKeywordMapper({
            "variable.language": "this",
            "keyword": "Type Project Assigned-To Status",
            "constant.language": "TRUE FALSE NULL SPACE",
            "support.type": "c n i p f d t x string xstring decfloat16 decfloat34",
            "keyword.operator": ""
        }, "text", true, " ");

        this.$rules = {
            "start" : [
                {token: "headsep", next: 'body', regex: /^\s*$/},
                {token : keywordMapper, regex : "\\b[\\w-_]+\\b"},
                {token : "string", regex: '"', next: "string"},
                {token : "string", regex: "'", next: "qstring"},
                {token : "doc.comment", regex : /^\*.+/},
                {token : "comment",  regex : /#.*$/},
                {token : "keyword.operator", regex: /,/},
                {token : "constant.numeric", regex: "[+-]?\\d+\\b"},
                {token : "variable.parameter", regex : /\w+-\w+(?:-\w+)*/}, 
                {token: "variable.parameter", regex: '#\\d+'},
                {token: "variable.parameter", regex: '@\\w+'},
                {caseInsensitive: true}
            ],
            "body": [
                {token: "variable.parameter", regex: '#\\d+'},
                {token: "variable.parameter", regex: '@\\w+'}
            ],
            "qstring" : [
                {token : "constant.language.escape",   regex : "''"},
                {token : "string", regex : "'",     next  : "start"},
                {defaultToken : "string"}
            ],
            "string" : [
                {token : "constant.language.escape",   regex : '""'},
                {token : "string", regex : '"',     next  : "start"},
                {defaultToken : "string"}
            ]
        }
    }
}

