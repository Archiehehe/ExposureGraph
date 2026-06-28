import { createAsync, query, useParams } from "@solidjs/router";
import { Suspense } from "solid-js";
import { isDatabaseConfigured } from "../../lib/env";

const loadThemeBySlug = query(async (slug: string) => {
  const { getThemeBySlug } = await import("../../db/queries/themes");
  return getThemeBySlug(slug);
}, "theme-slug");

export default function ThemeDetail() {
  const params = useParams();
  const slug = () => params.slug as string | undefined;
  const theme = createAsync(async () => {
    const s = slug();
    if (!s) return null;
    return loadThemeBySlug(s);
  });

  return (
    <div class="p-8">
      <Suspense fallback={<p>Loading...</p>}>
        {!isDatabaseConfigured() ? (
          <p class="text-gray-600">
            Database is not configured. Add DATABASE_URL to continue.
          </p>
        ) : theme() ? (
          <>
            <h1 class="text-2xl font-bold text-gray-900 mb-4">{theme()!.name}</h1>
            {theme()!.description && <p class="text-gray-600 mb-4">{theme()!.description}</p>}
          </>
        ) : (
          <p class="text-gray-600">Theme not found.</p>
        )}
      </Suspense>
    </div>
  );
}
