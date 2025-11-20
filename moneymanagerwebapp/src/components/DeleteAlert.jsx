import { LoaderCircle } from 'lucide-react';
import React, { useState } from 'react'

const DeleteAlert = ({ content, onDelete }) => {
    const [loading, setLoading] = useState(false)
    const handleDelete = async () => {
        setLoading(true);
        try {
            await onDelete();
        }
        finally {
            setLoading(false);
        }
    }
    return (
        <div>
            <p className="text-sm">{content}</p>
            <div className="flex justify-end mt-6">
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    type="button"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg "
                >
                    {
                        loading ? (
                            <>
                                <LoaderCircle className='h-4 w-4 animate-spin' />
                                Deleting...
                            </>
                        ) : (
                            <>
                                Delete
                            </>
                        )
                    }
                </button>

            </div>
        </div>
    )
}

export default DeleteAlert
