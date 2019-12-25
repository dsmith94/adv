
class SalTalks extends NPCState {

    timesAsked = 0;
    timetalkingToSal = 0;
    timesAskedAboutGibbs = 0;

    hello(parentState, parentNPC) {
        return `"Heya Sal," you say.
        <p>"Hey Jules." `;
    }

    bye(parentState, parentNPC) {
        return `"Take it easy, Sal."
        <p>"Don't got a choice, do I?" `;
    }

    oldFashionedResponse(parentState, parentNPC) {
        parentState.removeTopic(parentNPC.currentTopic);
        return `"So, how do you make an old fashioned?"
        <p>"Easy," smirks Sal. "Four ounces of rye in a highball with ice cubes."
        <p>"I don't think that's right."
        <p>"It's the house specialty."`;
    }

    
    tabResponse(parentState, parentNPC) {
        if (parentState.timesAsked < 1) {
            parentState.timesAsked++;
            parentState.addTopic(`ask how to make an old fashioned`, parentState.oldFashionedResponse);
            return `"Aw, don't worry yer pretty little head about that today. It'll be there tomorrow."`;
        }
        else {
            parentState.removeTopic('discuss your tab');
            return `Sal glares. "Don't you have real work to do?"`;
        }
    }

    gibbsResponse(parentState, parentNPC) {
        var t = ``;
        if (parentState.timesAskedAboutGibbs === 0) {
            parentState.timesAskedAboutGibbs++;
            t = `"What do I do about my boss on ice?" you ask.
            <p>"Did you call the cops?" asked Sal.
            <p>"Of course not. I ain't no dumb Dora."
            <p>"No you ain't."`;
        }
        else if (game.registry.get('goSeeFritz') === false) {
            game.registry.set('goSeeFritz', true);
            t = `"Seriously, what do I do? I ain't takin' no rat for a moron like Gibbs."
            <p>"Did he have any enemies?"
            <p>"Yeah. I was going to kill him today."
            <p>"Besides you. You suppose it was his wife who done him in?"
            <p>You shake your head. "No way. She hated him, but she got no chutzpah."
            <p>"Any friends?"
            <p>"Not in particular. He had that foreign contact he was always brownnosing with. Fritz Derworth."
            <p>Sal sniffs. "Sounds like a lead to me."`;
        }
        else if (game.registry.get('haveSeenFritz') === true) {
            t = `"You gone to see that Derworth reub yet?"
            <p>"Yeah. Don't ask."
            <p>"You're just having a special kind of day."
            <p>"Yeah. Go tell it to Sweeney."`;
        }
        else {
            t = `"You gone to see that Derworth reub yet?"
            <p>You shrug.
            <p>"Best get on with it then, eh Jules?"`;
        }
        return t;
    }

    topics = new Map([
        [`discuss your tab`, this.tabResponse ],
        [`ask how he is doing`, `"How's business?" <p>"Booming as always. I hope Prohibition never ends."` ],
        [`discuss your dead boss`,  this.gibbsResponse ],
        [`say goodbye`, function(s, n) { endConversation(); } ],
    ]);


    conversation(parentState, parentNPC) {
        if (parentState.timetalkingToSal < 2) {
            if (parentState.timetalkingToSal === 1) {
                addEnvironmentalMessage(`A fella who you never seen before comes in. He sits down at the bar. He's a 
                cop. You can smell 'em, and he's a cop for sure.`);
            }
            parentState.timetalkingToSal++;
        }
        var t = parentNPC.physicalDesc();
        t += buildConversationSuggestions(parentState, parentNPC);
        return t;
    }

}


class Sal extends NPC {

    id = `Sal`;

    gender = `him`;

    currentState = 'talking';

    states = new Map([
        ['talking', new SalTalks()],
    ]);

    properNoun() {
        return `Sal`;
    }

    physicalDesc() {
        return `Sal is a man is his late fourties to early one-hundreds. His hair, what little remains, is cropped close to his
        leathery head, and his deep blue eyes are set behind a pair of nearly-busted $cheaters.`;
    }

    focus() {
        beginConversation(this.id);
    }

}

