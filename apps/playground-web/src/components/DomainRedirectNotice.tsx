import { Alert, AlertAction, AlertDescription, Badge, Button } from '@gv-tech/ui-web';
import { ArrowRight, Globe, X } from 'lucide-react';
import * as React from 'react';

const TARGET_DOMAIN = 'design.gventureshq.com';
const DISMISS_KEY = 'gvtech_domain_notice_dismissed';

export function DomainRedirectNotice(): React.ReactElement | null {
  const [visible, setVisible] = React.useState(false);
  const [newUrl, setNewUrl] = React.useState('');

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const hostname = window.location.hostname;
    const isLegacyDomain =
      hostname === 'design.garciaericn.com' ||
      hostname.endsWith('.garciaericn.com') ||
      hostname === 'gvtech-design.pages.dev' ||
      hostname.endsWith('.pages.dev');

    if (!isLegacyDomain) {
      return;
    }

    const isDismissed = sessionStorage.getItem(DISMISS_KEY) === 'true';
    if (isDismissed) {
      return;
    }

    const targetUrl = new URL(window.location.href);
    targetUrl.protocol = 'https:';
    targetUrl.hostname = TARGET_DOMAIN;
    targetUrl.port = '';

    setNewUrl(targetUrl.toString());
    setVisible(true);
  }, []);

  if (!visible) {
    return null;
  }

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, 'true');
    setVisible(false);
  };

  return (
    <div className="bg-background/80 relative z-50 p-2 backdrop-blur-md sm:p-3">
      <Alert className="border-primary/30 bg-primary/10 text-foreground relative">
        <Globe className="text-primary h-4 w-4" />
        <AlertDescription className="text-foreground flex flex-wrap items-center gap-2 text-xs sm:text-sm">
          <Badge variant="default" className="bg-primary text-primary-foreground font-semibold">
            We&apos;ve Moved!
          </Badge>
          <span>
            The site has migrated to <strong className="text-foreground font-semibold">{TARGET_DOMAIN}</strong>.
          </span>
          <Button asChild variant="link" size="sm" className="text-primary h-auto p-0 font-medium underline">
            <a href={newUrl} className="inline-flex items-center gap-1">
              Go to new site
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </Button>
        </AlertDescription>
        <AlertAction className="end-2 top-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            aria-label="Dismiss migration notice"
            className="text-muted-foreground hover:text-foreground h-6 w-6"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </AlertAction>
      </Alert>
    </div>
  );
}
