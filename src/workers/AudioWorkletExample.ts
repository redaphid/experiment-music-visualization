// Define an audio worklet processor
export class AudioWorkletExample extends AudioWorkletProcessor{
  constructor() {
    super()
    console.log('constructor')
     // Create a message channel between the worklet and the main thread
     this.port.onmessage = this.handleMessage.bind(this);
  }
  handleMessage(event) {
    const { data } = event;

    // Process the received message data from the main thread
    // ...

    // Send a response back to the main thread if needed
    // ...
  }

  process(inputs, outputs, parameters) {
    // Implement custom audio processing logic here
    // ...

    // Return true to keep the audio worklet processor active
    const message = {inputs, outputs, parameters};
    this.port.postMessage(message);
    return true;
  }
}
registerProcessor('AudioWorkletExample', AudioWorkletExample);
