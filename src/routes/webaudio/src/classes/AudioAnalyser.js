/**
 * Created by Leonid on 28/10/16.
 */
var AudioContext = window.AudioContext || window.webkitAudioContext;

class AudioAnalyser {
    constructor(src) {
        this.ctx = new AudioContext();
        this.analyser = this.ctx.createAnalyser();
        this.audioSrc = this.ctx.createMediaElementSource(src);
        this.ctx.onstatechange = ()=> {
            console.log(this.ctx.state);
        };
        this.gainNode = this.ctx.createGain();
        this.oscillator = this.ctx.createOscillator();
        this.oscillator.connect(this.gainNode);
        this.audioSrc.connect(this.gainNode);
        this.gainNode.connect(this.ctx.destination);
    }

    getLoop() {
        this.audioSrc.connect(this.analyser);
        this.analyser.fftSize = 256;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        this.analyser.getByteTimeDomainData(this.dataArray);
        return this.dataArray;
    }

    getFrequency() {
        return this.oscillator.frequency.value
    }

    play() {
        this._src.play();
    }
}
export default AudioAnalyser;
