import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

const FAVICON = "data:image/png;base64,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";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "National Case Competition" },
      { name: "description", content: "National Case Competition - La competencia de casos más importante del país." },
      { property: "og:title", content: "National Case Competition" },
      { property: "og:description", content: "National Case Competition - La competencia de casos más importante del país." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: FAVICON },
      { rel: "apple-touch-icon", href: FAVICON },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
