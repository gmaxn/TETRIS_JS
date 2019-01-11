const canvas = document.getElementById('menu');
const context = canvas.getContext('2d');

//context.scale(20, 20);
context.fillStyle = "#000";
context.fillRect(0, 0, canvas.width, canvas.height);

//context = canvas.getContext('2d');
/*
context.font="30px Consolas";
context.fillStyle = "red";
context.textAlign = "center";
context.fillText("uno", canvas.width/2, canvas.height/2);
context.font="15px Consolas";

context.fillText("dos", canvas.width/2, canvas.height/2-100);

context.fillText("tres", canvas.width/2, canvas.height/2+100);
*/
let dropCounter = 0;
let dropInterval = 25;
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

function playerDrop()
{
	//debugger;
	if(item.pos.y < 300 && item.tam>10)
	{
		item.pos.y++;
		item.tam--;
	}


	dropCounter = 0;
}

function drawText(item, offset, size)
{
	context.font = size + "px Consolas";
	context.fillStyle = "red";
	context.textAlign = "center";
	context.fillText(item.txt, offset.x, offset.y);
}

function draw()
{
	context.fillStyle = '#000';
	context.fillRect(0, 0, canvas.width, canvas.height);

	//drawMatrix(arena, {x: 0, y: 0});
	drawText(item, item.pos, item.tam);

}

const item = {
	pos: {x: canvas.width/2, y: canvas.height/2},
	txt: "UNO",
	tam: 30,
};

update();