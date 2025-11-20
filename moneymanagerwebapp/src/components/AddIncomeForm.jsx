import React, { useState } from 'react';
import EmojiPickerPopup from './EmojiPickerPopup';
import Input from './Input';

const AddIncomeForm = ({ onAddIncome, categories }) => {

    const [income, setIncome] = useState({
        name: '',
        amount: '',
        date: '',
        icon: '',
        categoryId: ''
    });

    // Convert categories to dropdown format
    const categoryOptions = categories.map((category) => ({
        value: category.id,
        label: category.name
    }));

    const handleChange = (key, value) => {
        setIncome({ ...income, [key]: value });
    };

    return (
        <div>
            <EmojiPickerPopup
                icon={income.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
                value={income.name}
                onChange={(value) => handleChange("name", value)}
                label="Income Source"
                placeholder="eg., Salary, Freelance, Bonus"
                type="text"
            />
            <Input
                value={income.categoryId}
                onChange={(value) => handleChange("categoryId", value)}
                label="Category"
                isSelect={true}
                options={categoryOptions}
            />
            <Input
                value={income.amount}
                onChange={(value) => handleChange("amount", value)}
                label="Amount"
                placeholder="eg., 500.00"
                type="number"
            />
            <Input
                value={income.date}
                onChange={(value) => handleChange("date", value)}
                label="Date"
                placeholder=""
                type="date"
            />
            <div className="flex justify-end mt-6">
                <button
                    onClick={() => onAddIncome(income)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                >
                    Add Income
                </button>

            </div>
        </div>
    );
};

export default AddIncomeForm;
