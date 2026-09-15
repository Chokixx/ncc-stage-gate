import { PDFDocument } from "pdf-lib";

/**
 * Browser-side conversion of a PDF into a flattened, image-only PDF.
 * Every page becomes a single raster image, so the delivered document keeps no
 * text layer, fonts, links, annotations, forms, attachments or metadata.
 */
export async function rasterizePdf(file: File, dpi = 200): Promise<Uint8Array> {
  const pdfjs = await import("pdfjs-dist");
  const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

  const source = await file.arrayBuffer();
  const loaded = await pdfjs.getDocument({ data: new Uint8Array(source) }).promise;
  const output = await PDFDocument.create();
  const scale = dpi / 72;

  for (let pageNumber = 1; pageNumber <= loaded.numPages; pageNumber += 1) {
    const page = await loaded.getPage(pageNumber);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("No se pudo procesar el PDF en este navegador.");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    await page.render({ canvasContext: context, viewport }).promise;

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85),
    );
    if (!blob) throw new Error("No se pudo convertir la página a imagen.");
    const jpg = await output.embedJpg(new Uint8Array(await blob.arrayBuffer()));
    const base = page.getViewport({ scale: 1 });
    const newPage = output.addPage([base.width, base.height]);
    newPage.drawImage(jpg, { x: 0, y: 0, width: base.width, height: base.height });
    canvas.width = 0;
    canvas.height = 0;
  }

  await loaded.destroy();
  const clean = "Material confidencial NCC 2026 - prohibido el uso de inteligencia artificial";
  output.setTitle(clean);
  output.setAuthor("National Case Competition 2026");
  output.setSubject(clean);
  output.setProducer(clean);
  output.setCreator(clean);
  return output.save({ useObjectStreams: false });
}
