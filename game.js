

class Game extends CoreGameClass {

    constructor() {
        super();

        this.registry = new Map([
            ['gibbsDoorOpen', false],
            ['gibbsBody', false],
            ['goSeeFritz', false],
        ]);

        this.map = new Map([
            [ 'outsideOffice', new OutsideOffice() ],
            [ 'atSalsBar', new AtSalsBar() ],
            [ 'insideOffice', new InsideOffice() ],
        ]);

        this.playerNoun = `you`;

        this.turns = 0;

        this.currentRoom = this.map.get('outsideOffice');
        
        /*
        this.prefaceText = applyEmphasis(`<center><b>July 3, 1922</b></center>
        ~~It's hot as the flames of Perdition and you got a job to do. Not your usual 9 to 5 as secretary
        for that fat dumb jerk, Mr. Gibbs. Your <i>real</i> gig, which amounts to scuttling scumballs off this mortal coil.
        ~~The boss man has spoken. This Independance Day, Gibbs is gonna be takin' the
        next train to that big speakeasy in the sky. You've known it for a while, but the guy you've worked a typewriter for
        over the last six months is a traitor and a spy.
        ~~Easy peasy cakewalk. You're a secret agent, and just the dame for the job.`);
        */
        
    }

}

