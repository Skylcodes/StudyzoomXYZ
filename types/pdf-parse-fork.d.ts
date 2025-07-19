declare module 'pdf-parse-fork' {
  interface PDFData {
    text: string;
    numpages: number;
    numrender: number;
    info: unknown;
    metadata: unknown;
    version: string;
  }

  function pdf(buffer: Buffer): Promise<PDFData>;
  
  export default pdf;
}