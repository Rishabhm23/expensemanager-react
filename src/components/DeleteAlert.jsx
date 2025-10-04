import { LoaderCircle } from "lucide-react";
import { useState } from "react";

const DeleteAlert = ({content, onDelete}) => {

    const [loading, setLoading] = useState(false);

    const handleDelete = async() => {
        setLoading(true);
        try{
            await onDelete();
        }finally{
            setLoading(false);
        }
    }

    return(
        <div>
            <p className="text-sm">
                {content}
            </p>
            <div className="flex justify-end mt-6">
                <button className="add-btn add-btn-fill"
                        onClick={handleDelete}
                        type="button">
                        {loading ? (
                            <>
                                <LoaderCircle className="h-4 w-4 animated-spin"/>
                            </>
                        ) : (
                            <>
                                Delete
                            </>
                        )}
                </button>
            </div>
        </div>
    )
}

export default DeleteAlert;