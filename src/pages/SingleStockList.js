
import { useParams } from 'react-router-dom';
import Header from '../components/Header';


export default function SingleStockList(){
    const listId = useParams().id;

    return (
        <div>
            <Header profile={true}></Header>
            <h1>{listId}</h1>
        </div>
    );
}