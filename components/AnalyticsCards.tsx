import { WardrobeAnalytics } from "../types";

export default function AnalyticsCards({ analytics }: { analytics: WardrobeAnalytics }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      <div className="glass p-8 rounded-lg shadow-ambient">
        <p className="text-xs font-black text-primary-design uppercase tracking-widest mb-2">Sustainability Index</p>
        <p className="text-5xl font-bold text-on-surface">{analytics.sustainabilityScore}/10</p>
      </div>
      <div className="glass p-8 rounded-lg shadow-ambient">
        <p className="text-xs font-black text-primary-design uppercase tracking-widest mb-2">Natural Fibers</p>
        <p className="text-5xl font-bold text-secondary-design">{analytics.naturalPercentage}%</p>
      </div>
      <div className="glass p-8 rounded-lg shadow-ambient">
        <p className="text-xs font-black text-primary-design uppercase tracking-widest mb-2">High Risk Items</p>
        <p className="text-5xl font-bold text-error-design">{analytics.riskProfile.high}%</p>
      </div>
    </div>
  );
}
