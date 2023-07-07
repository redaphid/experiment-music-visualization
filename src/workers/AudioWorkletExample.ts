// Define an audio worklet processor
export class AudioWorkletExample extends AudioWorkletProcessor{
  constructor() {
    super()
    console.log('constructor')
  }
  process(inputs, outputs, parameters) {
    // Implement custom audio processing logic here
    // ...

    // Return true to keep the audio worklet processor active
    console.log('processing', {inputs, outputs, parameters})
    return true;
  }
}
registerProcessor('AudioWorkletExample', AudioWorkletExample);
