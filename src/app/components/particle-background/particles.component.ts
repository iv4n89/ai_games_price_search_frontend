import { Component, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.2; 
    this.vy = (Math.random() - 0.5) * 0.2;
    this.size = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.3 + 0.1;
    this.color = Math.random() > 0.8 ? '188, 19, 254' : '255, 255, 255';
  }

  update(width: number, height: number) {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0) this.x = width;
    if (this.x > width) this.x = 0;
    if (this.y < 0) this.y = height;
    if (this.y > height) this.y = 0;
  }
}

@Component({
  selector: 'app-particle-bg',
  standalone: true,
  imports: [CommonModule],
  template: `
    <canvas #bgCanvas class="fixed inset-0 w-full h-full pointer-events-none bg-[#050505]"></canvas>
  `,
  styles: [`
    :host {
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      pointer-events: none;
    }
  `]
})
export class ParticleBgComponent implements AfterViewInit, OnDestroy {
  @ViewChild('bgCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private animationFrameId!: number;
  private particles: Particle[] = [];

  ngAfterViewInit() {
    this.initParticles();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  initParticles() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();
    this.particles = Array.from({ length: 80 }, () => new Particle(canvas.width, canvas.height));
    this.animate();
  }

  resizeCanvas() {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  animate() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.particles.forEach(p => {
      p.update(canvas.width, canvas.height);
      this.ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
      this.ctx.fillRect(p.x, p.y, p.size, p.size);
    });
    this.animationFrameId = requestAnimationFrame(() => this.animate());
  }
}