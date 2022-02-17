import { Component, OnInit } from '@angular/core';
import { timer, Observable } from "rxjs";
import { HttpService } from '../core/_services/http-service';
import { environment } from '../../environments/environment';

declare var webkitSpeechRecognition: any;
interface Audio {
  filename?: string,
  src?: string
}
@Component({
  selector: 'app-capture-voice',
  templateUrl: './capture-voice.component.html',
  styleUrls: ['./capture-voice.component.css']
})
export class CaptureVoiceComponent implements OnInit {

  micOff: boolean = false;
  micOn: boolean = true;
  recorder: any
  audio: any
  listenStatus: boolean = false;
  final: string = '';
  interim: string = '';
  speechRecognition: any
  countDown: any;
  counter = 0;
  tick = 1000;
  playButton = true;
  pauseButton = false;
  apiUrl = '';
  allAudioFiles: Audio[] = []

  constructor(
    private httpService: HttpService,
  ) {
    this.apiUrl = environment.apiURL;
  }

  ngOnInit(): void {
    this.speechToText()
  }

  speechToText(){
    if ("webkitSpeechRecognition" in window) {
      this.speechRecognition = new webkitSpeechRecognition();

      let final_transcript = "";

      this.speechRecognition.continuous = true;
      // this.speechRecognition.interimResults = true;
      this.speechRecognition.lang = 'en-US';
      this.speechRecognition.interimResults = false;
      this.speechRecognition.maxAlternatives = 1;


      this.speechRecognition.onstart = () => {
        this.listenStatus = true;
      };
      this.speechRecognition.onerror = () => {
        this.listenStatus = false;
        console.log("Speech Recognition Error");
      };
      this.speechRecognition.onend = () => {
        this.listenStatus = false;
        console.log("Speech Recognition Ended");
      };

      this.speechRecognition.onresult = (event: any) => {
        // console.log(event.results)
        // console.log(this.listenStatus)
        let interim_transcript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final_transcript += event.results[i][0].transcript;
          } else {
            interim_transcript += event.results[i][0].transcript;
          }
        }
        this.final = final_transcript;
        this.interim = interim_transcript;
      };
    } else {
      console.log("Speech Recognition Not Available");
    }
  }

  async record() {
    this.countDown = timer(0, this.tick).subscribe(() => this.counter++);
    if (!this.recorder) {
      this.recorder = await this.recordAudio();
    }
    this.listenStatus = true;
    this.micOn = false;
    this.micOff = true;
    // console.log(this.recorder)
    this.recorder.start();
    this.speechRecognition.start();
  }

  async stop() {
    this.countDown.unsubscribe();
    // console.log(this.countDown)
    this.listenStatus = false;
    this.micOn = true;
    this.micOff = false;
    this.audio = await this.recorder.stop();
    this.speechRecognition.stop();
  }

  recordAudio = () =>
    new Promise(async resolve => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      let audioChunks: any[] = [];

      mediaRecorder.addEventListener('dataavailable', event => {
        audioChunks.push(event.data);
        console.log({ audioChunks })
      });

      console.log(audioChunks)

      const start = () => {
        audioChunks = [];
        mediaRecorder.start();
        console.log("ends")
      };

      const stop = () =>
        new Promise(resolve => {
          mediaRecorder.addEventListener('stop', () => {
            console.log("stop the code")
            const audioBlob = new Blob(audioChunks, { type: 'audio/mpeg' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            const play = () => audio.play();
            const pause = () => audio.pause();
            resolve({ audioChunks, audioBlob, audioUrl, play, pause });
          });

          mediaRecorder.stop();
        });

      resolve({ start, stop });
    });

  play() {
    this.playButton = false;
    this.pauseButton = true;
    this.audio.play();
  }

  pause(){
    this.playButton = true;
    this.pauseButton = false;
    this.audio.pause();
  }

  send() {
    const reader: any = new FileReader();
    reader.readAsDataURL(this.audio.audioBlob);
    reader.onload = () => {
      const base64AudioMessage = reader.result.split(',')[1];
      this.httpService.post('messages',
        {
          headers: { 'Content-Type': 'application/json' },
          message: base64AudioMessage
        }
      ).subscribe((data: any) => {
        console.log(data)
        this.counter = 0
        this.audio = ''
        this.final = this.interim = ''
        this.list()
      });
    };
  }

  list() {
    this.httpService.get('messages',
      {
        headers: { 'Content-Type': 'application/json' }
      }
    ).subscribe((res: any) => {
      if (res.messageFilenames.length) {

        return res.messageFilenames.forEach((filename: string) => {
          let audioElement: any = document.querySelector(`[data-audio-filename="${filename}"]`);
          console.log(audioElement)
          if (!audioElement) {
            this.allAudioFiles.push({
              filename: filename,
              src: `${this.apiUrl}messages/${filename}`
            });
          }
        });
      }
    });
  }

  ngOnDestroy() {
    this.countDown.unsubscribe();
  }

  reset(){
    this.final = this.interim = ''
    this.counter = 0
  }
}
