export default function StockInfo({ openStockInfo, stockInformation, setStockSymbol }) {
    function handleClick () {
        openStockInfo(true);
        setStockSymbol(stockInformation.symbol);
    }
    return(
        <tr>
            <td>{stockInformation.symbol}</td>
            <td>{stockInformation.timestamp}</td>
            <td>{stockInformation.open}</td>
            <td>{stockInformation.high}</td>
            <td>{stockInformation.low}</td>
            <td>{stockInformation.close}</td>
            <td>{stockInformation.volume}</td>
            <td><button onClick={() => {handleClick()}}>View Statistics</button></td>
        </tr>
    );
}