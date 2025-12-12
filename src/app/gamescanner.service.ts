import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GameCandidate {
  title: string;
  platform: string;
  condition_guess: string;
}

export interface IdentificationResponse {
  found: boolean;
  multiple_detected: boolean;
  candidates: GameCandidate[];
  data: {
    title: string;
    platform: string;
    region_guess: string;
    condition_guess: string;
    confidence_notes: string;
  };
}

export interface AppraisalRequest {
  title: string;
  platform: string;
  region: string;
  condition: string;
}

export interface AppraisalResponse {
  currency: string;
  price_low: number;
  price_high: number;
  price_median: number;
  trend: string;
  source_data: {
    name: string;
    items_analyzed: number;
  };
  explanation: string;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = 'http://localhost:3000/api'; 

  constructor(private http: HttpClient) {}

  identifyGame(file: File): Observable<IdentificationResponse> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post<IdentificationResponse>(`${this.apiUrl}/identify`, formData);
  }

  getAppraisal(data: AppraisalRequest): Observable<AppraisalResponse> {
    return this.http.post<AppraisalResponse>(`${this.apiUrl}/appraise`, data);
  }
}