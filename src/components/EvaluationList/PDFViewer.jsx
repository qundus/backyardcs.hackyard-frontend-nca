import { Document, Page } from "react-pdf/dist/esm/entry.vite";
import { useState } from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import LargeLoadingIndicator from "../Shared/LargeLoadingIndicator";
const options = {
  cMapUrl: "cmaps/",
  cMapPacked: true,
  standardFontDataUrl: "standard_fonts/",
};

const PDFViewer = ({ pdfFile }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
  }

  // function onDocumentLoadSuccess({ numPages: nextNumPages }) {
  //   setNumPages(nextNumPages);
  // }

  function changePage(offset) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  if (pdfFile && pdfFile.endsWith("pdf"))
    return (
      // <div className="">

      //   <Document
      //     onLoadError={console.error}
      //     file={SamplePDF}
      //     onLoadSuccess={onDocumentLoadSuccess}
      //   >
      //     <Page pageNumber={pageNumber} />
      //   </Document>
      //   <p className="text-6xl text-red-500">
      //     Page {pageNumber} of {numPages}
      //   </p>
      // </div>
      // <div className="Example__container__document">
      //   <Document
      //     file={SamplePDF}
      //     onLoadSuccess={onDocumentLoadSuccess}
      //     options={options}
      //   >
      //     {Array.from(new Array(numPages), (el, index) => (
      //       <Page key={`page_${index + 1}`} pageNumber={index + 1} />
      //     ))}
      //   </Document>
      // </div>
      <div className="Example__container__document">
        <Document
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<LargeLoadingIndicator />}
        >
          <Page pageNumber={pageNumber} width={600} />
        </Document>
      </div>
      // <Document
      //   className="h-[100px] w-full"
      //   onLoadError={console.error}
      //   onLoadSuccess={onDocumentLoadSuccess}
      //   file={"http://www.example.com/sample.pdf"}
      // >
      //   <Page pageNumber={pageNumber} />
      // </Document>
    );
};

export default PDFViewer;
