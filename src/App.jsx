import { useState } from "react";
import PdfView from "./PdfView";

const products = [
  { id: 1, name: "Product 1", prices: [7, 1, 5, 3, 6, 4], maxProfit: 5 },
  { id: 2, name: "Product 2", prices: [7, 6, 4, 3, 1], maxProfit: 0 },
  { id: 3, name: "Product 3", prices: [2, 8, 1, 5, 4], maxProfit: 4 },
  { id: 4, name: "Product 4", prices: [1, 6, 7, 5, 8, 4], maxProfit: 7 },
];

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);

  function handleSelect(id) {
    const productToSelect = products.find((product) => product.id === id);
    setSelectedProduct(productToSelect);
  }

  return (
    <div className="flex gap-8 outline-4 outline-offset-[20px] outline-rose-600 outline max-w-[800px] w-[800px] p-2 bg-gray-100">
      <ProductList
        products={products}
        selectedProduct={selectedProduct}
        onSelect={handleSelect}
      />

      {selectedProduct && (
        <BestDay
          selectedProduct={selectedProduct}
          onReset={setSelectedProduct}
          key={selectedProduct.name}
        />
      )}
    </div>
  );
}

function BestDay({ selectedProduct, onReset }) {
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(1);
  const profit = selectedProduct.prices[right] - selectedProduct.prices[left];

  const [buyingDate, setBuyingDate] = useState(null);
  const [sellingDate, setSellingDate] = useState(null);
  const currentProfit = sellingDate ? sellingDate - buyingDate : 0;
  const [gameOver, setGameOver] = useState(false);

  function handleBuyNSell(buyingPrice, sellingPrice) {
    setBuyingDate(buyingPrice);
    setSellingDate(sellingPrice);

    if (right === selectedProduct.prices.length - 1) {
      setGameOver(true);
      return;
    }

    setRight((cur) => cur + 1);
  }

  function handleNextDay() {
    if (right === selectedProduct.prices.length - 1) {
      setGameOver(true);
      return;
    }

    if (buyingDate) {
      setRight((cur) => cur + 1);
    } else {
      setLeft((cur) => cur + 1);
      setRight((cur) => cur + 1);
    }
  }

  function handleReset() {
    onReset(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <h3 className="uppercase font-bold">
          Price for the next {selectedProduct.prices.length} days
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {selectedProduct.prices.map((price, i) => (
            <p
              key={i}
              className={`${
                selectedProduct.prices[left] == price
                  ? "bg-rose-400"
                  : selectedProduct.prices[right] === price
                  ? "bg-orange-400"
                  : "bg-gray-200"
              } p-2 rounded-full text-center`}
            >
              {price}
            </p>
          ))}
        </div>
      </div>

      <div className="flex gap-3 font-medium items-center shadow-md p-2 border-l-2 border-stone-900">
        <p>Buy it on {selectedProduct.prices[left]}</p>

        <p>Sell it on {selectedProduct.prices[right]}</p>

        <p>Profit: {profit}</p>

        <Button
          onClick={() =>
            handleBuyNSell(
              selectedProduct.prices[left],
              selectedProduct.prices[right]
            )
          }
          disabled={gameOver}
        >
          Yes
        </Button>
        <Button onClick={handleNextDay} disabled={gameOver}>
          No
        </Button>
      </div>

      {buyingDate && sellingDate && (
        <div className="flex font-medium gap-3 items-center shadow-md p-2 border-l-2 border-stone-900">
          {buyingDate && <h2>You Buy it on {buyingDate}</h2>} |
          {sellingDate && <h2>You sell it on {sellingDate}</h2>} |
          {buyingDate && sellingDate && (
            <h2>Your current Profit is {currentProfit}</h2>
          )}
        </div>
      )}

      {gameOver && (
        <div className="absolute inset-0 backdrop-blur-[1px]">
          <div className="fixed top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] z-10 bg-rose-300 p-8 flex flex-col gap-6 rounded-sm">
            <p className="flex font-medium gap-3 items-center shadow-md p-2 border-l-2 border-stone-900">
              {selectedProduct.maxProfit === 0
                ? "Hard Luck! There is No better day sell this product that brings you profits!"
                : selectedProduct.maxProfit === currentProfit
                ? `Great You have gained maximum profit possible. Maximum profit ${selectedProduct.maxProfit}, Your Profit ${currentProfit} `
                : `Maximum profit ${selectedProduct.maxProfit}, Your Profit ${currentProfit}`}
            </p>
            <div>
              {/* <PdfView text={selectedProduct} currentProfit={currentProfit} /> */}

              <button
                className="self-end bg-stone-800 p-1 text-stone-100"
                onClick={handleReset}
              >
                Restart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductList({ products, selectedProduct, onSelect }) {
  return (
    <ul className="flex flex-col gap-2">
      {products.map((product) => (
        <li
          key={product.id}
          className={`${
            selectedProduct?.id === product.id ? "bg-pink-300" : "bg-gray-200"
          } p-2 flex gap-2 items-center`}
        >
          <span>{product.name}</span>
          <button
            className="p-1 bg-gray-800 text-stone-50"
            onClick={() => onSelect(product.id)}
          >
            Buy N Sell
          </button>
        </li>
      ))}
    </ul>
  );
}

function Button({ onClick, children, ...props }) {
  return (
    <button
      className="bg-pink-600 px-[8px] py-[4px] leading-none uppercase text-stone-50"
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
