

Array.prototype.shuffle = function() {
    for (let i = this.length - 1; i > 0; i--) {
        const rand = Math.floor(Math.random() * (i + 1));
        [this[i], this[rand]] = [this[rand], this[i]]
    }
}


function randomText(array) {
    array.shuffle();
    return array[0];
}


function rng(i)
{
    var v = Math.floor(Math.random() * (i + 1));
    return v;
}


class CoreGameClass {

    constructor() {
        this.map = new Map();
        this.currentNPCConversing = '';
        this.messages = [];
        this.currentExit = ``;
        this.environmentalMessages = [];
        this.mode = "normal";
        this.inventory = [];
    }


    inInventory(id) {
        if (this.inventory.indexOf(id) > -1) {
            return true;
        }
        return false;
    }


    handleRoomTransfer(id) {
        const r = this.map.get(id);
        const e = document.getElementById('Actions');
        if (r) {
            if (e) {
                e.innerHTML = ``;
            }
            this.currentExit = `${id}`;
            if (typeof this.currentRoom.exitText === "function") {
                var t = this.currentRoom.exitText();
                if (t) {
                    this.mode = "cutscene";
                    addDisplayMessage(t);
                }
            }
            this.currentRoom = r;
            if (typeof this.currentRoom.enterText === "function") {
                var t = this.currentRoom.enterText();
                if (t) {
                    this.mode = "cutscene";
                    addDisplayMessage(t);
                }
            }
            this.currentExit = ``;
            showRoom();
        }
    }

}


function addEnvironmentalMessage(m) {
    if (m) {
        game.environmentalMessages.unshift(m);
    }
}


function addDisplayMessage(m)
{
    if (m) {
        game.messages.unshift(m);
    }
}


class Action {

    desc() {
        return this.descText;
    }

    descText = ``;
    executeFunction = ``;

    constructor(descText, executeFunction) {
        this.descText = descText;
        this.executeFunction = executeFunction;
    }

}


class Thing {

    desc() {
        return `thing`;
    }


    tryOpening() {
        this.isClosed = false;
        return `${this.articleDesc()} is now opened. `;
    }


    tryClosing() {
        this.isClosed = true;
        return `${this.articleDesc()} is now closed. `;
    }


    tryReading() {
        return `${game.playerNoun} read ${this.articleDesc()}, and learn nothing interesting.`;
    }


    tryTurningOn() {
        this.isOn = true;
        return `${game.playerNoun} turn on ${this.articleDesc()}.`;
    }


    tryTurningOff() {
        this.isOn = false;
        return `${game.playerNoun} turn off ${this.articleDesc()}.`;
    }


    buildDefaultActions() {
        var a = [];
        if (this.canBeOpened) {
            if (this.isClosed === true) {
                a.push(new Action(`open`, "tryOpening"));
            }
            else if (this.isClosed === false) {
                a.push(new Action(`close`, "tryClosing"));
            }
        }
        if (this.canBeTurnedOn) {
            if (this.isOn === true) {
                a.push(new Action(`turn off`, "tryTurningOff"));
            }
            else if (this.isOn === false) {
                a.push(new Action(`turn on`, "tryTurningOn"));
            }
        }
        if (this.canBeRead) {
            a.push(new Action(`read`, "tryReading"));
        }
        return a;
    }


    customActions() {
        return [];
    }


    focus() {
        return ``;
    }


    articleDesc() {
        return `the ${this.desc()}`;
    }


    insertIntoText(container, inserted) {
        return `${game.playerNoun} put ${inserted.articleDesc()} into ${container.articleDesc()}. `;
    }


    failedInsertText(container, inserted) {
        return `${game.playerNoun} can't put ${inserted.articleDesc()} into ${container.articleDesc()}. `;
    }


    insert(thing) {
        if (this.canInsertInto === true && this.contains.indexOf(thing) > -1) {
            this.contains.push(thing);
            return this.insertIntoText(this, thing);
        }
        else if (this.canInsertInto === false) {
            return this.failedInsertText(this, thing);
        }
    }


    getRoom() {
        for (const [key, value] of game.map.entries()) {
            for (const thing of value.contains) {
                if (typeof thing.id !== "undefined" && typeof this.id !== "undefined") {
                    if (thing.id === this.id) {
                        return key;
                    }
                }
            }
        }
        return ``;
    }


