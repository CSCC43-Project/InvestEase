import Stock from './Stock';

export default function StockList() {
    return (
        <div style={{ overflowY: 'scroll', height: '500px' }}>
            <div style={{ display: 'flex' }}>
                <Stock />
                <Stock />
                <Stock />
            </div>
            <div style={{ display: 'flex' }}>
                <Stock />
                <Stock />
                <Stock />
            </div>
            <div style={{ display: 'flex' }}>
                <Stock />
                <Stock />
                <Stock />
            </div>
        </div>
    );
}
