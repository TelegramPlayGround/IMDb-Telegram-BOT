export async function urlFetchEr(
  webPageUrl: string,
  // https://www.scaler.com/topics/typescript/typescript-dictionary/
  customHeaders: { [key: string]: string },
  preFetchOnly?: boolean,
): Promise<string> {
  customHeaders["User-Agent"] = Deno.env.get("BROWSER_USER_AGENT") as string;
  const one = await fetch(webPageUrl, {
    headers: customHeaders,
  });
  if (preFetchOnly === true) {
    // @ts-ignore
    return one;
  }
  const two = await one.text();
  return two;
}
