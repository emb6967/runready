import { formatPrice } from "@/lib/stripe";
import { startCheckoutAction } from "./actions";

export function UpgradeButton({ label }: { label?: string }) {
  return (
    <form action={startCheckoutAction}>
      <button
        type="submit"
        className="rounded-full bg-ice-400 px-6 py-3 font-semibold text-navy-950 shadow-sm hover:bg-ice-300"
      >
        {label ?? `Upgrade to Pro · ${formatPrice()}/month`}
      </button>
    </form>
  );
}
