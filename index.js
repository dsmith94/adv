var game;
var nextButtonVisible = false;


function setStyleSheet(url, filename) {
    var index = 0;
    if (filename === "fonts") {
        index = 1;
    }
    document.getElementsByTagName('head')[index].getElementById('stylesheet').href = url;
}


function lookForBreaks(text) {
    var s = ``;
    var skip = false;
    const m = `&mdash;`;
    const b = `<br>&nbsp;<br>`;
    var text = text + ` `;
    var length = text.length;
    var i = 0;
    while (i < length) {
        if (text[i] === '<') {
            skip = true;
        }
        if (text[i] === '>') {
            skip = false;
        }
        if (text[i] === '~' && text[i + 1] === '~' && skip === false) {
            s = s + b;
            i++;
        }
        else if (text[i] === '-' && text[i + 1] === '-' && skip === false) {
            s = s + m;
            i++;
        }
        else {
            s = s + text[i];
        }
        i++;
    }
    return s;
}


function fixQuotes(str)
{
    var skipQuotes = false;
    var flipQuote = true;
    var s = "";
    var text = lookForBreaks(str);
    var length = text.length;
    for (var i = 0; i < length; i++) {
        if (text[i] === '<') {
            skipQuotes = true;
        }
        if (text[i] === '>') {
            skipQuotes = false;
        }
        if (text[i] === '"' && skipQuotes === false) {
            if (flipQuote) {
                s = s + "“"
                flipQuote = false;
            } else {
                s = s + "”"
                flipQuote = true;
            }
        }
        else if (text[i] === "'" && skipQuotes === false) {
            s = s + "&rsquo;"
        }
        else {
            s = s + text[i];
        }
    }
    return s;
}


function checkIfLetter(char) {
    return (char.toUpperCase() != char.toLowerCase());
}


function handleStringCaps(text) {
    var v = ``;
    var text = text + ` `;
    var length = text.length;
    var i = 0;
    var skip = false;
    var readyToCap = true;
    while (i < length) {
        if (text[i] === '<') {
            skip = true;
        }
        if (text[i] === '>') {
            skip = false;
        }
        if (skip === false) {
            var c = text[i];
            if (c === `.` || c === `!` || c === `?`) {
                if (text[i + 1] !== '"') {
                    readyToCap = true;
                }
                v = v + c;
            }
            else if (readyToCap === true && checkIfLetter(c)) {
                v = v + c.toUpperCase();
                readyToCap = false;
            }
            else {
                v = v + c;
            }
        }
        else {
            v = v + text[i];
        }
        i++;
    }
    return v;
}


function applyEmphasis(text) {
    return `<div class="emphasis">${text}</div>`;
}


function applyDropCaps(text) {
    var firstLetter;
    var remainingText;
    if (text.charAt(0) === "“") {
        firstLetter = text.charAt(0) + text.charAt(1);
        remainingText = text.slice(2);
    }
    else {
        firstLetter = text.charAt(0);
        remainingText = text.slice(1);
    }
    return `<span class="drop">${firstLetter}</span>${remainingText}`;
}


function addNextButton() {
    const e = document.getElementById('Actions');
    if (e && nextButtonVisible === false) {
        game.mode = "normal";
        e.innerHTML += `<p><button type="submit" id="Next-Button" onclick="showRoom();">➞</button></p>`;
        nextButtonVisible = true;
    }
}


