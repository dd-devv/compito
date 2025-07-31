import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  imports: [CardModule, RouterLink],
  templateUrl: './about.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AboutComponent implements OnInit {
  private meta = inject(Meta);
  private title = inject(Title);

  ngOnInit(): void {
    this.setMetaTags();
  }

  private setMetaTags(): void {
    // Establecer Título para About
    this.title.setTitle('Sobre Nosotros - Compito.pe | Quiénes Somos | Misión y Visión');

    // Meta tags para SEO básicos
    this.meta.addTags([
      { name: 'description', content: 'Conoce la historia de Compito.pe, el equipo detrás de la plataforma líder en monitoreo de precios en Perú. Nuestra misión es ayudarte a ahorrar tiempo y dinero en tus compras online.' },
      { name: 'keywords', content: 'sobre compito, equipo compito, historia compito, misión compito, visión compito, quienes somos, acerca de nosotros, empresa peruana, startup perú, tecnología perú' },
      { name: 'author', content: 'Compito' },
      { name: 'robots', content: 'index, follow' },

      // Canonical URL para evitar contenido duplicado
      { name: 'canonical', content: 'https://compito.pe/about' },

      // Open Graph Meta Tags para compartir en redes sociales
      { property: 'og:title', content: 'Sobre Nosotros - Compito.pe | La Historia de Nuestra Startup Peruana' },
      { property: 'og:description', content: 'Descubre cómo nació Compito.pe y conoce al equipo que está revolucionando las compras online en Perú con tecnología de monitoreo de precios.' },
      { property: 'og:image', content: 'https://compito.pe/assets/images/team-compito.jpg' },
      { property: 'og:url', content: 'https://compito.pe/about' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Compito.pe' },
      { property: 'og:locale', content: 'es_PE' },

      // Twitter Card Meta Tags
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Sobre Nosotros - Compito.pe | Startup Peruana de Monitoreo de Precios' },
      { name: 'twitter:description', content: 'Conoce la historia y misión del equipo Compito.pe. Innovación peruana al servicio del ahorro inteligente.' },
      { name: 'twitter:image', content: 'https://compito.pe/assets/images/team-compito.jpg' },
      { name: 'twitter:site', content: '@CompitoPeru' },

      // Meta tags adicionales para SEO local
      { name: 'geo.region', content: 'PE' },
      { name: 'geo.country', content: 'Perú' },
      { name: 'geo.placename', content: 'Lima, Perú' },

      // Schema.org structured data para organización
      {
        name: 'schema.org', content: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Compito.pe",
          "url": "https://compito.pe",
          "logo": "https://compito.pe/logo.png",
          "description": "Plataforma peruana de monitoreo de precios y alertas de ofertas online",
          "foundingDate": "2025", // Ajusta según corresponda
          "foundingLocation": "Lima, Perú",
          "sameAs": [
            "https://www.facebook.com/compito.pe",
              "https://www.instagram.com/compito_pe",
              "https://www.tiktok.com/@compito_pe",
              "https://www.youtube.com/@compito_pe"
          ]
        })
      }
    ]);
  }
}
