import encodeWAV from './encode_wav.js';


// Audio recorder class for one-time use recording.  Only works on Chrome and Firefox.
// Adapted from https://github.com/danrouse/react-audio-recorder
// States are:
//    creating
//   *ready*
//    acquiring
//   *recording*
//    encoding
//    resetting
//   *error*
export default class AudioRecorder {
  state: string;
  buffers: ?[[number]];
  bufferLength: number;
  bufferSize: number;
  audioContext: ?AudioContext;
  sampleRate: number;
  processor: ?Object;
  recordingStream: ?Object;
  getUserMedia: ?Object;

  constructor() {
    this.state = 'creating';
    this.bufferSize = 4096; // tuned up since we care about throughput and capturing all frames, not latency
    this.getUserMedia = (window.navigator.getUserMedia ||
                         window.navigator.webkitGetUserMedia ||
                         window.navigator.mozGetUserMedia ||
                         window.navigator.msGetUserMedia).bind(window.navigator);
    this._toReady();
  }

  _toReady() {
    this.state = 'resetting';

    // recordingStream
    if (this.recordingStream && this.recordingStream.stop) this.recordingStream.stop();

    // audioContext
    if (this.audioContext && this.audioContext.close) this.audioContext.close();
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.sampleRate = this.audioContext.sampleRate;

    // processor
    if (this.processor) delete this.processor;

    
    this.buffers = [[], []];
    this.bufferLength = 0;
    
    
    this.recordingStream = null;
    
    this.state = 'ready';
  }

  record() {
    this.state = 'acquiring';
    this.getUserMedia({ audio: true }, this._onStreamReady.bind(this), this._onStreamError.bind(this));
  }

  _onStreamError(err) {
    this.state = 'error';
    console.error('AudioRecorder._onStreamError', err); // eslint-disable-line no-console
  }

  _onStreamReady(stream) {
    const {audioContext, bufferSize} = this;
    const gain = audioContext.createGain();
    const audioSource = audioContext.createMediaStreamSource(stream);
    audioSource.connect(gain);

    const processor = audioContext.createScriptProcessor(bufferSize, 2, 2);
    processor.onaudioprocess = this._onAudioProcess.bind(this);
    gain.connect(processor);
    processor.connect(audioContext.destination);

    this.processor = processor;
    this.recordingStream = stream;
    this.state = 'recording';
  }

  _onAudioProcess(event) {
    if (this.buffers && this.hasOwnProperty('bufferLength')) {
      // save left and right buffers 
      for(let i = 0; i < 2; i++) {
        const channel = event.inputBuffer.getChannelData(i);
        this.buffers[i].push(new Float32Array(channel));
      }
      this.bufferLength += this.bufferSize;
    }
  }

  stop(onBlobReady) {
    // Guard for if the various stages of initialization aren't completed yet
    if (!this.processor) return;
    if (!this.recordingStream) return;

    this.state = 'stopping';
    this._stopTracks();

    this.state = 'encoding';
    const audioData = encodeWAV(this.buffers, this.bufferLength, this.sampleRate);
    onBlobReady(audioData);

    this._toReady();
  }

  _stopTracks() {
    if (!this.this.recordingStream) return;
    const audioTracks = this.recordingStream.getTracks();
    audioTracks.forEach(audioTrack => audioTrack.stop());
  }
}
