import './Stock.css';

export default function Stock({ stocklist }) {
    return(
        <div className="stock-info">
            <h3 className='name'>Stock List {stocklist.stocklistid}</h3>
        </div>
    );
}