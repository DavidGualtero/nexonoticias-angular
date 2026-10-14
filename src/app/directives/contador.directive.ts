import { AfterViewInit, Directive, ElementRef, OnDestroy, inject, input } from '@angular/core';

/**
 * Directiva de atributo: anima un número desde 0 hasta `appContador`
 * cuando el elemento entra en pantalla. Respeta "movimiento reducido".
 * Uso: <strong [appContador]="1.2" [decimales]="1" sufijo="M+">1.2M+</strong>
 */
@Directive({ selector: '[appContador]' })
export class ContadorDirective implements AfterViewInit, OnDestroy {
  readonly meta = input.required<number>({ alias: 'appContador' });
  readonly decimales = input(0);
  readonly sufijo = input('');

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private observador?: IntersectionObserver;

  ngAfterViewInit(): void {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    this.observador = new IntersectionObserver(
      (entradas) => {
        if (entradas.some((e) => e.isIntersecting)) {
          this.observador?.disconnect();
          this.animar();
        }
      },
      { threshold: 0.6 },
    );
    this.observador.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observador?.disconnect();
  }

  private animar(): void {
    const inicio = performance.now();
    const duracion = 1200;
    const paso = (ahora: number) => {
      const progreso = Math.min((ahora - inicio) / duracion, 1);
      const suavizado = 1 - Math.pow(1 - progreso, 3);
      this.el.nativeElement.textContent = (this.meta() * suavizado).toFixed(this.decimales()) + this.sufijo();
      if (progreso < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  }
}
