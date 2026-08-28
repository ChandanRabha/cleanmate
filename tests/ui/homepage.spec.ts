import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-motion", "full");
});

test("reveals off-screen content when it enters the viewport", async ({ page }) => {
  const heading = page.locator("#services .section-heading");

  await expect(page.locator("html")).toHaveClass(/motion-ready/);
  await expect(page.locator("html")).toHaveAttribute("data-motion", "full");
  await expect(heading).toHaveClass(/scroll-reveal/);
  await expect(heading).not.toHaveClass(/is-visible/);
  await expect(heading).toHaveCSS("opacity", "0");

  await page.evaluate(() => window.scrollTo({ top: 760, behavior: "instant" }));

  await expect(heading).toHaveClass(/is-visible/);
  await page.waitForTimeout(150);
  const inFlightOpacity = await heading.evaluate((element) =>
    Number.parseFloat(getComputedStyle(element).opacity),
  );
  expect(inFlightOpacity).toBeLessThan(1);
  expect(inFlightOpacity).toBeGreaterThan(0);

  await expect(heading).toHaveCSS("opacity", "1");
  await expect(heading).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
});

test("keeps site motion enabled when the OS requests reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();

  await expect(page.locator("html")).toHaveAttribute("data-motion", "full");
  await expect(page.locator("#services .section-heading")).toHaveClass(/scroll-reveal/);
  await expect(page.locator("#services .section-heading")).toHaveCSS("opacity", "0");
});

test("does not overflow horizontally", async ({ page }) => {
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));

  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
});

test("links the hero directly to the pricing calculator", async ({ page }) => {
  const calculatorLink = page.getByRole("link", { name: "Calculate my price" });
  await expect(calculatorLink).toHaveAttribute("href", "#calculator");
  await calculatorLink.click();
  await expect(page.locator("#calculator")).toBeInViewport();
});

test("shows an icon for every hero trust point", async ({ page }) => {
  await expect(page.locator(".trust-item")).toHaveCount(3);
  await expect(page.locator(".trust-icon svg")).toHaveCount(3);
});

test("switches the full interface between English, Hindi and Assamese", async ({ page }) => {
  const language = page.getByLabel("Language");
  await expect(language).toHaveValue("en");

  await language.selectOption("hi");
  await expect(page.locator("html")).toHaveAttribute("lang", "hi");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("स्वच्छ जगहें");
  await expect(page.getByText("अपनी सफाई चुनें")).toBeAttached();

  await language.selectOption("as");
  await expect(page.locator("html")).toHaveAttribute("lang", "as");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("পৰিষ্কাৰ ঠাই");
  await expect(page.getByText("আপোনাৰ পৰিষ্কাৰ বাছক")).toBeAttached();
  const widths = await page.evaluate(() => ({ viewport: document.documentElement.clientWidth, content: document.documentElement.scrollWidth }));
  expect(widths.content).toBeLessThanOrEqual(widths.viewport);

  await page.reload();
  await expect(language).toHaveValue("as");
});

test("presents industries as coverage information, not navigation", async ({ page }) => {
  const industries = page.locator(".industry-list");
  await expect(industries.locator(".industry-status")).toHaveCount(6);
  await expect(industries.locator("a, button")).toHaveCount(0);
  await expect(industries.locator(".lucide-arrow-right")).toHaveCount(0);
});

test("routes booking actions to the CleanMate WhatsApp number", async ({ page }) => {
  const bookingLinks = page.locator('a[href^="https://wa.me/918638785565"]');

  await expect(bookingLinks).toHaveCount(10);
  for (const link of await bookingLinks.all()) {
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noreferrer");
  }
});

test("calculates a cleaning estimate and includes it in WhatsApp", async ({ page }) => {
  const threeBhk = page.getByRole("button", { name: "3 BHK ₹4,500" });
  await threeBhk.click();
  await expect(threeBhk).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Add Bathroom" }).click();
  await expect(page.getByLabel("Bathroom quantity")).toHaveText("1");
  await page.getByRole("button", { name: "Add Bathroom" }).click();
  await expect(page.getByLabel("Bathroom quantity")).toHaveText("2");
  await page.getByRole("button", { name: "Add Kitchen" }).click();
  await expect(page.getByLabel("Kitchen quantity")).toHaveText("1");

  await expect(page.getByTestId("estimate-total")).toHaveText("₹6,900");
  const estimateLink = page.getByRole("link", { name: "Send estimate on WhatsApp" });
  await expect(estimateLink).toHaveAttribute("href", /wa\.me\/918638785565/);
  await expect(estimateLink).toHaveAttribute("href", /Estimated%20starting%20price%3A%20%E2%82%B96%2C900/);
});

test("shows a QR code for the same WhatsApp contact", async ({ page }) => {
  const qr = page.getByTestId("whatsapp-qr");
  await expect(qr).toBeVisible();
  await expect(qr.locator("title")).toHaveText("Scan to contact CleanMate on WhatsApp");
  await expect(qr.locator("xpath=..")).toHaveAttribute("href", /wa\.me\/918638785565/);
  await expect(page.getByText("+91 97748 83172")).toBeVisible();
});

test("downloads the services and pricing brochure as a PDF", async ({ page, request }) => {
  const link = page.getByRole("link", { name: "Download brochure" });
  await expect(link).toHaveAttribute("href", "/cleanmate-services-pricing.pdf");
  await expect(link).toHaveAttribute("download", "CleanMate-Services-and-Pricing.pdf");

  const response = await request.get("/cleanmate-services-pricing.pdf");
  expect(response.ok()).toBeTruthy();
  expect(response.headers()["content-type"]).toContain("application/pdf");
  expect((await response.body()).subarray(0, 5).toString()).toBe("%PDF-");
});

test("uses the brochure only as a download, not a page image", async ({ page }) => {
  await expect(page.locator('img[src="/cleanmate-brochure.png"]')).toHaveCount(0);
  await expect(page.locator("#about .reason")).toHaveCount(4);
  await expect(page.locator("#about .quality-actions")).toBeVisible();
});
