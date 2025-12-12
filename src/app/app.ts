import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService, AppraisalResponse, AppraisalRequest, GameCandidate } from './gamescanner.service';
import { ParticleBgComponent } from './components/particle-background/particles.component';

// Importamos los nuevos componentes hijos
import { UploadComponent } from './components/upload/upload.component';
import { ScanningComponent } from './components/scanning/scanning.component';
import { SelectionComponent } from './components/selection/selection.component';
import { VerifyComponent } from './components/verify/verify.component';
import { ResultComponent } from './components/result/result.component';

type AppStep = 'upload' | 'scanning' | 'selection' | 'verify' | 'result' | 'error';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    ParticleBgComponent,
    UploadComponent,
    ScanningComponent,
    SelectionComponent,
    VerifyComponent,
    ResultComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  step: AppStep = 'upload';
  scanningMessage = 'INICIANDO SENSORES...';
  previewImage: string | null = null;
  isLoading = false;

  candidates: GameCandidate[] = [];
  
  formData: AppraisalRequest = {
    title: '',
    platform: '',
    region: 'PAL ESP',
    condition: 'CIB'
  };

  resultData: AppraisalResponse | null = null;

  constructor(
    private gameService: GameService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  onFileSelected(file: File) {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.ngZone.run(() => {
          this.previewImage = e.target?.result as string;
          this.cdr.detectChanges();
        });
      };
      reader.readAsDataURL(file);

      this.step = 'scanning';
      this.scanningMessage = 'IDENTIFICANDO JUEGO...';
      
      this.gameService.identifyGame(file).subscribe({
        next: (res) => {
          this.ngZone.run(() => {
            console.log('API Response:', res);
            if (res && res.multiple_detected && res.candidates && res.candidates.length > 0) {
              this.candidates = res.candidates;
              this.step = 'selection';
            } else if (res && res.found && res.data) {
              this.populateForm(res.data);
              this.step = 'verify';
            } else {
              alert('No se detectó ningún juego claro. Intenta otra foto.');
              this.step = 'upload';
            }
            this.cdr.detectChanges();
          });
        },
        error: (err) => {
          this.ngZone.run(() => {
            console.error('API Error:', err);
            this.step = 'upload';
            alert('Error conectando con la IA');
            this.cdr.detectChanges();
          });
        }
      });
    }
  }

  selectCandidate(candidate: GameCandidate) {
    this.formData.title = candidate.title;
    this.formData.platform = candidate.platform;
    if (candidate.condition_guess) this.formData.condition = candidate.condition_guess;
    this.step = 'verify';
  }

  populateForm(data: any) {
    this.formData.title = data.title;
    this.formData.platform = data.platform;
    if (data.region_guess !== 'UNKNOWN') this.formData.region = data.region_guess;
    if (data.condition_guess) this.formData.condition = data.condition_guess;
  }

  submitForAppraisal() {
    this.isLoading = true;
    this.gameService.getAppraisal(this.formData).subscribe({
      next: (res) => {
        this.ngZone.run(() => {
          this.resultData = res;
          this.step = 'result';
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          alert('Error tasando el juego');
          this.isLoading = false;
          this.cdr.detectChanges();
        });
      }
    });
  }

  reset() {
    this.step = 'upload';
    this.previewImage = null;
    this.resultData = null;
    this.formData = { title: '', platform: '', region: 'PAL ESP', condition: 'CIB' };
  }
}