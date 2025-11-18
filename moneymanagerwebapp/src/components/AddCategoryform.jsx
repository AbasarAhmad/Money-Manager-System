import React, { useState } from 'react'
import Input from '../components/Input'
import EmojiPickerPopup from './EmojiPickerPopup';

const AddCategoryform = () => {
    const [category, setCategory] = useState({
        name: "",
        type: "income",
        icon: ""
    });

    const categoryTypeOptions = [
        { value: "income", label: "Income" },
        { value: "expense", label: "Expense" },
    ];

    const handleChange = (key, value) => {
        setCategory({ ...category, [key]: value });
    };

    return (
        <div className='p-4'>

            <EmojiPickerPopup  
                icon={category.icon}
                onSelect={(selectedIcon) => handleChange("icon", selectedIcon)}
            />

            <Input
                value={category.name}
                onChange={(value) => handleChange("name", value)}
                label="Category Name"
                placeholder="eg. Freelance, Salary, Groceries"
                type="text"
            />

            <Input 
                label="Category Type"
                value={category.type}
                onChange={(value) => handleChange("type", value)}
                isSelect={true}
                options={categoryTypeOptions}
            />

        </div>
    );
};

export default AddCategoryform;
