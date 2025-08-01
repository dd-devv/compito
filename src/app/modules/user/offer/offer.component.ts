import { CommonModule, CurrencyPipe, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { Skeleton } from 'primeng/skeleton';
import { ExtractDomainPipe } from '../../../pipes/extract-domain.pipe';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import ProductService from '../services/product.service';
import { switchMap, tap } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser'; // Importamos Meta y Title
import { TimeAgoPipe } from './../../../pipes/timeAgo.pipe';
import { Button } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import AuthService from '../../auth/services/auth.service';
import { Toast } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { SkeletonProdComponent } from '../../../ui/skeleton-prod/skeleton-prod.component';
import { CardModule } from 'primeng/card';
import { ViewService } from '../../../services/view.service';
import { BuyService } from '../../../services/buy.service';


@Component({
  selector: 'app-offer',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    Button,
    ChartModule,
    Skeleton,
    ExtractDomainPipe,
    TimeAgoPipe,
    ConfirmDialog,
    Toast,
    TableModule,
    SkeletonProdComponent,
    CardModule,
    RouterLink
  ],
  providers: [ConfirmationService, MessageService],
  styleUrl: './offer.component.css',
  templateUrl: './offer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OfferComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);
  productService = inject(ProductService);
  authService = inject(AuthService);
  viewService = inject(ViewService);
  buyService = inject(BuyService);
  router = inject(Router);
  private meta = inject(Meta); // Inyectamos el servicio Meta
  private title = inject(Title); // Inyectamos el servicio Title
  private document = inject(DOCUMENT);

  isLoading = this.productService.isLoading;
  isLoadingEqual = this.productService.isLoadingEqual;
  isLoadingRec = this.productService.isLoadingRec;

  productsEqual = this.productService.productsEqual;
  productsRec = this.productService.productsRecommended;

  // Signal para almacenar el id
  productId = signal<string | null>(null);
  data: any;
  options: any;
  platformId = inject(PLATFORM_ID);
  urlId: string = '';

  estadosOfertas = signal<{ [key: string]: boolean }>({});

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      tap(params => {
        const id = params.get('urlId');
        this.productId.set(id);

        // Añadir canonical URL temprano
        this.updateCanonicalUrl(id!);
        this.cargarEstadoJobs(id!);
      }),
      switchMap(() => {
        const id = this.productId() ?? '';
        this.loadProductsEqual(id);
        this.loadProductsRecommended(id);
        return this.productService.getPriceHistory(id);
      }),
      tap(response => {
        if (response && response.priceHistory) {
          this.updateChart(response.priceHistory);

          if (response.productInfo) {
            this.updateMetaTags(response.productInfo);
            // Añadir structured data
            this.addStructuredData(response.productInfo);
            this.insertViewResult(response.productInfo._id);
          }
        }
      })
    ).subscribe();

    this.initChart();
  }

  insertViewResult(resultId: string) {
    this.viewService.insertView(resultId, 'Ofertas').subscribe();
  }

  insertBuyResult(resultId: string, url: string) {
    this.buyService.insertBuy(resultId, url).subscribe();
  }

  // loadProductsEqual(id: string) {
  //   this.productService.getProductsEqual(id).subscribe({
  //     error: (err) => {
  //       console.error('Error loading products:', err);
  //     }
  //   });
  // }
  loadProductsEqual(id: string) {
    this.productService.getProductsEqual(id).subscribe({
      next: (products) => {
        // Ordenar los productos por precio de menor a mayor
        const sortedProducts = [...products].sort((a, b) => a.currentPrice - b.currentPrice);
        this.productService.productsEqual.set(sortedProducts);
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }

  loadProductsRecommended(id: string) {
    this.productService.getProductsRecommended(id).subscribe({
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }

  private updateMetaTags(productInfo: any): void {
    if (!productInfo) return;

    const cleanTitle = `${productInfo.title} - Monitoreo de Precios | Compito`;
    const description = productInfo.description ?
      `Monitorea el precio de ${productInfo.title}. ${productInfo.description.slice(0, 120)}...` :
      `Monitoreo de precios y alertas de WhatsApp para ${productInfo.title} en Compito`;

    // Meta tags básicas
    this.title.setTitle(cleanTitle);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: `${productInfo.title}, monitoreo precios, alertas WhatsApp, seguimiento precios` });

    // Robots específicos para esta página
    this.meta.updateTag({ name: 'robots', content: 'index, follow, max-image-preview:large' });

    // Open Graph
    this.meta.updateTag({ property: 'og:title', content: cleanTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: productInfo.image || 'https://compito.pe/assets/og-default.png' });
    this.meta.updateTag({ property: 'og:url', content: `https://compito.pe/ofertas/${this.productId()}` });
    this.meta.updateTag({ property: 'og:type', content: 'product' });
    this.meta.updateTag({ property: 'og:site_name', content: 'Compito' });

    // Twitter Cards
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:site', content: '@Compito' }); // si tienes Twitter
    this.meta.updateTag({ name: 'twitter:title', content: cleanTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: productInfo.image || 'https://compito.pe/assets/twitter-default.png' });

    this.cd.markForCheck();
  }

  // Método adicional para canonical URL
  private updateCanonicalUrl(productId: string): void {
    const canonicalUrl = `https://compito.pe/ofertas/${productId}`;

    // Remover canonical existente si existe
    const existingCanonical = this.document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // Añadir nuevo canonical
    const link = this.document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', canonicalUrl);
    this.document.head.appendChild(link);
  }

  // Structured Data para mejor SEO
  private addStructuredData(productInfo: any): void {
    const structuredData = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": productInfo.title,
      "description": productInfo.description,
      "image": productInfo.image,
      "url": `https://compito.pe/ofertas/${this.productId()}`,
      "brand": {
        "@type": "Brand",
        "name": productInfo.brand || "Compito"
      },
      "offers": {
        "@type": "Offer",
        "price": productInfo.currentPrice,
        "priceCurrency": "PEN", // o la moneda que uses
        "availability": "https://schema.org/InStock",
        "url": `https://compito.pe/ofertas/${this.productId()}`
      }
    };

    // Remover script anterior si existe
    const existingScript = this.document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }

    // Añadir nuevo structured data
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(structuredData);
    this.document.head.appendChild(script);
  }


  // Método para actualizar el gráfico con los datos del historial de precios
  updateChart(priceHistory: any) {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);

      // Formatear fechas para que sean más legibles
      const formattedDates = priceHistory.dates.map((dateString: string) => {
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1} ${date.getHours()}:${date.getMinutes()}`;
      });

      this.data = {
        labels: formattedDates,
        datasets: [
          {
            label: 'Historial de precios',
            data: priceHistory.prices,
            fill: true,
            borderColor: documentStyle.getPropertyValue('--p-green-500'),
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            tension: 0.1
          }
        ]
      };

      this.cd.markForCheck();
    }
  }

  // Método para encontrar el primer elemento de un arreglo
  findFirst(arr: any[]): any {
    return arr.length > 0 ? arr[0] : null;
  }

  findLast(arr: any[]): any {
    return arr.length > 0 ? arr.at(-1) : null;
  }


  findMin(arr: number[]): string | number {
    return arr.reduce((min, current) => (current < min ? current : min), arr[0]);
  }
  // Método para encontrar el menor numero de un arreglo
  findMax(arr: number[]): number {
    return arr.reduce((max, current) => (current > max ? current : max), arr[0]);
  }

  calcularMediana(precios: number[]): number {
    const ordenados = [...precios].sort((a, b) => a - b);
    const mitad = Math.floor(ordenados.length / 2);

    if (ordenados.length === 0) return 0;

    return ordenados.length % 2 === 0
      ? (ordenados[mitad - 1] + ordenados[mitad]) / 2
      : ordenados[mitad];
  }

  obtenerEstadoDelPrecio(
    precioActual: number,
    preciosHistoricos: number[]
  ): String {
    if (preciosHistoricos.length === 0) return 'rojo';

    const mediana = this.calcularMediana(preciosHistoricos);
    const minimo = Math.min(...preciosHistoricos);

    // if (precioActual <= minimo && precioActual != mediana) {
    if (precioActual <= minimo) {
      return 'verde'; // 🟢 Precio mínimo histórico
    } else if (precioActual <= mediana * 1.05) {
      return 'amarillo'; // 🟡 Precio cercano al habitual
    } else {
      return 'rojo'; // 🔴 Precio alto
    }
  }
  calcularDescuento(precioPromedio: number, precioActual: number): string {
    if (precioPromedio <= precioActual) return 'Sin descuento';
    const descuento = ((precioPromedio - precioActual) / precioPromedio) * 100;
    return `${descuento.toFixed(2)}%`;
  }

  initChart() {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

      // Inicializar con datos vacíos
      this.data = {
        labels: [],
        datasets: [
          {
            label: 'Historial de precios',
            data: [],
            fill: true,
            borderColor: documentStyle.getPropertyValue('--p-green-500'),
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            tension: 0.4
          }
        ]
      };

      this.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
          legend: {
            labels: {
              color: textColor
            }
          },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                return `Precio: S/ ${context.raw}`;
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false
            }
          },
          y: {
            ticks: {
              color: textColorSecondary,
              callback: function (value: any) {
                return 'S/ ' + value;
              }
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false
            }
          }
        }
      };
      this.cd.markForCheck();
    }
  }

  cargarEstadoJobs(urlId: string): void {
    this.productService.getMyJob(urlId).subscribe({
      next: (res) => {
        // Actualizar la señal con el nuevo estado
        this.estadosOfertas.update(estados => ({
          ...estados,
          [urlId]: res.myjob
        }));
      },
      error: (err) => {
        // En caso de error, marcar como false
        this.estadosOfertas.update(estados => ({
          ...estados,
          [urlId]: false
        }));
      }
    });
  }

  // Método para obtener el estado (usa la señal)
  getMyJob(urlId: string): boolean {
    return this.estadosOfertas()[urlId] || false;
  }

  confirm(url: string, urlId: string) {
    this.urlId = urlId;
    this.confirmationService.confirm({
      header: `¿Seguro que quieres dejar de seguir este producto?`,
      message: 'Perderás las alertas de bajada de precio 😢',
      accept: () => {
        // Abrir URL en una nueva pestaña de manera segura y compatible con SSR
        this.deleteUrl();
      },
      reject: () => {
      },
    });
  }

  addUrlForMe(sourceJobId: string, urlId: string) {
    this.isLoading.set(true);
    this.productService.addUrlForMe(sourceJobId, urlId).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Agregado a tu seguimiento', life: 3000 });
        this.cargarEstadoJobs(this.productId()!);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error, life: 3000 });
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });

  }

  deleteUrl(): void {
    this.productService.deleteUrl(this.urlId).subscribe({
      next: (res) => {
        this.router.navigate(['/ofertas']);
      }
    });
  }

  truncateText(text: string, length: number = 40): string {
    if (text.length <= length) {
      return text;
    }
    return text.substring(0, length) + '...';
  }
}
