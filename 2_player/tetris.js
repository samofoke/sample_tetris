const cvs = document.getElementById('tetris');
const cxs = cvs.getContext('2d');
const player = new Player;

cxs.scale(20, 20);


//create a matrix.


//the draw function.

function draw() {

    cxs.fillStyle = '#000';
    cxs.fillRect(0, 0, cvs.width, cvs.height);

    drawMatrix(arena.matrix, {x: 0, y: 0});
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

//the merge function.


//this update the frames of draw.



let last = 0;

function update(t = 0) {
    const d = t - last;
    last = t;
    
    player.update(d);
    //console.log(d);
    draw();
    requestAnimationFrame(update);
}

function updateScore() {
    document.getElementById('score').innerText = player.score;
}

const arena = new Arena(12, 20);


document.addEventListener('keydown', event => {
    if (event.keyCode === 37) {
        player.move(-1);
    }else if (event.keyCode === 39) {
        player.move(1);
    }else if (event.keyCode === 40) {
        player.drop();
    }else if (event.keyCode === 65) {
        player.rotate(-1);
    }else if (event.keyCode === 68) {
        player.rotate(1);
    }
    //console.log(event);
});

 player.reset();
 updateScore();
update(); 