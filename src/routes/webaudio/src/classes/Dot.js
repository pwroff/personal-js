function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

window.getRandom = getRandom;

var Dot = function Dot(ctx, x, y, velX, velY) {
    this.ctx = ctx;
    this.pX = x;
    this.pY = y;
    this.vX = velX;
    this.vY = velY;
    this.invX = velX;
    this.invY = velY;
    this.gravity = 1;
    this.color = `rgba(120,120,120, ${getRandom(0.5, 1.1)})`;
    this.height = 3;
    this.width = 2;
    this.multiplier = 1;

    var self = this;

    var keydownHandler = function (e) {
        switch (e.code) {
            case 'ArrowUp':
                self.vY *= 1.2;
                break;
            case 'ArrowDown':
                self.vY *= 0.8;
                break;
            case 'ArrowLeft':
                self.vX *= 0.8;
                break;
            case 'ArrowRight':
                self.vX *= 1.2;
                break;
        }

        self.invX = self.vX;
        self.invY = self.vY;
    };

    document.body.addEventListener('keydown', keydownHandler, false);

    this.destroy = function () {
        document.body.removeEventListener('keydown', keydownHandler, false);
    };

    this.setSpeedMultiplier = (multiplier) => {
        this.multiplier = multiplier;
    }
};

Dot.prototype.fly = function (width, height) {
    this.prevX = this.pX;
    this.prevY = this.pY;
    this.ctx.beginPath();
    this.ctx.arc(this.pX-Math.PI, this.pY-Math.PI, this.height, 0, Math.PI * 2, true);
    this.ctx.closePath();
    this.ctx.fillStyle = 'rgba(0,0,0,0.9)';
    this.ctx.fill();
    this.ctx.fillStyle = 'rgba(0,0,0,0.9)';
    this.ctx.fillRect(this.pX-Math.PI, this.pY-Math.PI , Math.PI * 2, Math.PI * 2);
    this.pX += (this.vX*this.multiplier);
    this.pY += (this.vY*this.multiplier);

    this.ctx.beginPath();
    this.ctx.arc(this.pX, this.pY, this.height, 0, Math.PI * 2, true);
    this.ctx.closePath();
    this.ctx.fillStyle = this.color;
    this.ctx.fill();
    //this.ctx.fillStyle = this.color;
    //this.ctx.fillRect(this.pX, this.pY, this.height, this.width);

    var tX = Math.max(this.pX, this.pX * -1);
    var tY = Math.max(this.pY, this.pY * -1);

    this.vX = this.pX >= width || this.pX <= 0 ? -1 * this.vX : this.vX;
    this.vY = this.pY >= height || this.pY <= 0 ? -1 * this.vY : this.vY;
}

Dot.prototype.start = function (w, h) {
    var fly = this.fly.bind(this, w, h);
    this.interval = setInterval(fly, 20);
}

export default Dot;
