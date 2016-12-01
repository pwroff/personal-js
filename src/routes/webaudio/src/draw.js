/**
 * Created by Leonid on 31/10/16.
 */
import Dot from './classes/Dot';
function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function draw(x = 0, y = 0) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    var width = 600, height = 600;

    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);

    ctx.save();

    ctx.fillStyle = 'rgba(0,0,0,1)';
    ctx.fillRect(0,0,width, height);

    var dotesCount = ((width+height)/2)/4;
    var stepY = width/dotesCount;
    var stepX = height/dotesCount;

    var dotes = [];
    for (var i = 1; i <= dotesCount; i++) {

        var d = new Dot(ctx, stepX*i, stepY*i, getRandom(-4, 4), getRandom(-4, 4));
        dotes.push(d);
    }

    let frame;

    function runIt(){
        frame = requestAnimationFrame(runIt);

        for (var d in dotes) {
            dotes[d].fly(width, height);
        }

    }

    runIt();

}

export default draw;
