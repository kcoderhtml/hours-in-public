import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
  const queryParams = new URLSearchParams(request.url.split("?")[1]);

  const query = queryParams.get("query");

  if (!query) {
    return new Response("Bad Request", { status: 400 });
  } else {
    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY!,
          "X-Goog-FieldMask": "places.formattedAddress",
        },
        body: JSON.stringify({
          textQuery: query,
          pageSize: 5,
        }),
      }
    ).then((res) => res.json());

    return new Response(JSON.stringify(response), { status: 200 });
  }
};
