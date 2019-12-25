

class SalsDrinks extends Decoration {

    id = `drinks`;

    desc() {
        return `drink selection`;
    }

    focus() {
        return randomText([
            `They got it right here: the finest bathtub-made poison in two whole city blocks.`,
            `Per usual, Sal is out of everything but rotgut, giggle juice, and sacramental wine.`,
            `If he don't got it, he can make it, as long as it involves nothin' more than
            whiskey and ice cubes.`,
        ]);
    }
}


class SalGlasses extends Decoration {

    id = `cheaters`;

    desc() {
        return `cheaters`;
    }

    focus() {
        return `They're so smudged you'd need X-Ray vision to see through 'em. You'd sooner see through brick.`;
    }
}


class AtSalsBar extends Room {

    contains = [ 
        new SalsDrinks(),
        new SalGlasses(),
        new Sal(),
    ];

    environmentalEffects = [ 
        `Sal wipes halfheartedly at a spot on the bar which has been there for years. `,
        `Glass clinks merrily as Sal mixes another drink. `,
        `A couple of flies buzz lazily in the air. `,
    ];

    enterText() {
        if (!this.hasVisited) {
            var t = `<span class="drop">"W</span>hat am I gonna do, Sal?"
            <p>Sal swabs the inside of a highball glass. "I dunno. Didn't the CIA want you to off this bozo anyhow?"
            <p>"The FBI, you dumbdolt. I work for the FBI."
            <p>"Same difference."
            <p>You take another sip of scotch. "I could get framed for this."
            <p>"Nah. The FBI won't let you go to the slammer."
            <p>You shake your head. "It's worse than that. Gibbs' death was...sloppy."
            <p>"And you ain't sloppy." Sal puts away another glass.
            <p>"Nope."
            <p>"Just late."
            <p>"Yep."`;
            return t;
        }
    }

    desc() {
        return `$Sal's speakeasy is in the basement of an old Brooklyn brownstone. The place stinks, it's hot, and there's probably rats.
        But the $drinks is better than the milkshakes at the diner across the street. A drab flight of stairs leads
        up to the street. `;
    }

}
