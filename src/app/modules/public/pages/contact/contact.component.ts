import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  imports: [],
  templateUrl: './contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ContactComponent implements OnInit {
  private meta = inject(Meta);
  private title = inject(Title);

  ngOnInit(): void {
    this.setMetaTags();
  }

  private setMetaTags(): void {
    // Establecer Título para Contacto
    this.title.setTitle('Contáctanos - Compito.pe | Soporte y Atención al Cliente | WhatsApp +51 962 557 565');

    // Meta tags para SEO básicos
    this.meta.addTags([
      { name: 'description', content: 'Contacta con el equipo de Compito.pe por WhatsApp +51 962 557 565. Soporte rápido para resolver dudas sobre monitoreo de precios y alertas. Respuesta en minutos.' },
      { name: 'keywords', content: 'contacto compito, soporte compito, whatsapp compito, atención al cliente, ayuda compito, dudas compito, soporte técnico, contactar compito peru' },
      { name: 'author', content: 'Compito' },
      { name: 'robots', content: 'index, follow' },

      // Canonical URL para evitar contenido duplicado
      { name: 'canonical', content: 'https://compito.pe/contact' },

      // Open Graph Meta Tags para compartir en redes sociales
      { property: 'og:title', content: 'Contáctanos - Compito.pe | Soporte WhatsApp +51 962 557 565' },
      { property: 'og:description', content: '¿Necesitas ayuda con Compito.pe? Contáctanos por WhatsApp y recibe respuesta rápida. Estamos aquí para resolver tus dudas sobre monitoreo de precios.' },
      { property: 'og:image', content: 'https://compito.pe/assets/images/contact-support.jpg' },
      { property: 'og:url', content: 'https://compito.pe/contact' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'Compito.pe' },
      { property: 'og:locale', content: 'es_PE' },

      // Twitter Card Meta Tags
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Contáctanos - Compito.pe | Soporte WhatsApp Rápido' },
      { name: 'twitter:description', content: 'Soporte rápido por WhatsApp +51 962 557 565. Resolvemos tus dudas sobre Compito.pe en minutos.' },
      { name: 'twitter:image', content: 'https://compito.pe/assets/images/contact-support.jpg' },

      // Meta tags adicionales para SEO local y contacto
      { name: 'geo.region', content: 'PE' },
      { name: 'geo.country', content: 'Perú' },
      { name: 'geo.placename', content: 'Lima, Perú' },

      // Meta tags específicos para páginas de contacto
      { name: 'contact', content: '+51962557565' },
      { name: 'reply-to', content: 'compito.oficial@gmail.com' },

      // Schema.org structured data para contacto y organización
      {
        name: 'schema.org', content: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          "mainEntity": {
            "@type": "Organization",
            "name": "Compito.pe",
            "url": "https://compito.pe",
            "logo": "https://compito.pe/logo.png",
            "contactPoint": [
              {
                "@type": "ContactPoint",
                "telephone": "+51-962-557-565",
                "contactType": "customer service",
                "availableLanguage": "Spanish",
                "areaServed": "PE",
                "contactOption": "TollFree"
              }
            ],
            "sameAs": [
              "https://www.facebook.com/compito.pe",
              "https://www.instagram.com/compito_pe",
              "https://www.tiktok.com/@compito_pe",
              "https://www.youtube.com/@compito_pe"
            ]
          }
        })
      },

      // Meta tags para redes sociales específicas
      { property: 'fb:page_id', content: 'compito.pe' },
      { name: 'instagram-profile', content: 'compito_pe' },
      { name: 'tiktok-profile', content: 'compito_pe' },
      { name: 'youtube-channel', content: 'compito_pe' },
    ]);
  }
}
