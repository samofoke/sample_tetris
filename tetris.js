const cvs = document.getElementById('tetris');
const cxs = cvs.getContext('2d');

cxs.scale(20, 20);

const matrix = [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
];

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
                cxs.fillStyle = 'red';
                cxs.fillRect(x + s.x, y + s.y, 1, 1);
            }
        });
    });
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

function playerDrop() {
    player.pos.y++;
    if (collide(arena, player)) {
        player.pos.y--;
        merge(arena, player);
        player.pos.y = 0;
    }
    drpcnt = 0; 
}
const arena = createMatrix(12, 20);


document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {
        playerMove(-1);
    }else if (event.keyCode === 39) {
        playerMove(1);
    } else if (event.keyCode === 40) {
        playerDrop();
    }
    console.log(event);
});

const player = {
    pos: {x: 5, y: 5},
    matrix: matrix,
}
 
update(); 