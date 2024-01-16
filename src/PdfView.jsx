import { usePDF } from "react-to-pdf";

export default function PdfView({ text, currentProfit }) {
  const { toPDF, targetRef } = usePDF({ filename: `use-text.pdf` });

  return (
    <div>
      <button onClick={() => toPDF()}>Download PDF</button>
      <div
        ref={targetRef}
        className="flex font-medium gap-3 items-center shadow-md p-2 border-l-2 border-stone-900"
      >
        <p className="flex font-medium gap-3 items-center shadow-md p-2 border-l-2 border-stone-900">
          {text.maxProfit === 0
            ? "Hard Luck! There is No better day sell this product that brings you profits!"
            : text.maxProfit === currentProfit
            ? `Great You have gained maximum profit possible. Maximum profit ${text.maxProfit}, Your Profit ${currentProfit} `
            : `Maximum profit ${text.maxProfit}, Your Profit ${currentProfit}`}
        </p>
      </div>
    </div>
  );
}
