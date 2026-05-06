// components/dashboard/upcoming-bills.tsx
import { Subscription } from "@prisma/client";

type Props = {
  subscriptions: Subscription[];
};

// How many days until a date?
function daysUntil(date: Date): number {
  const diff = new Date(date).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function UpcomingBills({ subscriptions }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h2 className="font-semibold text-gray-900 mb-4">
        Due in Next 7 Days
      </h2>

      {subscriptions.length === 0 ? (
        <p className="text-sm text-gray-400">Nothing due soon. Enjoy! 🎉</p>
      ) : (
        <ul className="space-y-3">
          {subscriptions.map((sub) => {
            const days = daysUntil(sub.nextBillingDate);
            const isUrgent = days <= 2;

            return (
              <li
                key={sub.id}
                className="flex items-center justify-between py-2 
                           border-b border-gray-50 last:border-0"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {sub.name}
                    {sub.isTrial && (
                      <span className="ml-2 text-xs bg-yellow-100 
                                       text-yellow-700 px-2 py-0.5 rounded-full">
                        Trial
                      </span>
                    )}
                  </p>
                  <p className={`text-xs mt-0.5 ${isUrgent ? "text-red-500 font-medium" : "text-gray-400"}`}>
                    {days === 0 ? "Today!" : days === 1 ? "Tomorrow!" : `In ${days} days`}
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  ₹{sub.amount}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}