function finishSetText(text) {
    const e = document.getElementById("Readout");
    if (e) {
        e.style.animation = 'fadein 0.25s';
        e.innerHTML = fixQuotes(text);
    }
    const h = document.getElementById("Readout").offsetHeight;
    const b = document.getElementById("page-bottom-div");
    if (h < (window.innerHeight * 0.75)) {
        b.innerHTML = `<hr id="Page-bottom" />`;        
    }
    else {
        b.innerHTML = `<br />&nbsp;<br /><hr id="Page-hr" />`;
    }



function finishActionAnimation(e) {
    e.style.opacity = 1;
}


function handleTopic(topic) {
    var d = ``;
    var npcs = [];
    var things = game.currentRoom.contains;
    if (things) {
        for (t of things) {
            if (typeof t.states !== "undefined") {
                npcs.push(t);
            }
        }
    }
    npcs.sort(function(a, b) { return a.priority - b.priority; });
    for (n of npcs) {
        n.currentTopic = topic;
        var s = n.getState();
        if (s) {
            var t = s.topics.get(topic);
            if (typeof t === "string") {
               d = d + t;
            }
            else if (typeof t === "function") {
                var f = t(s, n);
                if (f) {
                    d = d + f;
                }
            }
        }
        n.currentTopic = '';
    }
    addDisplayMessage(d);
    showRoom();
}


function beginConversation(npc) {
    var t = getThing(npc);
    if (t) {
        t.currentTopic = '';
        var s = t.getState();
        if (s) {
            game.currentNPCConversing = npc;
            var c = s.hello(s, t);
            if (c) {
                addDisplayMessage(c);
            }
        }
    }
}


function endConversation() {
    var n = game.currentNPCConversing;
    var t = getThing(n);
    if (t) {
        var s = t.getState();
        if (s) {
            var c = s.bye(s, t);
            if (c) {
                addDisplayMessage(c);
            }
        }
    }
    game.currentNPCConversing = '';
}


function clearActionsPane()
{
    const e = document.getElementById('Actions');
    if (e) {
        e.innerHTML = ``;
    }
    nextButtonVisible = false;
}


function showRoom() {
    var d = ``;
    game.turns += 1;
    game.currentRoom.turns += 1;
    if (game.messages.length > 0) {
        d = game.messages.pop();
        addNextButton();
    }
    else if (game.currentNPCConversing) {
        var n = game.currentNPCConversing;
        var t = getThing(n);
        if (t) {
            var s = t.getState();
            if (s) {
                var c = s.conversation(s, t);
                if (c) {
                    d = d + c;
                    clearActionsPane();
                }
            }
        }
    }
    else {
        d = game.currentRoom.display();
        clearActionsPane();
    }
    for (e of game.environmentalMessages) {
        d = d + ` <p> ` + e + `</p>`;
    }
    game.environmentalMessages = [];
    if (game.currentRoom.environmentalEffects.length) {
        if (!rng(5) && game.mode === "normal") {
            d = d + ` <p> ` + randomText(game.currentRoom.environmentalEffects) + `</p>`;
        }
    }
    var things = game.currentRoom.contains;
    if (things) {
        for (var thing of things) {
            if (typeof thing.id !== "undefined") {
                while (d.indexOf(`$${thing.id}`) > -1) {
                    var x = d.indexOf(`$${thing.id}`);
                    var len = thing.id.length;
                    d = d.slice(0, x) +
                    `<a href="javascript:void(0);" onclick="handleThingFocus('${thing.id}');">${thing.desc()}</a>` +
                    d.slice(x + len + 1, d.length);
                }
            }
            if (typeof thing.states !== 'undefined') {
                var state = thing.getState();
                if (state) {
                    var topics = state.topics.keys();
                    if (topics) {
                        for (var topic of topics) {
                            while (d.indexOf(`@${topic}`) > -1) {
                                var x = d.indexOf(`@${topic}`);
                                var len = topic.length;
                                d = d.slice(0, x) +
                                `<a href="javascript:void(0);" onclick="handleTopic('${topic}');">${topic}</a>` +
                                d.slice(x + len + 1, d.length);
                            }
                        }
                    }
                }
            }
        }
    }
    setText(d);
}


function getThing(id) {
    var things = game.currentRoom.contains;
    if (things) {
        for (t of things) {
            if (t.id === id) {
                return t;
            }
        }
    }
    return null;
}


function setText(text) {
    const e = document.getElementById("Readout");
    const a = document.getElementById("Actions");
    const b = document.getElementById("page-bottom-div");
    if (e) {
        var t = handleStringCaps(text);
        e.style.animation = 'fadeout 0.25s';
        window.setTimeout(function() { finishSetText(t); }, 250);
    }
    if (a) {
        a.style.opacity = 0;
        window.setTimeout(function() { finishActionAnimation(a); }, 505);
    }
    var h = document.getElementById("Readout").offsetHeight;
    if (h < (window.innerHeight - 100)) {
        b.innerHTML = `<hr id="Page-bottom" />`;        
    }
    else {
        b.innerHTML = `<hr id="Page-hr" />`;
    }
}


function buildActionsHTML(id, actions) {
    var r = ``;
    const openTag = `<a href="javascript:void(0);" onclick="handleThingAction(`;
    const closeTag = `</a>`;
    var thing = game.currentRoom.getThingById(id);
    if (id && actions && thing) {
        if (actions.length === 0) {
            return ``;
        }
        const len = actions.length - 1;
        r = `<p> [${game.playerNoun} can `;
        if (actions.constructor.name === "Array") {
            var i = 0;
            for (const a of actions) {
                const t = `${openTag}'${id}', '${a.executeFunction}');">${a.desc()}${closeTag}`;
                if (i === 0) {
                    r = r + `${t}`;
                    if (i === len) {
                        r = r + ` ${thing.articleDesc()}.] `;
                    }
                }
                else if (i === len) {
                    r = r + ` or ${t} ${thing.articleDesc()}.] `;
                }
                else {
                    r = r + `, ${t}`;
                }
                i++;
            }
        }
    }
    else {
        `Error: failed to build actions list.`
    }
    return handleStringCaps(r);
}


function handleThingFocus(str)
{
    var thing = game.currentRoom.getThingById(str);
    const e = document.getElementById('Actions');
    clearActionsPane();
    if (thing) {
        var t = ``;
        if (typeof thing.exit === "function") {
            var r = thing.exit();
            if (typeof r === "string") {
                if (game.map.get(r)) {
                    game.handleRoomTransfer(r);
                    return;
                }
                else {
                    t = t + r;
                }
            }
        }
        else if (typeof thing.focus === "function") {
            var actions = thing.buildDefaultActions();
            const a = thing.customActions();
            if (a.constructor.name === "Array") {
                for (const i of a) {
                    if (i.constructor.name === "Action") {
                        actions.push(i);
                    }
                    else if (typeof i === "string") {
                        actions.push(new Action(i, i));        
                    }
                }
            }
            else if (a.constructor.name === "Action") {
                actions.push(a);
            }
            else if (typeof a === "string") {
                actions.push(new Action(a, a));
            }
            var f = thing.focus();
            if (f) {
                t = t + f;
            }
        }
        if (e) {
            e.innerHTML = buildActionsHTML(thing.id, actions);
        }
        addDisplayMessage(t);
        showRoom();
    }
}


function handleThingAction(str, func)
{
    const thing = game.currentRoom.getThingById(str);
    clearActionsPane();
    if (thing) {
        var t = ``;
        if (typeof thing[func] === "function") {
            var r = thing[func]();
            if (typeof r === "string") {
                t += r;
            }
        }
        clearActionsPane();
        addDisplayMessage(t);
        showRoom();
    }
}


function startGame() {
    game = new Game();
    game.mode = "cutscene";
    if (game.prefaceText) {
        setText(game.prefaceText);
        setTimeout(function() { addNextButton(); }, 1000);
    }
    else {
        showRoom();
    }
}
