import React, { useEffect, useState } from 'react';
import EmojiPickerPopup from './EmojiPickerPopup';
import Input from './Input';
import { LoaderCircle } from 'lucide-react';

const AddExpenseForm = ({ onAddExpense, categories }) => {

    const [expense, setExpense] = useState({
        name: '',
        amount: '',
        date: '',
        icon: '',
        categoryId: ''
    });

    const [loading, setLoading] = useState(false);

    const categoryOptions = categories.map((category) => ({
        value: category.id,
        label: category.name
    }));

    const handleChange = (key, value) => {
        setExpense({ ...expense, [key]: value });
    };

    const handleAddExpense = async () => {
        setLoading(true);
        try {
            await onAddExpense(expense);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (categories.length > 0 && !expense.categoryId) {
            setExpense((prev) => ({ ...prev, categoryId: categories[0].id }));
        }
    }, [categories]);

    return (
        <div>
            <EmojiPickerPopup
                icon={expense.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
                value={expense.name}
                onChange={(value) => handleChange("name", value)}
                label="Expense Title"
                placeholder="eg., Food, Travel, Shopping"
                type="text"
            />

            <Input
                value={expense.categoryId}
                onChange={(value) => handleChange("categoryId", value)}
                isSelect={true}
                label="Category"
                options={categoryOptions}
            />

            <Input
                value={expense.amount}
                onChange={(value) => handleChange("amount", value)}
                label="Amount"
                type="number"
            />

            <Input
                value={expense.date}
                onChange={(value) => handleChange("date", value)}
                label="Date"
                type="date"
            />

            <div className="flex justify-end mt-6">
                <button
                    onClick={handleAddExpense}
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                >
                    {loading ? (
                        <>
                            <LoaderCircle className='w-4 h-4 animate-spin' />
                            Adding...
                        </>
                    ) : (
                        <>Add Expense</>
                    )}
                </button>
            </div>
        </div>
    );
};

export default AddExpenseForm;
