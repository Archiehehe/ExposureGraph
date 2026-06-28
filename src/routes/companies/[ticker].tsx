import { createAsync, query, useParams } from "@solidjs/router";
import { Suspense } from "solid-js";
import { isDatabaseConfigured } from "../../lib/env";

const loadCompanyByTicker = query(async (ticker: string) => {
  const { getCompanyByTicker } = await import("../../db/queries/companies");
  return getCompanyByTicker(ticker.toUpperCase());
}, "company-ticker");

export default function CompanyDetail() {
  const params = useParams();
  const ticker = () => params.ticker as string | undefined;
  const company = createAsync(async () => {
    const t = ticker();
    if (!t) return null;
    return loadCompanyByTicker(t);
  });

  return (
    <div class="p-8">
      <Suspense fallback={<p>Loading...</p>}>
        {!isDatabaseConfigured() ? (
          <p class="text-gray-600">
            Database is not configured. Add DATABASE_URL to continue.
          </p>
        ) : company() ? (
          <>
            <h1 class="text-2xl font-bold text-gray-900 mb-4">{company()!.name}</h1>
            <p class="text-gray-500 text-sm mb-4">{ticker()?.toUpperCase()}</p>
            {company()!.description && (
              <p class="text-gray-600 mb-4">{company()!.description}</p>
            )}
          </>
        ) : (
          <p class="text-gray-600">No company found for this ticker.</p>
        )}
      </Suspense>
    </div>
  );
}
