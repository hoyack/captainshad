import Link from "next/link";
import { Check } from "lucide-react";
import { PLAN } from "@/lib/stripe";

export default function PricingPage() {
  return (
    <div className="container-app py-10">
      <h1 className="text-2xl font-bold text-bay-900 text-center">Simple pricing</h1>
      <p className="mt-2 text-sm text-neutral-700 text-center">
        Start free. Upgrade when you outgrow it.
      </p>

      <div className="mt-8 space-y-4">
        <PlanCard
          name={PLAN.free.name}
          price="$0"
          tagline="Try it on your next trip"
          features={PLAN.free.features}
          cta={
            <Link
              href="/signup"
              className="block text-center bg-bay-50 hover:bg-bay-100 text-bay-800 rounded-lg px-4 py-2.5 font-medium"
            >
              Start free
            </Link>
          }
        />
        <PlanCard
          name={PLAN.pro.name}
          price={`$${PLAN.pro.priceMonthly}/mo`}
          tagline="Run your full charter business"
          features={PLAN.pro.features}
          highlighted
          cta={
            <Link
              href="/signup"
              className="block text-center bg-bay-600 hover:bg-bay-700 text-white rounded-lg px-4 py-2.5 font-medium"
            >
              Start free, upgrade anytime
            </Link>
          }
        />
      </div>

      <p className="mt-6 text-xs text-neutral-500 text-center">
        Cancel any time from Settings → Billing.
      </p>
    </div>
  );
}

function PlanCard({
  name,
  price,
  tagline,
  features,
  cta,
  highlighted,
}: {
  name: string;
  price: string;
  tagline: string;
  features: string[];
  cta: React.ReactNode;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-5 bg-white ${
        highlighted ? "border-bay-400 shadow-md" : "border-bay-100"
      }`}
    >
      <div className="flex items-baseline justify-between">
        <h2 className="text-lg font-semibold text-bay-900">{name}</h2>
        <div className="text-2xl font-bold text-bay-700">{price}</div>
      </div>
      <p className="text-sm text-neutral-600">{tagline}</p>
      <ul className="mt-4 space-y-1.5 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className="h-4 w-4 text-bay-600 mt-0.5 flex-shrink-0" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <div className="mt-5">{cta}</div>
    </div>
  );
}
