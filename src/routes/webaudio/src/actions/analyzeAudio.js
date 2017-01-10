/**
 * Created by Leonid on 31/10/16.
 */
import AudioAnalyser from '../classes/AudioAnalyser';

const analyzeAudio = (src) => {
    const aa = new AudioAnalyser(src);

    return aa;
};

export default analyzeAudio;
