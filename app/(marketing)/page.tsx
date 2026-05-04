import Link from "next/link";
import { Sparkles, Camera, Share2, Users, Clock, ShieldCheck } from "lucide-react";

export default function MarketingHomePage() {
  return (
    <div>
      <section className="container-app pt-12 pb-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-bay-900 leading-tight">
          Run your charter business —<br className="hidden sm:block" /> not your spreadsheet.
        </h1>
        <p className="mt-4 text-base text-neutral-700 max-w-md mx-auto">
          Capture every trip, generate a polished branded recap your clients
          will actually save. Built for guides on the Texas Coastal Bend.
        </p>
        <div className="mt-6 flex flex-col gap-2 max-w-xs mx-auto">
          <Link
            href="/signup"
            className="bg-bay-600 hover:bg-bay-700 text-white rounded-lg px-4 py-3 font-medium"
          >
            Start free — 3 trips, no card
          </Link>
          <Link
            href="/pricing"
            className="text-bay-700 hover:text-bay-900 px-3 py-2 text-sm"
          >
            See pricing
          </Link>
        </div>
      </section>

      <section className="bg-white border-y border-bay-100 py-10">
        <div className="container-app">
          <h2 className="text-sm font-semibold text-bay-700 uppercase tracking-wide mb-4">
            What it does
          </h2>
          <div className="space-y-4">
            <Feature
              icon={<Camera className="h-5 w-5" />}
              title="Log a trip in under 5 minutes"
              body="Quick catch log, one-tap conditions, photos straight from your phone — built for the boat, not the desk."
            />
            <Feature
              icon={<Sparkles className="h-5 w-5" />}
              title="Turn it into a pattern card"
              body="The AI reads your catches, conditions, and notes and writes a real fishing lesson — grounded in actual Aransas Bay species data."
            />
            <Feature
              icon={<Share2 className="h-5 w-5" />}
              title="Send your client a branded recap"
              body="One link with your logo, the photos, the lesson, and a 'book again' CTA. They keep it. They book again. They tell friends."
            />
            <Feature
              icon={<Users className="h-5 w-5" />}
              title="Remember every client"
              body="Client list, trip history, repeat-booking signal. Stop hunting through your texts to remember who fished what."
            />
            <Feature
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Spots stay private"
              body="Privacy controls baked in. Recaps share patterns and conditions, never exact GPS or guide secrets."
            />
            <Feature
              icon={<Clock className="h-5 w-5" />}
              title="Built around your workflow"
              body="Mobile-first. Works offline-friendly as a PWA. Designed for the way charter days actually run."
            />
          </div>
        </div>
      </section>

      <section className="container-app py-12 text-center">
        <h2 className="text-xl font-semibold text-bay-900">
          Ready to run sharper trips?
        </h2>
        <Link
          href="/signup"
          className="mt-4 inline-block bg-bay-600 hover:bg-bay-700 text-white rounded-lg px-5 py-3 font-medium"
        >
          Create your account
        </Link>
        <p className="mt-3 text-xs text-neutral-500">
          Free forever for your first 3 trips. $29/month after that.
        </p>
      </section>
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-bay-50 text-bay-600 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="font-semibold text-neutral-900">{title}</div>
        <div className="text-sm text-neutral-700 mt-0.5">{body}</div>
      </div>
    </div>
  );
}
