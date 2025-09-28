import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Link, useLocation } from 'react-router-dom';
import logoImage from '@/assets/logo.png';

const Header = () => {
  const { language, setLanguage, t, isRTL } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
  ];

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md shadow-soft border-b border-border' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center transition-smooth hover:scale-105">
            <img 
              src={logoImage} 
              alt="Muathaqa Real Estate" 
              className="h-16 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`font-medium transition-smooth hover:text-primary ${
                  isActive(item.path)
                    ? 'text-primary border-b-2 border-primary pb-1'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Language Toggle & Contact */}
          <div className="hidden lg:flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLanguage}
              className="flex items-center gap-2 hover:bg-muted"
            >
              <Globe className="h-4 w-4" />
              <span className="font-medium">{language === 'ar' ? 'EN' : 'العربية'}</span>
            </Button>
            
            {/* Admin Link */}
            <Link to="/admin">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
              >
                <Settings className="h-4 w-4" />
                <span className="font-medium">Admin</span>
              </Button>
            </Link>
            
            <Button variant="secondary" size="sm" className="font-medium">
              {t('contact.title')}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-smooth"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMobileMenuOpen ? 'max-h-96 pb-6' : 'max-h-0'
          }`}
        >
          <nav className="flex flex-col gap-4 pt-4 border-t border-border">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={`font-medium py-2 px-4 rounded-lg transition-smooth ${
                  isActive(item.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <Button
                variant="ghost"
                onClick={toggleLanguage}
                className="justify-start gap-2"
              >
                <Globe className="h-4 w-4" />
                <span>{language === 'ar' ? 'English' : 'العربية'}</span>
              </Button>
              
              {/* Mobile Admin Link */}
              <Link to="/admin" onClick={closeMobileMenu}>
                <Button variant="outline" className="w-full justify-start gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </Button>
              </Link>
              
              <Button variant="secondary" onClick={closeMobileMenu}>
                {t('contact.title')}
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
