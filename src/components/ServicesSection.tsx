import {
  TrendingUp,
  Handshake,
  Building,
  FileCheck,
  ArrowRight,
  ArrowLeft,
  Plus,
  Minus,
  RotateCcw,
} from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { services } from '@/data/propertyData';
import pdfPreview from '@/assets/pdf.jpg';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const ServicesSection = () => {
  const { t, isRTL } = useLanguage();
  const [isPdfOpen, setIsPdfOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const serviceIcons = {
    marketing: TrendingUp,
    brokerage: Handshake,
    management: Building,
    documentation: FileCheck,
  };

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-4xl font-bold text-secondary mb-4 ${
            isRTL ? 'font-arabic' : ''
          }`}>
            {t('services.title')}
          </h2>
          <p className={`text-lg text-muted-foreground max-w-2xl mx-auto ${
            isRTL ? 'font-arabic' : ''
          }`}>
            {isRTL 
              ? 'نقدم مجموعة شاملة من الخدمات العقارية المتخصصة'
              : 'We provide a comprehensive range of specialized real estate services'
            }
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const IconComponent = serviceIcons[service.key as keyof typeof serviceIcons];
            
            return (
              <div
                key={service.key}
                className="card-feature animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="h-8 w-8 text-primary-foreground" />
                </div>

                {/* Service Title */}
                <h3 className={`text-xl font-bold text-secondary mb-4 ${
                  isRTL ? 'font-arabic' : ''
                }`}>
                  {isRTL ? service.ar : service.en}
                </h3>

                {/* Service Description */}
                <p className={`text-muted-foreground text-sm leading-relaxed mb-6 ${
                  isRTL ? 'font-arabic' : ''
                }`}>
                  {isRTL ? service.description.ar : service.description.en}
                </p>

                {/* Learn More Link */}
                <button
                  type="button"
                  className="group flex items-center justify-center gap-2 text-primary transition-colors hover:text-secondary"
                  onClick={() => {
                    setZoomLevel(1);
                    setIsPdfOpen(true);
                  }}
                >
                  <span className={`text-sm font-medium ${isRTL ? 'font-arabic' : ''}`}>
                    {isRTL ? 'اعرف المزيد' : 'Learn More'}
                  </span>
                  <ArrowIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            );
          })}
        </div>
        <Dialog
          open={isPdfOpen}
          onOpenChange={(isOpen) => {
            setIsPdfOpen(isOpen);
            if (!isOpen) {
              setZoomLevel(1);
            }
          }}
        >
          <DialogContent className="w-full max-w-4xl">
            <DialogHeader>
              <DialogTitle className={isRTL ? 'font-arabic text-xl' : 'text-xl'}>
                {isRTL ? 'ملف الخدمات' : 'Services Brochure'}
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <div className="relative max-h-[70vh] overflow-auto rounded-xl bg-muted/40 p-4">
                <img
                  src={pdfPreview}
                  alt={isRTL ? 'معاينة ملف الخدمات' : 'Services brochure preview'}
                  className="mx-auto max-w-full select-none object-contain transition-transform duration-300 ease-out"
                  style={{ transform: `scale(${zoomLevel})` }}
                  draggable={false}
                />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setZoomLevel((prev) => Math.max(0.5, parseFloat((prev - 0.25).toFixed(2))))
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-secondary transition-colors hover:bg-secondary hover:text-secondary-foreground disabled:pointer-events-none disabled:opacity-50"
                  disabled={zoomLevel <= 0.5}
                >
                  <Minus className="h-4 w-4" />
                  {isRTL ? 'تصغير' : 'Zoom Out'}
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(1)}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-secondary transition-colors hover:bg-secondary hover:text-secondary-foreground disabled:pointer-events-none disabled:opacity-50"
                  disabled={zoomLevel === 1}
                >
                  <RotateCcw className="h-4 w-4" />
                  {isRTL ? 'إعادة' : 'Reset'}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setZoomLevel((prev) => Math.min(3, parseFloat((prev + 0.25).toFixed(2))))
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-secondary transition-colors hover:bg-secondary hover:text-secondary-foreground disabled:pointer-events-none disabled:opacity-50"
                  disabled={zoomLevel >= 3}
                >
                  <Plus className="h-4 w-4" />
                  {isRTL ? 'تكبير' : 'Zoom In'}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className={`bg-gradient-card rounded-2xl p-8 max-w-4xl mx-auto ${
            isRTL ? 'font-arabic' : ''
          }`}>
            <h3 className={`text-2xl font-bold text-secondary mb-4 ${
              isRTL ? 'font-arabic' : ''
            }`}>
              {isRTL ? 'هل تحتاج استشارة عقارية؟' : 'Need Real Estate Consultation?'}
            </h3>
            <p className={`text-muted-foreground mb-6 ${
              isRTL ? 'font-arabic' : ''
            }`}>
              {isRTL 
                ? 'تواصل معنا للحصول على استشارة مجانية من خبرائنا المعتمدين'
                : 'Contact us for a free consultation from our certified experts'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/966551888193"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary text-center"
              >
                {isRTL ? 'احجز استشارة' : 'Book Consultation'}
              </a>
              <a
                href="https://wa.me/966551888193"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline text-center"
              >
                {isRTL ? 'تواصل واتساب' : 'WhatsApp Contact'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;