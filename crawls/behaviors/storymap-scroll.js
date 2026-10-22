// Custom Browsertrix behavior: scroll ArcGIS StoryMaps.
//
// StoryMaps scroll an inner container rather than the browser window, so the
// built-in autoscroll behavior decides the page "isn't responsive to scrolling"
// and skips it. That leaves lazy-loaded images and maps further down the story
// unloaded. This behavior finds the element that actually scrolls and steps
// through it slowly so everything below the fold gets requested and recorded.

class StoryMapScroll {
  static id = "StoryMapScroll";

  static isMatch() {
    return /^https:\/\/storymaps\.arcgis\.com\/stories\//.test(window.location.href);
  }

  static init() {
    return {};
  }

  // Find every element that can scroll vertically, plus the page itself.
  findScrollers() {
    const scrollers = [];
    for (const el of document.querySelectorAll("*")) {
      const style = getComputedStyle(el);
      const canScroll = /(auto|scroll)/.test(style.overflowY);
      if (canScroll && el.scrollHeight > el.clientHeight + 50) {
        scrollers.push(el);
      }
    }
    scrollers.push(document.scrollingElement || document.documentElement);
    // Biggest scroll area first: that's normally the story body.
    return scrollers.sort((a, b) => b.scrollHeight - a.scrollHeight);
  }

  async captureStoryImages() {
    const storyId = window.location.pathname.split("/").filter(Boolean).pop();
    if (!storyId) {
      return { found: 0, captured: 0, failed: 0 };
    }

    const dataUrl = new URL(
      `/sharing/rest/content/items/${storyId}/data?f=json`,
      "https://www.arcgis.com",
    );
    const dataResponse = await fetch(dataUrl.href);
    if (!dataResponse.ok) {
      return { found: 0, captured: 0, failed: 1 };
    }

    const storyData = await dataResponse.json();
    const resources = new Map();
    const visit = (value) => {
      if (!value || typeof value !== "object") {
        return;
      }
      if (value.type === "image" && value.data?.provider === "item-resource" &&
          typeof value.data.resourceId === "string") {
        const width = Number(value.data.width);
        if (width > 0) {
          const existing = resources.get(value.data.resourceId) || 0;
          resources.set(value.data.resourceId, Math.max(existing, Math.min(4096, Math.ceil(width))));
        }
      }
      for (const child of Object.values(value)) {
        visit(child);
      }
    };
    visit(storyData);

    const entries = Array.from(resources);
    let captured = 0;
    let failed = 0;
    for (let i = 0; i < entries.length; i += 4) {
      await Promise.all(entries.slice(i, i + 4).map(async ([resourceId, width]) => {
        const imageUrl = new URL(
          `/sharing/rest/content/items/${storyId}/resources/${encodeURIComponent(resourceId)}`,
          "https://www.arcgis.com",
        );
        imageUrl.searchParams.set("w", String(width));
        try {
          const response = await fetch(imageUrl.href, { cache: "no-store" });
          if (!response.ok) {
            failed++;
            return;
          }
          await response.arrayBuffer();
          captured++;
        } catch {
          failed++;
        }
      }));
    }
    return { found: entries.length, captured, failed };
  }

  async waitForVisibleImages() {
    const deadline = Date.now() + 8000;
    const STABLE_FOR_MS = 1000;
    let previousSignature = "";
    let stableSince = 0;
    const isVisible = (img) => {
      const rect = img.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 &&
        rect.bottom > 0 && rect.right > 0 &&
        rect.top < window.innerHeight && rect.left < window.innerWidth;
    };

    while (Date.now() < deadline) {
      const visibleImages = Array.from(document.images).filter(isVisible);
      if (visibleImages.length === 0) {
        return;
      }
      const stillLoading = visibleImages.some((img) => !img.complete);
      const signature = visibleImages
        .map((img) => `${img.currentSrc || img.src}:${img.naturalWidth}x${img.naturalHeight}`)
        .join("|");
      if (signature !== previousSignature) {
        previousSignature = signature;
        stableSince = Date.now();
      }

      if (!stillLoading && Date.now() - stableSince >= STABLE_FOR_MS) {
        await Promise.all(visibleImages.map((img) => img.decode().catch(() => {})));
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }

  async* run(ctx) {
    const { Lib } = ctx;
    const STEP_FRACTION = 0.5; // scroll half a screen per step
    const STEP_PAUSE_MS = 1500; // give lazy images, maps and tiles time to load
    const MAX_STEPS = 400;

    // Let the story app finish its first render.
    await Lib.sleep(3000);
    const imageResult = await this.captureStoryImages();
    yield Lib.getState(
      ctx,
      `requested ${imageResult.captured}/${imageResult.found} full-width image resources (${imageResult.failed} failed)`,
    );

    const scrollers = this.findScrollers();
    yield Lib.getState(ctx, `found ${scrollers.length} scrollable element(s)`);

    for (const el of scrollers) {
      let steps = 0;
      let lastTop = -1;
      while (steps < MAX_STEPS) {
        const step = Math.max(200, el.clientHeight * STEP_FRACTION);
        el.scrollBy({ top: step, behavior: "instant" });
        el.dispatchEvent(new Event("scroll", { bubbles: true }));
        window.dispatchEvent(new Event("scroll"));
        await Lib.sleep(STEP_PAUSE_MS);
        await this.waitForVisibleImages();
        steps++;

        // The story can grow as content loads, so stop only when we stop moving.
        if (el.scrollTop === lastTop) {
          break;
        }
        lastTop = el.scrollTop;
      }
      yield Lib.getState(ctx, `scrolled element ${steps} steps`, "scrolls");
      if (steps > 3) {
        // The main story container has been scrolled; skip the smaller ones.
        break;
      }
    }

    // Pause at the bottom so trailing requests finish.
    await Lib.sleep(5000);
    yield Lib.getState(ctx, "StoryMap scroll complete");
  }
}