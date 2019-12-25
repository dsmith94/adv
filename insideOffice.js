
class OfficeDoorDecoration extends Decoration {

    id = `door`;

    desc() {
        return `door`;
    }

    focus() {
        return `Don't go out that door. The coppers are on their way for sure, and you don't got time to deal with them right now. `;
    }

}


class OfficeDesk extends Decoration {

    id = `desk`;

    desc() {
        return `desk`;
    }

    focus() {
        return `Shame he got blood all over that desk, it was nice.`;
    }

}


class OfficePapers extends Decoration {

    id = `papers`;

    desc() {
        return `papers`;
    }

    focus() {
        return `You check to be certain, but there's nothing useful left in this heap. `;
    }

}


class OfficeWindow extends RoomExit {

    id = `window`;

    desc() {
        return `window`;
    }

    exit() {
        return `atSalsBar`;
    }

}


class DeadBoss extends Decoration {

    id = `Gibbs`;

    desc() {
        return `Mr. Gibbs`;
    }

    focus() {
        return `Some upstage bimbo went and blew Gibbs' brains out. Don't improve his personal appearance much, 
        but it don't hurt it any neither. You'd feel sorry for him except he was such a grabby putz. That, and he was spy.
        His old lady will be doin' handstands when she finds out.
        <p>Now you're in trouble. If you don't play your cards just right, you'll be a suspect.
        Whoever did it must've been just been here, too.`;
    }

}


class InsideOffice extends Room {

    contains = [ 
        new OfficeDoorDecoration(),
        new OfficeWindow(),
        new OfficePapers(),
        new OfficeDesk(),
        new DeadBoss(),
    ];

    enterText() {
        if (!this.hasVisited) {
            game.registry.set('gibbsBody', true);
            return `On entering the boss's office, you suddenly figure why he wasn't answering the door a minute ago.`
        }
    }

    exitText() {
        return `You slip out the window and down the fire escape. Smart money says it's the same way
        Gibbs' killer got out.`;
    }

    desc() {
        return `Slumped over an oak $desk in a pool of his own blood lies $Gibbs. The place is covered in $papers and overturned
        drawers--it's been searched. An open $window on the back wall lets in a welcome breeze. The $door 
        behind you creaks on the hinges. `;
    }

}
