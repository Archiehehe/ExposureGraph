import { createAsync, query, A } from "@solidjs/router";
import { Suspense } from "solid-js";
import { isDatabaseConfigured } from "../../lib/env";

const loadThemes = query(async () => {
  const { getAllThemes } = await import("../../db/queries/themes");
  return getAllThemes();
}, "themes-all");

export default function Themes() {
  const themes = createAsync(() => loadThemes());

  return (
    <div class="p-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-4">Themes</h1>
      <Suspense fallback={<p>Loading...</p>}>
        {!isDatabaseConfigured() ? (
          <p class="text-gray-600">
            Database is not configured. Add DATABASE_URL to continue.
          </p>
        ) : themes() && themes()!.length > 0 ? (
          <div class="space-y-2">
            {themes()!.map((theme) => (
              <A href={`/themes/${theme.slug}`} class="text-blue-600 hover:underline block">
                {theme.name}
              </A>
            ))}
          </div>
        ) : (
          <p class="text-gray-600">No themes found.</p>
        )}
      </Suspense>
    </div>
  );
}
