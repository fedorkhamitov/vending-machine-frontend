import { InsertedCoins } from "../../types/coin";
import "./CoinSelector.css";

interface CoinSelectorProps {
  onCoinChange: (denom: number, count: number) => void;
  insertedCoins: InsertedCoins;
}

const COIN_DENOMINATIONS = [1, 2, 5, 10];
const decl = (n: number) =>
  n === 1 ? "рубль" : n >= 2 && n <= 4 ? "рубля" : "рублей";

export function CoinSelector({ onCoinChange, insertedCoins }: CoinSelectorProps) {
  const inc = (d: number) => onCoinChange(d, (insertedCoins[d] || 0) + 1);
  const dec = (d: number) => {
    const c = insertedCoins[d] || 0;
    if (c > 0) onCoinChange(d, c - 1);
  };

  return (
    <div className="coin-selector">
      <table className="coin-selector__table">
        <thead>
          <tr>
            <th>Номинал</th>
            <th>Количество</th>
            <th>Сумма</th>
          </tr>
        </thead>
        <tbody>
          {COIN_DENOMINATIONS.map((d) => {
            const cnt = insertedCoins[d] || 0;
            return (
              <tr key={d}>
                <td className="td-coin">
                  <div className="coin-icon">{d}</div>
                  <span className="coin-label">
                    {d} {decl(d)}
                  </span>
                </td>

                <td className="td-count">
                  <button
                    className="quantity-btn quantity-btn--decrease"
                    onClick={() => dec(d)}
                    disabled={cnt === 0}
                    aria-label="Уменьшить"
                  >
                    <img
                      src={require("../../assets/icons/minus.svg")}
                      alt="-"
                      className="btn-icon"
                    />
                  </button>

                  <span className="quantity-value">{cnt}</span>

                  <button
                    className="quantity-btn quantity-btn--increase"
                    onClick={() => inc(d)}
                    aria-label="Увеличить"
                  >
                    <img
                      src={require("../../assets/icons/plus.svg")}
                      alt="+"
                      className="btn-icon"
                    />
                  </button>
                </td>

                <td className="td-sum">
                  {(d * cnt).toLocaleString()} руб.
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
