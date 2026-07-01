import * as pdfjsLib from "pdfjs-dist";

// Use the CDN worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
  `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export async function convertPdfToImages(
  file: File
): Promise<File[]> {
  const buffer = await file.arrayBuffer();

  const pdf = await pdfjsLib.getDocument({
    data: buffer,
  }).promise;

  const images: File[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber);

    const viewport = page.getViewport({
      scale: 2,
    });

    const canvas = document.createElement("canvas");

    const context = canvas.getContext("2d")!;

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({
      canvas,
      canvasContext: context,
      viewport,
    }).promise;

    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((blob) => resolve(blob!), "image/png")
    );

    images.push(
      new File(
        [blob],
        `${file.name}-page-${pageNumber}.png`,
        {
          type: "image/png",
        }
      )
    );
  }

  return images;
}