import { domToBlob } from "modern-screenshot";

const MAX_CANVAS_SIZE = 16384;
const BACKGROUND = "#faf8f5";

function sanitizeFilename(name: string): string {
  return name.replace(/[\\/:*?"<>|]/g, "-").trim();
}

function getCaptureScale(width: number, height: number): number {
  const preferred = Math.min(window.devicePixelRatio || 1, 2);
  if (width <= 0 || height <= 0) return 1;

  return Math.max(
    0.25,
    Math.min(preferred, MAX_CANVAS_SIZE / width, MAX_CANVAS_SIZE / height)
  );
}

function getElementSize(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  return {
    width: Math.max(element.scrollWidth, Math.ceil(rect.width)),
    height: Math.max(element.scrollHeight, Math.ceil(rect.height)),
  };
}

function fixChartContainers(root: HTMLElement): Array<() => void> {
  const restores: Array<() => void> = [];

  root.querySelectorAll("[data-result-chart]").forEach((node) => {
    const element = node as HTMLElement;
    const rect = element.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const previous = {
      width: element.style.width,
      height: element.style.height,
      minWidth: element.style.minWidth,
      minHeight: element.style.minHeight,
    };

    element.style.width = `${Math.round(rect.width)}px`;
    element.style.height = `${Math.round(rect.height)}px`;
    element.style.minWidth = `${Math.round(rect.width)}px`;
    element.style.minHeight = `${Math.round(rect.height)}px`;

    restores.push(() => {
      element.style.width = previous.width;
      element.style.height = previous.height;
      element.style.minWidth = previous.minWidth;
      element.style.minHeight = previous.minHeight;
    });
  });

  return restores;
}

function injectCaptureStyles(): () => void {
  const style = document.createElement("style");
  style.setAttribute("data-capture-styles", "");
  style.textContent = `
    .prose-magazine blockquote {
      border-left-color: rgba(180, 138, 100, 0.4) !important;
    }
  `;
  document.head.appendChild(style);
  return () => style.remove();
}

async function waitForLayout(): Promise<void> {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
  });
}

function downloadBlob(blob: Blob, filename: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = sanitizeFilename(filename);
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}

async function renderScreenshot(
  element: HTMLElement,
  scale: number
): Promise<Blob> {
  const blob = await domToBlob(element, {
    scale,
    backgroundColor: BACKGROUND,
    maximumCanvasSize: MAX_CANVAS_SIZE,
    timeout: 60000,
    font: false,
    fetch: {
      requestInit: {
        cache: "force-cache",
        mode: "cors",
      },
    },
    onCloneNode: (cloned) => {
      if (!(cloned instanceof HTMLElement)) return;

      cloned.querySelectorAll("[data-result-chart]").forEach((node) => {
        const chart = node as HTMLElement;
        if (!chart.style.height) {
          chart.style.height = "288px";
          chart.style.minHeight = "288px";
        }
      });
    },
  });

  if (!blob) {
    throw new Error("无法生成截图");
  }

  return blob;
}

export async function captureResultScreenshot(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const scrollY = window.scrollY;
  window.scrollTo({ top: 0, behavior: "auto" });

  await document.fonts.ready;
  await waitForLayout();

  const removeStyles = injectCaptureStyles();
  const restoreCharts = fixChartContainers(element);

  try {
    await waitForLayout();

    const { width, height } = getElementSize(element);
    const preferredScale = getCaptureScale(width, height);

    let blob: Blob;
    try {
      blob = await renderScreenshot(element, preferredScale);
    } catch {
      blob = await renderScreenshot(element, 1);
    }

    downloadBlob(blob, filename);
  } finally {
    restoreCharts.forEach((restore) => restore());
    removeStyles();
    window.scrollTo({ top: scrollY, behavior: "auto" });
  }
}
