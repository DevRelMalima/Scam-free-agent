import { Component, signal, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

export interface AnalysisResult {
  status: 'Safe' | 'Suspicious' | 'Scam';
  reasoning: string;
  advice: string;
  flags: string[];
}

@Component({
  selector: 'app-scam-checker',
  imports: [ReactiveFormsModule, MatIconModule],
  template: `
    <div [class.dark]="isDarkMode()">
      <div class="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-8 sm:py-12 lg:px-8 font-sans flex flex-col overflow-x-hidden text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <div class="mx-auto w-full max-w-4xl flex-grow flex flex-col">
          
          <!-- Header -->
          <header class="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-slate-300 dark:border-slate-800 pb-6 mb-8 gap-4">
            <div>
              <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white underline decoration-indigo-600 dark:decoration-indigo-500 decoration-4 underline-offset-8">Scam-Free Agent</h1>
              <p class="text-base sm:text-lg font-medium text-slate-600 dark:text-slate-400 mt-4 sm:mt-2 max-w-xl">
                Your AI-Powered Social Guardian
              </p>
            </div>
            <div class="flex items-center gap-4 sm:gap-8 text-sm sm:text-base font-semibold text-slate-600 dark:text-slate-400">
              <button (click)="isDarkMode.set(!isDarkMode())" class="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors focus:outline-none flex items-center justify-center">
                <mat-icon>{{ isDarkMode() ? 'light_mode' : 'dark_mode' }}</mat-icon>
              </button>
              <span class="text-indigo-700 dark:text-indigo-400 underline decoration-2 underline-offset-4">Verification</span>
              <span class="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors hidden sm:block">Logs</span>
              <span class="hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors hidden sm:block">Settings</span>
            </div>
          </header>

        <!-- Main Grid Layout -->
        <main class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 flex-grow">
          
          <!-- Input Panel (Left Column on Desktop) -->
          <section class="lg:col-span-5 flex flex-col gap-6">
            <div class="bg-white dark:bg-slate-900 border rounded-2xl border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-md flex flex-col gap-6 h-full">
              
              <div class="space-y-3 pb-4">
                <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Verify Communications</h2>
                <p class="text-base text-slate-600 dark:text-slate-400">Paste content or upload voice notes to analyze for deceptive intent.</p>
              </div>

              <!-- Tabs -->
              <div class="flex gap-2 border-b-2 border-slate-100 dark:border-slate-800 pb-0">
                <button 
                  (click)="activeTab.set('text')"
                  [class.bg-indigo-50]="activeTab() === 'text'"
                  [class.text-indigo-700]="activeTab() === 'text'"
                  [class.border-indigo-600]="activeTab() === 'text'"
                  [class.dark:bg-indigo-900/30]="activeTab() === 'text'"
                  [class.dark:text-indigo-300]="activeTab() === 'text'"
                  [class.dark:border-indigo-500]="activeTab() === 'text'"
                  [class.bg-slate-50]="activeTab() !== 'text'"
                  [class.text-slate-600]="activeTab() !== 'text'"
                  [class.border-transparent]="activeTab() !== 'text'"
                  [class.dark:bg-slate-800/50]="activeTab() !== 'text'"
                  [class.dark:text-slate-400]="activeTab() !== 'text'"
                  class="flex-1 py-4 px-4 text-sm sm:text-base font-bold border-b-4 rounded-t-lg transition-colors flex items-center justify-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <mat-icon class="text-[20px]! h-[20px]! w-[20px]!">chat</mat-icon>
                  Text Message
                </button>
                <button 
                  (click)="activeTab.set('audio')"
                  [class.bg-indigo-50]="activeTab() === 'audio'"
                  [class.text-indigo-700]="activeTab() === 'audio'"
                  [class.border-indigo-600]="activeTab() === 'audio'"
                  [class.dark:bg-indigo-900/30]="activeTab() === 'audio'"
                  [class.dark:text-indigo-300]="activeTab() === 'audio'"
                  [class.dark:border-indigo-500]="activeTab() === 'audio'"
                  [class.bg-slate-50]="activeTab() !== 'audio'"
                  [class.text-slate-600]="activeTab() !== 'audio'"
                  [class.border-transparent]="activeTab() !== 'audio'"
                  [class.dark:bg-slate-800/50]="activeTab() !== 'audio'"
                  [class.dark:text-slate-400]="activeTab() !== 'audio'"
                  class="flex-1 py-4 px-4 text-sm sm:text-base font-bold border-b-4 rounded-t-lg transition-colors flex items-center justify-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-700 dark:hover:text-indigo-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <mat-icon class="text-[20px]! h-[20px]! w-[20px]!">mic</mat-icon>
                  Voice Note
                </button>
              </div>

              <div class="flex-grow flex flex-col gap-4 mt-2">
                @if (activeTab() === 'text') {
                  <div class="flex flex-col gap-3">
                    <label for="message" class="text-base font-bold text-slate-700 dark:text-slate-300">Message Content</label>
                    <textarea 
                      id="message"
                      [formControl]="textControl"
                      rows="7"
                      class="w-full bg-white dark:bg-slate-950 border-2 border-slate-300 dark:border-slate-700 rounded-xl p-4 sm:p-5 text-base sm:text-lg text-slate-900 dark:text-slate-100 leading-relaxed placeholder:text-slate-500 dark:placeholder:text-slate-500 focus:outline-none focus:border-indigo-600 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-600/20 dark:focus:ring-indigo-500/20 transition-all font-sans resize-none shadow-inner"
                      placeholder="e.g. 'Hey, I'm in trouble and need you to wire me $500 ASAP...'">
                    </textarea>
                  </div>
                } @else {
                  <div class="flex flex-col gap-3 flex-grow">
                    <span class="text-base font-bold text-slate-700 dark:text-slate-300 block">
                      Voice Recording
                    </span>
                    <div class="mt-2 flex flex-col items-center justify-center flex-grow bg-slate-50 dark:bg-slate-950 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-8">
                      @if (!audioUrl()) {
                        <button 
                          (click)="toggleRecording()"
                          [class.bg-red-600]="isRecording()"
                          [class.hover:bg-red-700]="isRecording()"
                          [class.bg-indigo-600]="!isRecording()"
                          [class.hover:bg-indigo-700]="!isRecording()"
                          [class.dark:bg-indigo-500]="!isRecording()"
                          [class.dark:hover:bg-indigo-600]="!isRecording()"
                          class="inline-flex items-center justify-center text-white w-24 h-24 rounded-full shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/50 hover:scale-105 active:scale-95">
                          <mat-icon class="text-4xl! h-10! w-10!">{{ isRecording() ? 'stop' : 'mic' }}</mat-icon>
                        </button>
                        <p class="mt-6 text-base font-bold text-slate-600 dark:text-slate-400 text-center" [class.animate-pulse]="isRecording()">
                          {{ isRecording() ? 'Recording in progress... Tap to stop.' : 'Tap the microphone to start' }}
                        </p>
                      } @else {
                        <div class="w-full border-2 border-indigo-200 dark:border-indigo-900/50 p-5 rounded-2xl flex flex-col items-center gap-4 bg-white dark:bg-slate-900 shadow-sm">
                          <div class="flex items-center justify-between w-full border-b border-indigo-50 dark:border-slate-800 pb-3">
                            <div class="flex items-center gap-3">
                              <div class="w-3 h-3 rounded-full bg-indigo-500 animate-pulse"></div>
                              <span class="text-sm sm:text-base font-bold text-indigo-900 dark:text-indigo-300">audio_clip.wav</span>
                            </div>
                            <span class="text-xs font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/40 px-3 py-1 rounded-full uppercase tracking-wider">Ready</span>
                          </div>
                          <audio [src]="audioUrl()" controls class="w-full h-14 rounded-lg bg-indigo-50/50 dark:bg-indigo-900/20"></audio>
                        </div>
                        <button 
                          (click)="clearAudio()"
                          class="mt-6 px-6 py-3 rounded-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 text-base font-bold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-800 dark:hover:text-red-300 flex items-center gap-2 transition-colors focus:outline-none focus:ring-4 focus:ring-red-500/50">
                          <mat-icon class="text-[20px]! h-[20px]! w-[20px]!">delete_outline</mat-icon>
                          Discard Recording
                        </button>
                      }
                    </div>
                  </div>
                }

                @if (error()) {
                  <div class="mt-4 bg-red-50 dark:bg-red-900/20 p-4 border-l-4 border-red-500 dark:border-red-600 rounded-r-xl shadow-sm">
                    <div class="flex items-center">
                      <mat-icon class="text-red-500 dark:text-red-400 text-[24px]! h-[24px]! w-[24px]! mr-3">error</mat-icon>
                      <div class="text-sm sm:text-base font-medium text-red-800 dark:text-red-300 leading-tight">
                        {{ error() }}
                      </div>
                    </div>
                  </div>
                }
              </div>

              <div class="mt-4 text-center">
                <button 
                  (click)="analyze()"
                  [disabled]="isAnalyzing() || (!textControl.value.trim() && !base64Audio())"
                  class="w-full py-5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg hover:bg-indigo-700 dark:hover:bg-indigo-50 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:text-slate-400 dark:disabled:text-slate-500 disabled:cursor-not-allowed transition-all focus:outline-none focus:ring-4 focus:ring-indigo-500/50 flex items-center justify-center gap-3 shadow-md active:scale-[0.98]">
                  @if (isAnalyzing()) {
                    <mat-icon class="animate-spin text-[24px]! h-[24px]! w-[24px]!">auto_renew</mat-icon>
                    Analyzing... Please wait
                  } @else {
                    <mat-icon class="text-[24px]! h-[24px]! w-[24px]!">shield</mat-icon>
                    Analyze for Scams
                  }
                </button>
              </div>
            </div>
          </section>

          <!-- Results Section (Right Column on Desktop) -->
          <section class="lg:col-span-7 flex flex-col gap-6">
            @if (!result() && !isAnalyzing()) {
              <div class="hidden lg:flex bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 shadow-inner flex-col items-center justify-center h-full text-center">
                <div class="bg-white dark:bg-slate-800 p-6 rounded-full shadow-sm mb-6">
                  <mat-icon class="text-slate-400 dark:text-slate-500 text-6xl! h-16! w-16!">analytics</mat-icon>
                </div>
                <h3 class="text-slate-700 dark:text-slate-200 text-xl font-bold">Ready to Analyze</h3>
                <p class="text-slate-500 dark:text-slate-400 text-base mt-2 max-w-md leading-relaxed">Provide text or record an audio message in the panel on the left. We will scan it for warning signs.</p>
              </div>
            }

            @if (isAnalyzing()) {
              <div class="bg-indigo-50 dark:bg-indigo-900/10 text-indigo-900 dark:text-indigo-100 p-8 rounded-2xl flex flex-col items-center justify-center shadow-inner border border-indigo-100 dark:border-indigo-900/30 h-full min-h-[400px]">
                <div class="relative w-24 h-24 mb-8">
                  <svg class="w-full h-full transform -rotate-90 animate-spin">
                    <circle cx="48" cy="48" r="42" stroke="currentColor" class="opacity-20" stroke-width="8" fill="transparent" />
                    <circle cx="48" cy="48" r="42" stroke="currentColor" class="text-indigo-600 dark:text-indigo-400" stroke-width="8" fill="transparent" stroke-dasharray="264" stroke-dashoffset="200" stroke-linecap="round" />
                  </svg>
                  <div class="absolute inset-0 flex items-center justify-center">
                    <mat-icon class="text-indigo-600 dark:text-indigo-400 text-3xl! h-8! w-8!">memory</mat-icon>
                  </div>
                </div>
                <h3 class="text-indigo-800 dark:text-indigo-200 text-xl font-bold">Examining message...</h3>
                <p class="text-indigo-600 dark:text-indigo-400 text-base mt-3 animate-pulse font-medium">Looking for common scam patterns</p>
              </div>
            }

            @if (result() && !isAnalyzing()) {
              <!-- Detailed Analysis -->
              <div class="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-2xl flex flex-col gap-8 shadow-lg border border-slate-200 dark:border-slate-800 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
                
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-slate-100 dark:border-slate-800 pb-6 gap-4">
                  <div class="flex items-center gap-5">
                    <div class="w-4 h-16 rounded-full {{ getStatusConfig(result()!.status).bgIndicatorClass }}"></div>
                    <div>
                      <h2 class="text-3xl font-extrabold {{ getStatusConfig(result()!.status).themeDarkClass }} uppercase tracking-widest">
                        {{ result()!.status }}
                      </h2>
                      <p class="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mt-1">
                        AI Assessment Result
                      </p>
                    </div>
                  </div>
                  <span class="text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-full text-xs sm:text-sm font-mono font-medium border border-slate-200 dark:border-slate-700 shadow-inner hidden sm:block">Ref: #SFX-99102-X</span>
                </div>

                <div class="space-y-8">
                  <div class="flex flex-col gap-4">
                    <h3 class="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <mat-icon class="text-[20px]! h-[20px]! w-[20px]!">subject</mat-icon>
                      Why We Think This
                    </h3>
                    <p class="text-base sm:text-lg font-medium text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm">{{ result()!.reasoning }}</p>
                  </div>

                  @if (result()!.flags.length > 0) {
                    <div class="flex flex-col gap-4">
                      <h3 class="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-widest flex items-center gap-2">
                        <mat-icon class="text-[20px]! h-[20px]! w-[20px]!">flag</mat-icon>
                        Red Flags We Noticed
                      </h3>
                      <div class="space-y-4 bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border border-red-100 dark:border-red-900/30 shadow-sm">
                        @for (flag of result()!.flags; track flag) {
                          <div class="flex items-start gap-4 bg-white dark:bg-slate-900 p-3 rounded-lg border border-red-50 dark:border-red-900/50 shadow-sm">
                            <mat-icon class="text-red-500 dark:text-red-400 text-[24px]! h-[24px]! w-[24px]! flex-shrink-0">warning</mat-icon>
                            <span class="text-base text-red-900 dark:text-red-200 font-medium leading-tight py-0.5">{{ flag }}</span>
                          </div>
                        }
                      </div>
                    </div>
                  }

                  <div class="flex flex-col gap-4">
                    <h3 class="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                      <mat-icon class="text-[20px]! h-[20px]! w-[20px]!">verified_user</mat-icon>
                      What You Should Do Next
                    </h3>
                    <div class="bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-200 dark:border-emerald-900/50 p-6 sm:p-8 rounded-xl text-emerald-950 dark:text-emerald-100 text-base sm:text-lg font-bold flex items-start gap-4 shadow-sm">
                      <mat-icon class="text-emerald-500 dark:text-emerald-400 text-[32px]! h-[32px]! w-[32px]! flex-shrink-0">lightbulb</mat-icon>
                      <p class="leading-relaxed">{{ result()!.advice }}</p>
                    </div>
                  </div>
                </div>

              </div>
            }
          </section>
        </main>

        <!-- Footer Status Bar -->
        <footer class="mt-12 flex justify-between items-center font-medium text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-8 pb-4">
          <div class="flex gap-6">
            <span class="flex items-center gap-3 text-sm sm:text-base">
              <div class="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div> 
              AI Core Online
            </span>
          </div>
          <div class="text-slate-600 dark:text-slate-400 hidden sm:block text-right text-sm">
            <strong class="dark:text-slate-300">Safety first:</strong> Never share verification codes or private keys.
          </div>
        </footer>

      </div>
    </div>
  `
})
export class ScamCheckerComponent implements OnDestroy {
  activeTab = signal<'text' | 'audio'>('text');
  isDarkMode = signal(false);
  textControl = new FormControl('', { nonNullable: true });
  
  isRecording = signal(false);
  base64Audio = signal<string | null>(null);
  audioMimeType = signal<string | null>(null);
  audioUrl = signal<string | null>(null);
  
  isAnalyzing = signal(false);
  result = signal<AnalysisResult | null>(null);
  error = signal('');

  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];

  ngOnDestroy() {
    this.clearAudio();
  }

  async toggleRecording() {
    if (this.isRecording()) {
      this.stopRecording();
    } else {
      await this.startRecording();
    }
  }

  private async startRecording() {
    this.error.set('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = async () => {
        const type = this.mediaRecorder?.mimeType || 'audio/webm';
        const audioBlob = new Blob(this.audioChunks, { type });
        const url = URL.createObjectURL(audioBlob);
        this.audioUrl.set(url);
        
        // Convert to Base64 for API
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = (reader.result as string).split(',')[1];
          this.base64Audio.set(base64data);
          this.audioMimeType.set(type);
        };
        reader.readAsDataURL(audioBlob);
      };

      this.mediaRecorder.start();
      this.isRecording.set(true);
    } catch (err) {
      console.error('Microphone access error:', err);
      this.error.set('Could not access microphone. Please ensure permissions are granted.');
    }
  }

  private stopRecording() {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
      this.isRecording.set(false);
    }
  }

  clearAudio() {
    if (this.audioUrl()) {
      URL.revokeObjectURL(this.audioUrl()!);
      this.audioUrl.set(null);
      this.base64Audio.set(null);
      this.audioMimeType.set(null);
    }
    this.error.set('');
  }

  async analyze() {
    this.error.set('');
    this.result.set(null);
    this.isAnalyzing.set(true);

    const payload: { text?: string; audioBase64?: string; mimeType?: string } = {};
    if (this.activeTab() === 'text') {
      const text = this.textControl.value?.trim();
      if (!text) {
        this.error.set('Please enter a message to analyze.');
        this.isAnalyzing.set(false);
        return;
      }
      payload.text = text;
    } else {
      if (!this.base64Audio()) {
        this.error.set('Please record an audio snippet to analyze.');
        this.isAnalyzing.set(false);
        return;
      }
      payload.audioBase64 = this.base64Audio() as string;
      payload.mimeType = this.audioMimeType() as string;
    }

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json();
      if (data.result) {
        this.result.set(data.result);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error(err);
      this.error.set('An error occurred while analyzing the content. Please try again.');
    } finally {
      this.isAnalyzing.set(false);
    }
  }

  getStatusConfig(status: string) {
    switch (status) {
      case 'Safe':
        return {
          bgIndicatorClass: 'bg-emerald-500',
          themeDarkClass: 'text-emerald-700 dark:text-emerald-400'
        };
      case 'Suspicious':
        return {
          bgIndicatorClass: 'bg-amber-500',
          themeDarkClass: 'text-amber-700 dark:text-amber-400'
        };
      case 'Scam':
        return {
          bgIndicatorClass: 'bg-red-500',
          themeDarkClass: 'text-red-700 dark:text-red-400'
        };
      default:
        return {
          bgIndicatorClass: 'bg-slate-500',
          themeDarkClass: 'text-slate-700 dark:text-slate-300'
        };
    }
  }
}
