import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Roboto } from "next/font/google";
import { GoogleAnalytics, event } from "nextjs-google-analytics";
import type { NextWebVitalsMetric } from "next/app";
import { env } from "~/env.mjs";

// If loading a variable font, you don't need to specify the font weight
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});
import { api } from "~/utils/api";

import "~/styles/globals.css";

export function reportWebVitals(metric: NextWebVitalsMetric) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  event(metric.name, {
    category:
      metric.label === "web-vital" ? "Web Vitals" : "Next.js custom metric",
    value: Math.round(
      metric.name === "CLS" ? metric.value * 1000 : metric.value
    ), // values must be integers
    label: metric.id, // id unique to current page load
    nonInteraction: true, // avoids affecting bounce rate.
  });
}

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <GoogleAnalytics
        trackPageViews={{ ignoreHashChange: true }}
        gaMeasurementId={env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
      />

      <div
        className={
          roboto.className + " bg-gradient-to-br from-[#f77627] to-[#fc3b51] "
        }
      >
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);
