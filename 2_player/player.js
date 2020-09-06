class Player {
    constructor() {

        this.drpcnt = 0;
        this.drpint = 1000;

        this.pos = {x: 0, y: 0};
        this.matrix = null;
        this.score = 0;
    }
    reset() {
        const p = 'OTJSLZIL';
        this.matrix = playerpiece(p[p.length * Math.random() | 0]);
        this.pos.y = 0;
        this.pos.x = (arena.matrix[0].length / 2 | 0) - (this.matrix[0].length / 2 | 0);
    
        if (collide(arena, this)) {
            arena.clear();
            this.score = 0;
            updateScore();
        }
    }
    update(d) {
        this.drpcnt += d;
        if (this.drpcnt > this.drpint) {
            this.drop();
        }
    }
    move(d) {
        this.pos.x += d;
        if (arena.collide(this)) {
            this.pos.x -= d;
        }
    }
    rotate(d) {
        const ps = this.pos.x;
        let set = 1;
        this.rotate_matrix(this.matrix, d);
        while (arena.collide(this)) {
            this.pos.x += set;
            set = -(set + (set > 0 ? 1 : -1));
            if (set > this.matrix[0].length) {
                this.rotate_matrix(this.matrix, -d);
                this.pos.x = ps;
                return;
            }
        }
    }
    rotate_matrix(m, d) {
        for (let y = 0; y < m.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [
                    m[x][y],
                    m[y][x],
                ] = [
                    m[y][x],
                    m[x][y],
                ];
            }
        }
        if (d > 0) {
            m.forEach(r => r.reverse());
        } else {
            m.reverse();
        }
    }
    drop() {
        this.pos.y++;
        if (arena.collide(this)) {
            this.pos.y--;
            arena.merge(this);
            this.reset();
            arena.distroyPiece();
            updateScore();
            //player.pos.y = 0;
        }
        this.drpcnt = 0; 
    }
}