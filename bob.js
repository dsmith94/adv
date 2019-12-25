class BobTalks extends NPCState {

    townReponse(parentState, parentNPC) {
        return `"Oh yeah, that's the way into town," ${parentNPC.noun()} says.`;
    }

    topics = new Map([
        ['hamlet', this.townReponse ]
    ]);

    constructor() {
        super();
    }

}


class Bob extends NPC {

    id = `Bob`;

    haveMet = false;

    gender = `him`;

    talkState = new BobTalks();

    noun() {
        return `a man`;
    }

    focus() {
        if (this.haveMet) {
            return `"Nice to see you again."`;
        }
        else {
            this.noun = function() { return `Bob` };
            return `"The name's Bob," he says, extending his hand and shaking yours. "Nice to meet you."`;
        }
    }

    constructor() {
        super();
        this.states = new Map([
            ['talking', this.talkState],
        ]);
        this.setState('talking');
    }

}
