const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(20, 20);

function arenaSweep()
{
	let rowCount = 1;
    outer: for (let y = arena.length -1; y > 0; --y) 
    {
        for (let x = 0; x < arena[y].length; ++x) 
        {
            if (arena[y][x] === 0) 
            {
                continue outer;
            }
        }
        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;
        player.score += rowCount * 10;
		rowCount *= 2;
		dropInterval -= 50;
    }
}


function collide(arena, player)
{
	const [matrix, offset] = [player.matrix, player.pos];

	for (let y = 0; y < matrix.length; ++y)
	{
		for(let x = 0; x < matrix[y].length; ++x)
		{
			if(matrix[y][x] !== 0)
			{
				if((arena[y + offset.y] && arena[y + offset.y][x + offset.x]) !== 0)
				{
					return true;
				}
			}
		}
	}
	return false;
}

function createMatrix(w, h)
{
    const matrix = [];

    while (h--) 
    {
        matrix.push(new Array(w).fill(0));
    }
    return matrix;
}

function createPiece(type)
{
	if(type === 'T')
	{
		return [
		[0, 0, 0],
		[1, 1, 1],
		[0, 1, 0], ];
	}
	else if(type === 'O')
	{
		return [
		[2, 2],
		[2, 2], ];
	}
	else if(type === 'L')
	{
		return [
		[0, 3, 0],
		[0, 3, 0],
		[0, 3, 3], ];
	}
	else if(type === 'J')
	{
		return [
		[0, 4, 0],
		[0, 4, 0],
		[4, 4, 0], ];
	}
	else if(type === 'I')
	{
		return [
		[0, 5, 0, 0],
		[0, 5, 0, 0],
		[0, 5, 0, 0],
		[0, 5, 0, 0], ];
	}
	else if(type === 'S')
	{
		return [
		[0, 6, 6],
		[6, 6, 0],
		[0, 0, 0], ];
	}
	else if(type === 'Z')
	{
		return [
		[7, 7, 0],
		[0, 7, 7],
		[0, 0, 0], ];
	}

}


function drawMatrix(matrix, offset)
{
	matrix.forEach( (row, y) =>
	{ 
		row.forEach( (value, x) => 
		{ 
			if(value !== 0) 
			{ 
				context.fillStyle = colors[value];
				context.fillRect( x + offset.x, 
								  y + offset.y, 
								  1, 1); 
			} 
		}); 
	});
}

function draw()
{
	context.fillStyle = '#000';
	context.fillRect(0, 0, canvas.width, canvas.height);

	drawMatrix(arena, {x: 0, y: 0});
	drawMatrix(player.matrix, player.pos);
}

function merge(arena, player)
{
    player.matrix.forEach( (row, y) => 
    {
        row.forEach( (value, x) => 
        {
            if (value !== 0) 
            {
                arena[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function playerDrop()
{
	player.pos.y++;

	if(collide(arena, player))
	{
		if(aux !== 0)
		{
			dropInterval = aux;
			aux = 0;
		}
		player.pos.y--;
		merge(arena, player);
		playerReset();
		arenaSweep();
		updateScore();
	

	}
	dropCounter = 0;
}

function playerFastDrop()
{
	if(aux === 0)
	{
		aux = dropInterval;
		dropInterval = -1000;
	}
}

function playerMove(dir)
{
	player.pos.x += dir;
	if(collide(arena, player))
	{
		player.pos.x -= dir;
	}
}

function playerReset()
{
    const pieces = 'TJLOSZI';
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
    
    if (collide(arena, player)) 
    {
        arena.forEach(row => row.fill(0));
		player.score = 0;
		dropInterval = 1000;
        updateScore();
    }
}

function playerRotate(dir)
{
	const pos = player.pos.x;
	let offset = 1;
	rotate(player.matrix, dir);
	while(collide(arena, player))
	{
		player.pos.x+=offset;
		offset = -(offset + (offset > 0 ? 1 : -1));
		if(offset > player.matrix[0].length)
		{
			rotate(player.matrix, -dir);
			player.pos.x = pos;
			return;
		}
	}
}

function rotate(matrix, dir)
{
	for(let y = 0; y < matrix.length; ++y)
	{
		for(let x = 0; x < y; ++x)
		{
			[matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]]; 
		}
	}

	if(dir > 0)
		matrix.forEach(row => row.reverse());
	else
		matrix.reverse();
}

let score = 0;
let dropCounter = 0;
let aux = 0;
let dropInterval = 1000;
let lastTime = 0;

function update(time = 0)
{
    const deltaTime = time - lastTime;

    dropCounter += deltaTime;

    if (dropCounter > dropInterval) 
    {
        playerDrop();
    }

    lastTime = time;

    draw();
    requestAnimationFrame(update);
}

function updateScore()
{

	document.getElementById('score').innerText = player.score;
	if(player.score - score < 10)
	{
		score = player.score;
	}
}
const colors = [
	null,
	'#E32468',
	'#98E22B',
	'#67D8EF',
	'#E79622',
	'#7B76FF',
	'#90918B',
	'#F8F8F2',
]
document.addEventListener('keydown', event => 
{
	if(event.keyCode === 37)
	{
		playerMove(-1);		
	}
	else if(event.keyCode === 39)
	{
		playerMove(+1);
	}
	else if(event.keyCode === 32)
	{
		playerDrop();
	}
	else if(event.keyCode === 38)
	{
		playerRotate(-1);
	}
	else if(event.keyCode === 40)
	{
		playerRotate(+1);
	}
	else if(event.keyCode === 96)
	{
		playerFastDrop();
	}
	//console.log(event);
});

const arena = createMatrix(12, 20);
//console.log(arena);


const player = {
	pos: {x: 0, y: 0},
	matrix: null,
	score: 0, 
};
playerReset();
updateScore();
update();