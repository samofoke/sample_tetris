const cvs = document.getElementById('tetris');
const cxs = cvs.getContext('2d');

cxs.scale(20, 20);


//create a matrix.
function createMatrix(w, h) {
    const matrix = [];
    while (h--) {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

//the draw function.

function draw() {

    cxs.fillStyle = '#000';
    cxs.fillRect(0, 0, cvs.width, cvs.height);

    drawMatrix(arena, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
}

//this function is for the shapes.

function drawMatrix(matrix, s) {
    matrix.forEach((row, y) => {
        row.forEach((v, x) => {
            if (v !== 0) {
                cxs.fillStyle = color[v];
                cxs.fillRect(x + s.x, y + s.y, 1, 1);
            }
        });
    });
}

function playerpiece(p) {
    if (p === 'T') {
        return [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0],
        ];
    }else if (p === 'O') {
        return [
            [2, 2],
            [2, 2],
        ];
    }else if (p === 'L') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [0, 3, 3],
        ];
    }else if (p === 'J') {
        return [
            [0, 4, 0],
            [0, 4, 0],
            [4, 4, 0],
        ];
    }else if (p === 'I') {
        return [
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
            [0, 5, 0, 0],
        ];
    }else if (p === 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0],
        ];
    }else if (p === 'Z') {
        return [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0],
        ];
    }
}

function playerMove(d) {
    player.pos.x += d;
    if (collide(arena, player)) {
        player.pos.x -= d;
    }
    }

function collide(arena, player) {
    const [m, o] = [player.matrix, player.pos];
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 && (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function distroyPiece() {
    let cnt = 1;
    outer: for (let y = arena.length - 1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }
        const r = arena.splice(y, 1)[0].fill(0);
        arena.unshift(r);
        ++y;

        player.score += cnt * 10;
        cnt *= 2;
    }
}


const color = [
    null,
    '#B7FE63',
    '#FE7E63',
    '#FEE963',
    '#63FECD',
    '#FEBE63',
    '#5EFF4D',
    '#FFA315',
] 

function playerRoate(d) {
    const ps = player.pos.x;
    let set = 1;
    rotate(player.matrix, d);
    while (collide(arena, player)) {
        player.pos.x += set;
        set = -(set + (set > 0 ? 1 : -1));
        if (set > player.matrix[0].length) {
            rotate(player.matrix, -d);
            player.pos.x = ps;
            return;
        }
    }
}
  
function rotate(m, d) {
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

//the merge function.

function merge(arena, player) {
    player.matrix.forEach((r, y) => {
        r.forEach((v, x) => {
             if (v !== 0) {
                 arena[y + player.pos.y][x + player.pos.x] = v;
             }
        });
    });
}

//this update the frames of draw.

let drpcnt = 0;
let drpint = 1000;

let last = 0;

function update(t = 0) {
    const d = t - last;
    last = t;
    
    drpcnt += d;
    if (drpcnt > drpint) {
        playerDrop();
    }
    //console.log(d);
    draw();
    requestAnimationFrame(update);
}

function Reset() {
    const p = 'OTSLZIL';
    player.matrix = playerpiece(p[p.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);

    if (collide(arena, player)) {
        arena.forEach(r => r.fill(0));
        player.score = 0;
        updateScore();
    }
}

function updateScore() {
    document.getElementById('score').innerText = player.score;
}

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        Reset();
        distroyPiece();
        updateScore();
        //player.pos.y = 0;
    }
    drpcnt = 0; 
}
const arena = createMatrix(12, 20);


document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {
        playerMove(-1);
    }else if (event.keyCode === 39) {
        playerMove(1);
    }else if (event.keyCode === 40) {
        playerDrop();
    }else if (event.keyCode === 65) {
        playerRoate(-1);
    }else if (event.keyCode === 68) {
        playerRoate(1);
    }
    //console.log(event);
});

const player = {
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0,
}
 Reset();
 updateScore();
update(); 