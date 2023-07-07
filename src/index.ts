import { SadnessEventEmitter } from './SadnessEventEmitter'
// Assume you already have an AudioContext and an AnalyserNode set up
async function startMicrophoneInput(){
  // Request microphone access using getUserMedia
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  // Create a new AudioContext instance
  const audioContext = new AudioContext();

  // Create a MediaStreamAudioSourceNode from the microphone stream
  const sourceNode = audioContext.createMediaStreamSource(stream);

  // Create an AnalyserNode to analyze the audio
  const analyserNode = audioContext.createAnalyser();

  // Connect the sourceNode to the analyserNode
  sourceNode.connect(analyserNode);

  // Start the microphone input
  analyserNode.connect(audioContext.destination);
  // Now you can use the analyserNode to analyze the microphone audio data
  // ...
  console.log('done')
  return {analyserNode, audioContext};
}

const button = document.getElementById('btn')
if(!button) throw new Error('Button not found')
button.addEventListener('click', async () => {

  const {analyserNode,audioContext} = await startMicrophoneInput();


  const threshold = 100; // Adjust the threshold as needed
  const sadnessEmitter = new SadnessEventEmitter(analyserNode, threshold, audioContext);
  sadnessEmitter.startListening();
});
export {}
