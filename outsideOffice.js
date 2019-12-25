
class Fan extends Decoration {

    id = `fan`;

    desc() {
        return `fan`;
    }

    focus() {
        return `The fan barely turns. Even the machines are givin' up in this heat.`;
    }

}


class Icebox extends Decoration {

    id = `icebox`;

    canBeOpened = true;

    tryOpening() {
        return `You open the icebox for a moment and chill your face. It feels good, and stinks like rotten eggs.
                <p>You close the icebox again.`
    }

    desc() {
        return `icebox`;
    }

    focus() {
        return randomText([
            `The icebox is empty. Go figure.`,
            `You'd rather get a drink at Sal's place tonight.`,
            `Used furniture, just like Gibb's old lady.`,
        ]);
    }

}


class HallWindow extends Thing {

    id = `window`;
    canBeOpened = true;

    specialDesc() {
        if (this.isClosed === true) {
            return `a shut $window`;
        }
        else {
            return `an open $window`;
        }
    }

    smudge() {
        return `You're a real Queen of Clean, Jules.`;
    }
    
    tryOpening() {
        this.isClosed = false;
        return `With a squeak that would shut down an elephant, the window moves a couple of inches.`;
    }


    tryClosing() {
        this.isClosed = true;
        return `With some serious elbow grease, the window shuts.`;
    }


    customActions() {
        return ["smudge"];
    }


    desc() {
        return `window`;
    }


    focus() {
        return `You could maybe squeeze through if you was a toothpick. `;
    }

}


class DoorIntoOffice extends RoomExit {

    id = `door`;
    attempts = 0;

    desc() {
        return `door`;
    }

    exit() {
        if (this.attempts === 0) {
            this.attempts++;
            return `The door is jammed. Gibbs must be makin' time with one of them magazines he hides from his wife.`;
        }
        if (this.attempts === 1) {
            this.attempts++;
            return `You politely rap on the door.
            <p>No answer.`;
        }
        if (this.attempts === 2) {
            this.attempts++;
            return `You bang on the door. "Hey boss! Open up!"`;
        }
        if (this.attempts === 3) {
            this.attempts++;
            game.registry.set('gibbsDoorOpen', true);
            return `You kick the door in. Not much of a bolt on that thing.`;
        }
        else {
            return `insideOffice`;
        }
    }

}


class OfficeHallwayExit extends RoomExit {

    id = `hallway`;

    desc() {
        return `hallway`;
    }

    exit() {
        return `You don't got time to be wandering these halls, you got a moron to kill.`;
    }

}


class OutsideOffice extends Room {

    window = new HallWindow();
    contains = [ 
        new Fan(), 
        new Icebox(),
        new DoorIntoOffice(),
        this.window,
        new OfficeHallwayExit(),
    ];

    environmentalEffects = [ 
        `The $fan whines in the heat. `,
        `A distant door slams shut somewhere down the hall. `,
    ];


    doorStatus() {
        if (game.registry.get('gibbsDoorOpen') === true) {
            return `swinging open`;
        }
        return `shut like Fort Knox`;
    }

    firstVisit() {
        return `You fix your hair and straighten your famous One Kiss Goodnight lipstick.
        It's showtime. 
        <p>Oh, and don't forget--<i>do not</i> lick your lips. <p> `
    }

    desc() {
        var t = ``;
        if (!this.visited) {
            t = applyDropCaps(this.firstVisit());
        }
        t = `${t}Stained green carpet runs down a $hallway leading to Gibbs' office $door, which is currently
        ${this.doorStatus()}. The walls are chewed up and covered in chipped paint.
        An $icebox stands in a corner near ${this.window.specialDesc()}.`;
        return t;
    }

}
