/**
 * Created by Leonid on 31/10/16.
 */
import Dot from './classes/Dot';
import analyzeAudio from './actions/analyzeAudio';
import AudioAnalyser from './classes/AudioAnalyser';
function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function draw(x = 0, y = 0, container = document.body) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');

    var width = window.innerWidth - 40, height = window.innerHeight/1.5;

    canvas.width = width;
    canvas.height = height;
    container.appendChild(canvas);

    ctx.save();

    var dotesCount = ((width + height)/8);
    var stepY = width / dotesCount;
    var stepX = height / dotesCount;

    var dotes = [];

    function createDot(x, y, vx, vy){

        var d = new Dot(ctx, x, y, vx, vy);
        dotes.push(d);
    }
    for (var i = 1; i <= dotesCount; i++) {

        let vX = 0.1*getRandom(-10, 10);
        let vY = 0.1*getRandom(-10, 10);

        createDot(getRandom(0, width), getRandom(0, height), vX, vY);
    }

    var frame;

    const aa = new AudioAnalyser(document.getElementById('audioP'));

    let speed = 1;


    function runIt(){
        frame = requestAnimationFrame(runIt);

        if (speed > 45 || speed < -45) {
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = 'rgba(255, 255, 255, 1)';
            ctx.fillRect(0, 0, width, height);
        } else if (speed != 0){
            let rand = getRandom(-10, 10);
            if (rand < 0) {
                ctx.fillStyle = 'rgba(255, 255, 255, .1)';
                ctx.fillRect(0, 0, width, height);
            } else {
                ctx.fillStyle = 'rgba(220, 220, 220, .1)';
                ctx.fillRect(0, 0, width, height);
            }

            for (var d in dotes) {
                dotes[d].setSpeedMultiplier(speed);
                dotes[d].fly(width, height);
            }
        } else {
            ctx.fillStyle = 'rgba(255, 255, 255, .4)';
            ctx.fillRect(0, 0, width, height);
        }


        drawOcni();
    }

    runIt();

    let count = 0, frequency = 0;

    let analyzer = ()=>{
        count += 1;
        let dataArray = aa.getLoop();
        x=0;
        for(var i = 0; i < aa.bufferLength; i++) {
            x += dataArray[i]/128.0;
        }

        frequency += x/aa.bufferLength;


        if (count >= 1) {
            let res = frequency/count;

            res = 100 - (res*100);

            speed = res;
            count = 0;
            frequency = 0;
        }

    };

    setInterval(()=>{
        analyzer();
    }, 10);

    canvas.addEventListener('mousedown', function(e){
        let startX = e.clientX,
            startY = e.clientY,
            target = e.currentTarget;
        const d = 0.5;
        target.onmousemove = (e)=>{
            let endX = e.clientX,
                endY = e.clientY;

            let difX = startX - endY,
                difY = startY - endY;

            if (difX > d || difX < -d || difY > d || difY < -d) {
                startX = endX;
                startY = endY;

                createDot(startX, startY, difX, difY);
            }
        };

        target.onmouseup = ()=>{
            target.onmousemove = null;
            target.onmouseup = null;

        };
    }, false);


    function drawOcni() {

        let dataArray = aa.getLoop();

        let bufferLength = aa.bufferLength;


        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(0, 0, 0, .8)';

        ctx.beginPath();

        var sliceWidth = width * 1.0 / bufferLength;
        var x = 0;

        for(var i = 0; i < bufferLength; i++) {

            var v = dataArray[i] / 128.0;
            var y = v * height/2;

            if(i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height/2);
        ctx.stroke();
    }

    drawOcni();

}

export default draw;
