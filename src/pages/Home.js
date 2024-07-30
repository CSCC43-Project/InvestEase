import Header from '../components/Header';
import FullStocks from './FullStocks';

export default function Home() {
    return (
        <div>
            <Header profile={true}/>
            <FullStocks />
        </div>
    );
}