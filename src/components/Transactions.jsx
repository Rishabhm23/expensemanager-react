import { ArrowRight } from "lucide-react";
import TransactionInfoCard from "./TransactionInfoCard";
import moment from "moment";

const Transactions = ({transactions, onMore, type, title}) => {
    return(
        <div className="card gap-6 bg-white p-6 rounded-2xl shadow-md shadow gray-100 border border-gray-200/50">
            <div className="flex items-center justify-between">
                <h4 className="text-lg">{title}</h4>
                <button className="px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center gap-2" onClick={onMore}>
                    More <ArrowRight className="text-base" size={15}/>
                </button>
            </div>
            <div className="mt-6">
                {transactions?.slice(0,5)?.map(item => (
                    <TransactionInfoCard S
                        key={item.id}
                        title={item.name}
                        icon={item.icon}
                        date={moment(item.date).format("Do MMM YYYY")}
                        amount={item.amount}
                        type={type}
                        hideDeleteBtn
                    />
                ))}
            </div>
            
        </div>
    )
}

export default Transactions;