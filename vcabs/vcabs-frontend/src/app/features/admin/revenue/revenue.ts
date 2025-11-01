import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-revenue',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './revenue.html',
  styleUrl: './revenue.css'
})
export class Revenue implements AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas', { static: true }) chartCanvas!: ElementRef<HTMLCanvasElement>;
  private ctx: CanvasRenderingContext2D | null = null;
  private dataPoints: number[] = [];
  private labels: string[] = [];
  private timerId: any;

  ngAfterViewInit(): void {
    this.ctx = this.chartCanvas.nativeElement.getContext('2d');
    // Seed with initial data
    for (let i = 0; i < 20; i++) {
      this.pushPoint();
    }
    this.render();
    this.timerId = setInterval(() => {
      this.pushPoint();
      this.trimTo(40);
      this.render();
    }, 1500);
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  get latestRevenue(): number {
    return this.dataPoints.length ? this.dataPoints[this.dataPoints.length - 1] : 0;
  }

  private pushPoint(): void {
    const last = this.dataPoints.length ? this.dataPoints[this.dataPoints.length - 1] : 1000;
    const next = Math.max(200, last + Math.round((Math.random() - 0.4) * 200));
    this.dataPoints.push(next);
    this.labels.push(new Date().toLocaleTimeString());
  }

  private trimTo(maxPoints: number): void {
    if (this.dataPoints.length > maxPoints) {
      this.dataPoints.splice(0, this.dataPoints.length - maxPoints);
      this.labels.splice(0, this.labels.length - maxPoints);
    }
  }

  private render(): void {
    if (!this.ctx) return;
    const canvas = this.chartCanvas.nativeElement;
    const ctx = this.ctx;
    const width = (canvas.width = canvas.clientWidth);
    const height = (canvas.height = canvas.clientHeight);

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Chart padding for axes and labels
    const paddingLeft = 48;  // room for Y labels
    const paddingRight = 12;
    const paddingTop = 12;
    const paddingBottom = 32; // room for X labels

    const plotX = (x: number) => paddingLeft + x * (width - paddingLeft - paddingRight);
    const plotY = (y: number) => paddingTop + y * (height - paddingTop - paddingBottom);

    if (this.dataPoints.length < 2) return;

    const min = Math.min(...this.dataPoints);
    const max = Math.max(...this.dataPoints);
    const range = Math.max(1, max - min);
    const innerWidth = width - paddingLeft - paddingRight;
    const innerHeight = height - paddingTop - paddingBottom;
    const stepX = innerWidth / (this.dataPoints.length - 1);

    // Grid lines and Y-axis labels
    ctx.strokeStyle = '#e5e7eb';
    ctx.fillStyle = '#6b7280';
    ctx.lineWidth = 1;
    ctx.font = '12px system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial';
    const yTicks = 5;
    for (let i = 0; i <= yTicks; i++) {
      const t = i / yTicks;
      const y = paddingTop + (1 - t) * innerHeight;
      // grid
      ctx.beginPath();
      ctx.moveTo(paddingLeft, y);
      ctx.lineTo(width - paddingRight, y);
      ctx.stroke();
      // label
      const value = min + t * range;
      const text = Math.round(value).toString();
      ctx.fillText(text, 6, y + 4);
    }

    // X-axis labels (time)
    const xLabelEvery = Math.max(1, Math.floor(this.labels.length / 6));
    this.labels.forEach((label, i) => {
      if (i % xLabelEvery !== 0 && i !== this.labels.length - 1) return;
      const x = paddingLeft + i * stepX;
      const y = height - paddingBottom + 16;
      ctx.fillText(label, x - 24, y);
    });

    // Line
    ctx.beginPath();
    ctx.strokeStyle = '#A225CC';
    ctx.lineWidth = 2;
    this.dataPoints.forEach((v, i) => {
      const x = paddingLeft + i * stepX;
      const y = paddingTop + (1 - (v - min) / range) * innerHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, 'rgba(162, 37, 204, 0.25)');
    gradient.addColorStop(1, 'rgba(162, 37, 204, 0)');
    ctx.fillStyle = gradient;
    ctx.lineTo(width - paddingRight, height - paddingBottom);
    ctx.lineTo(paddingLeft, height - paddingBottom);
    ctx.closePath();
    ctx.fill();

    // Axes lines
    ctx.strokeStyle = '#9ca3af';
    ctx.beginPath();
    // Y axis
    ctx.moveTo(paddingLeft, paddingTop);
    ctx.lineTo(paddingLeft, height - paddingBottom);
    // X axis
    ctx.moveTo(paddingLeft, height - paddingBottom);
    ctx.lineTo(width - paddingRight, height - paddingBottom);
    ctx.stroke();
  }
}


