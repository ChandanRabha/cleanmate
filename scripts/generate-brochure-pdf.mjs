import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { PDFDocument, rgb } from "pdf-lib";

const imagePath = fileURLToPath(new URL("../public/cleanmate-brochure.png", import.meta.url));
const pdfPath = fileURLToPath(new URL("../public/cleanmate-services-pricing.pdf", import.meta.url));
const document = await PDFDocument.create();
const image = await document.embedPng(await readFile(imagePath));
const pageWidth = 595.28;
const pageHeight = 841.89;
const margin = 18;
const scale = Math.min((pageWidth - margin * 2) / image.width, (pageHeight - margin * 2) / image.height);
const width = image.width * scale;
const height = image.height * scale;
const page = document.addPage([pageWidth, pageHeight]);

page.drawRectangle({ x: 0, y: 0, width: pageWidth, height: pageHeight, color: rgb(1, 1, 1) });
page.drawImage(image, {
  x: (pageWidth - width) / 2,
  y: (pageHeight - height) / 2,
  width,
  height,
});
document.setTitle("CleanMate Services and Pricing");
document.setAuthor("CleanMate Guwahati");
document.setSubject("Professional cleaning services and starting prices");
document.setCreator("CleanMate website");

await writeFile(pdfPath, await document.save());
console.log(`Generated ${pdfPath}`);
