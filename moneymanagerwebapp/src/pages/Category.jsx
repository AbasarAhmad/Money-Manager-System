import React, { useEffect, useState } from 'react'
import Dashboard from '../components/Dashboard'
import CategoryList from '../components/CategoryList'
import useUser from '../hooks/useUser';
import { Plus } from "lucide-react";
import axiosConfig from '../Util/axiosConfig';
import { API_ENDPOINTS } from '../Util/apiEndpoints';
import { toast } from 'react-toastify';
import Modal from '../components/Modal';
import AddCategoryform from '../components/AddCategoryform';


const Category = () => {
  useUser();

  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
  const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategoryDetails = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
      if (response.status === 200) {
        console.log('categories', response.data);
        setCategoryData(response.data);
      }
    }
    catch (error) {
      console.error('Something went wrong. Please try again.');
      toast.error(error.message);
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategoryDetails()
  }, []);

  const handleAddCategory= async(category)=>{
   const {name,type,icon}=category;
   if(!name.trim()){
    toast.error("Category Name is required");
    return;
   }

   // check if the category already exists

  const isDuplicate = categoryData.some((category) => {
  return category.name.toLowerCase() === name.trim().toLowerCase();
});


   if(isDuplicate){
    toast.error("Category Name already exists");
    return
   }
   try{
      const response= await axiosConfig.post(API_ENDPOINTS.ADD_CATEGORY,{name,type,icon});
      if(response.status===201)
      {
        toast.success("Category added successfully");
        setOpenAddCategoryModal(false);
        fetchCategoryDetails();
      }
   }
   catch(error){
    console.log("Error adding category ", error);
    toast.error(error.response?.data?.message || "Failed to add category." );
    }
  }



  return (
    <div>
      <Dashboard activeMenu="Category">This is Category page
        <div className="my-5 mx-auto">
          {/* Add button to add category */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-semibold">All Categories</h2>

            <button 
            onClick={()=>setOpenAddCategoryModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              <Plus size={16} />
              Add Category
            </button>

          </div>


          {/* Category list */}
          <CategoryList categories={categoryData} />

          {/* Adding category modal */}
          <Modal
          isOpen={openAddCategoryModal}
          onClose={()=>setOpenAddCategoryModal(false)}
          title="Add Category"
          >
            <AddCategoryform onAddCategory={handleAddCategory} />
          </Modal>

          {/* Updating category modal */}
        </div>
      </Dashboard>

    </div>
  )
}

export default Category
