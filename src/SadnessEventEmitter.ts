interface SadnessChangeEvent {
  isSad: boolean;
  intensity: number;
}

export class SadnessEventEmitter {
  private isSad: boolean;
  private previousIntensity: number;

  constructor(private analyser: AnalyserNode, private threshold: number, private audioContext: AudioContext, private sourceNode: MediaStreamAudioSourceNode) {
    this.isSad = false;
    this.previousIntensity = 0;
  }

  public async startListening() {
    const scriptURL = new URL(`${window.location.href}/workers/AudioWorkletExample.js`);

    // Derive the URL for the audio worklet file
    const audioWorkletURL = scriptURL.href;
    console.log({ audioWorkletURL });
    await this.audioContext.audioWorklet.addModule(audioWorkletURL);
    const workletNode = new AudioWorkletNode(this.audioContext, 'AudioWorkletExample');
    workletNode.port.onmessage = (event) => {
      console.log('message from worklet', event);
    };
    this.sourceNode.connect(workletNode);
    workletNode.connect(this.audioContext.destination);
  }

  private analyze(dataArray: Uint8Array): void {
    this.analyser.getByteFrequencyData(dataArray);
    const intensity = this.calculateIntensity(dataArray);

    if (this.isSad) {
      if (intensity < this.threshold && intensity < this.previousIntensity) {
        this.isSad = false;
        const event: SadnessChangeEvent = {
          isSad: this.isSad,
          intensity: intensity
        };
        this.emitSadnessChangeEvent(event);
      }
    } else {
      if (intensity >= this.threshold && intensity > this.previousIntensity) {
        this.isSad = true;
        const event: SadnessChangeEvent = {
          isSad: this.isSad,
          intensity: intensity
        };
        this.emitSadnessChangeEvent(event);
      }
    }

    this.previousIntensity = intensity;
    requestAnimationFrame(() => this.analyze(dataArray));
  }

  private calculateIntensity(dataArray: Uint8Array): number {
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    return sum / dataArray.length;
  }

  private emitSadnessChangeEvent(event: SadnessChangeEvent): void {
    // You can implement your own event emission mechanism here.
    // This could be using a library like EventEmitter or by defining your own custom event system.
    // Here, we'll just log the event for demonstration purposes.
    console.log("Sadness Change Event:", event);
  }
}
