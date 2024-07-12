import './StockHolding.css';
export default function StockHolding() {
    return(
        <tr>
            <th scope="row">APL</th>
            <td>500</td>
            <td>50</td>
            <td>
                <button className='buy'>+</button>    
            </td>
            <td>
                <button className='sell'>-</button>
            </td>
            <td>0</td>
            <td>
                <button className='confirm'>Yes</button>
                <button className='reject'>No</button>
            </td>
        </tr>
    );
}