import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/i18n/use-language";
import { translations } from "@/i18n/translations";

const NotFound = () => {
  const location = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md rounded-xl border border-border/60 bg-card/70 p-8 text-center backdrop-blur-md">
        <p className="mb-3 font-mono text-xs tracking-widest text-primary">
          {t(translations.notFound.badge)}
        </p>
        <h1 className="mb-2 font-mono text-5xl font-bold text-foreground">404</h1>
        <p className="mb-2 font-mono text-base font-medium text-foreground">
          {t(translations.notFound.heading)}
        </p>
        <p className="mb-6 text-sm text-muted-foreground">
          {t(translations.notFound.description)}
        </p>
        <p className="mb-6 truncate rounded-md border border-border/50 bg-background/50 px-3 py-1.5 font-mono text-xs text-muted-foreground" dir="ltr">
          {location.pathname}
        </p>
        <Button asChild className="gap-2 font-mono">
          <Link to="/">
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            {t(translations.notFound.backHome)}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