    moveToRoom(room) {
        var current = game.map.get(this.getRoom());
        var nextRoom = game.map.get(room);
        if (nextRoom && current) {
            nextRoom.contains.push(this);
            current.removeThing(this.id);
        }
    }


    isIn(room) {
        var r = game.map.get(room);
        if (r) {
            for (var thing of r.contains) {
                if (typeof thing.id !== "undefined" && typeof this.id !== "undefined") {
                    if (thing.id === this.id) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    constructor() {
        this.contains = new Array();
        this.canInsertInto = false;
        this.canBeOpened = false;
        this.isClosed = true;
        this.canBeTurnedOn = false;
        this.isOn = false;
        this.canBeRead = false;
    }

}


function buildConversationSuggestions(parentState, parentNPC) {
    var d = `<p> [${game.playerNoun} can `;
    var i = 0;
    var len = parentState.topics.size - 1;
    for (var t of parentState.topics.keys()) {
        if (i === 0) {
            d = d + `@${t}`;
        }
        else if (i === (len)) {
            d = d + `. Or, ${game.playerNoun} can @${t}.] `;
        }
        else {
            d = d + `, or @${t}`;
        }
        i++;
    }
    return d;
}


class NPC extends Thing {

    properNoun() {
        return ``;
    }

    noun() {
        var n = this.properNoun();
        if (n) {
            return n;
        }
        if (this.gender === `him`) {
            return `man`;
        }
        if (this.gender === `her`) {
            return `woman`;
        }
        return `thing`;
    }

    desc() {
        var s = this.getState();
        if (s) {
            var desc = s.desc();
            if (desc) {
                return desc;
            }
        }
        return this.noun();
    }

    focus() {
        var s = this.getState();
        if (s) {
            var focus = s.focus();
            if (focus) {
                return focus;
            }
        }
        return `${this.pronoun()} doesn't appear to be all the interested in ${game.playerNoun} right now.`;
    }

    pronoun() {
        if (this.gender === `him`) {
            return `he`;
        }
        if (this.gender === `her`) {
            return `she`;
        }
        return `it`;
    }

    possesive() {
        if (this.gender === `him`) {
            return `his`;
        }
        if (this.gender === `her`) {
            return `her`;
        }
        return `its`;
    }

    getState() {
        return this.states.get(this.currentState);
    }

    constructor() {
        super();
        this.states = new Map();
        this.gender = `her`;
        this.currentTopic = '';
        this.currentState = '';
    }

}


class NPCState {

    hello(parentState, parentNPC) {
        return `"Hello."`;
    }

    bye(parentState, parentNPC) {
        return `"Bye."`;
    }

    addTopic(topic, obj) {
        var m = new Map();
        m.set(topic, obj);
        for (t of this.topics.keys()) {
            m.set(t, this.topics.get(t));
        }
        this.topics = m;
    }

    removeTopic(topic) {
        this.topics.delete(topic);
    }

    desc() {
        return ``;
    }

    focus() {
        return ``;
    }

    conversation(parentState, parentNPC) {
        return ``;
    }

    constructor() {
        this.topics = new Map();
        this.hasDiscussed = new Map();
    }

}


class Decoration extends Thing {

    decorationText = `No decoration description yet.`;

    descText = `thing`;

    desc() {
        return this.descText;
    }

    focus() {
        return this.decorationText;
    }

}


function decorate(id, focus) {
    var d = new Decoration();
    d.id = id;
    d.descText = id;
    d.decorationText = focus;
    return d;
}


class RoomExit extends Thing {

    descText = `exit`;

    linkToRoom = `For some reason, you can't seem to go that way.`;

    desc() {
        return this.descText;
    }

    exit() {
        return this.linkToRoom;
    }

}


function exitTo(id, room) {
    var r = new RoomExit();
    r.id = id;
    r.descText = id;
    r.linkToRoom = room;
    return r;
}


class Room {

    environmentalEffects = [];

    getThingById(str) {
        for (var t of this.contains) {
            if (t.id !== 'undefined') {
                if (t.id === str.trim()) {
                    return t;
                }
            }
        }
        return null;
    }


    removeThing(str) {
        for (var i = 0; i < this.contains.length; ++i) {
            if (this.contains[i].id === str) {
                this.contains.splice(i, 1);
                return;
            }
        }
    }


    display() {
        var d = this.desc();
        this.visited = true;
        return d;
    }    

    desc() {
        return `No room description yet.`;
    }

    constructor() {
        this.turns = 0;
        this.visited = false;
        this.contains = [];
    }

}
