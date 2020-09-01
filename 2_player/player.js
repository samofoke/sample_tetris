class Player {
    constructor() {

        this.drpcnt = 0;
        this.drpint = 1000;

        this.pos = {x: 0, y: 0};
        this.matrix = null;
        this.score = 0;
    }
    update(d) {
        this.drpcnt += d;
        if (this.drpcnt > this.drpint) {
            this.drop();
        }
    }
    move(d) {
        this.pos.x += d;
        if (collide(arena, this)) {
            this.pos.x -= d;
        }
    }
    rotate(d) {
        const ps = this.pos.x;
        let set = 1;
        rotate(this.matrix, d);
        while (collide(arena, this)) {
            this.pos.x += set;
            set = -(set + (set > 0 ? 1 : -1));
            if (set > this.matrix[0].length) {
                rotate(this.matrix, -d);
                this.pos.x = ps;
                return;
            }
        }
    }
    drop() {
        this.pos.y++;
        if (collide(arena, this)) {
            this.pos.y--;
            merge(arena, this);
            Reset();
            distroyPiece();
            updateScore();
            //player.pos.y = 0;
        }
        this.drpcnt = 0; 
    }
}