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
import DeleteAlert from '../components/DeleteAlert'; // ensure you have this component

const Category = () => {
  useUser();

  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
  const [openEditCategoryModal, setOpenEditCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // New: delete modal state
  const [openDeleteAlert, setOpenDeleteAlert] = useState({ show: false, data: null });

  const fetchCategoryDetails = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await axiosConfig.get(API_ENDPOINTS.GET_ALL_CATEGORIES);
      if (response.status === 200) {
        setCategoryData(response.data);
      }
    }
    catch (error) {
      console.error('Something went wrong. Please try again.', error);
      toast.error(error.response?.data?.message || error.message || "Failed to fetch categories");
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategoryDetails()
  }, []);

  const handleAddCategory = async (category) => {
   const {name,type,icon}=category;
   if(!name.trim()){
    toast.error("Category Name is required");
    return;
   }

   // check if the category already exists
   const isDuplicate = categoryData.some((c) => {
     return c.name.toLowerCase() === name.trim().toLowerCase();
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
    toast.error(error.response?.data?.message || "Failed to add category." );
    }
  }

 const handleEditCategory =(categoryToEdit)=>{
  setSelectedCategory(categoryToEdit);
  setOpenEditCategoryModal(true);
}

  const handleUpdateCategory= async(updatedCategory)=>{
    const {id, name,type,icon}=updatedCategory;
    if(!name.trim()){
      toast.error("Category Name is required ");
      return;
    }
    if(!id){
      toast.error("Category ID missing for update");
      return;
    }
    try{
      const response= await axiosConfig.put(API_ENDPOINTS.UPDATE_CATEGORY(id),{name,type,icon});
      setOpenEditCategoryModal(false);
      setSelectedCategory(null);
      toast.success("Category updated successfully");
      fetchCategoryDetails();
    }
    catch(error)
    {
      console.error('Error updating category: ', error);
      toast.error(error.response?.data?.message || error.message || "Failed to update category.");
    }
  }

  // ----------------------------
  // Delete category
  // ----------------------------
  const confirmDeleteCategory = (categoryId) => {
    setOpenDeleteAlert({ show: true, data: categoryId });
  };

  const handleDeleteCategory = async () => {
    const categoryId = openDeleteAlert.data;
    if (!categoryId) {
      toast.error("No category selected to delete");
      return;
    }
    try {
      const response = await axiosConfig.delete(API_ENDPOINTS.DELETE_CATEGORY(categoryId));
      // backend should return 204 or 200
      setOpenDeleteAlert({ show: false, data: null });
      toast.success("Category deleted successfully");
      fetchCategoryDetails();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast.error(error.response?.data?.message || error.message || "Failed to delete category");
    }
  };

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
          <CategoryList
            categories={categoryData}
            onEditcategory={handleEditCategory}
            onDeleteCategory={(id) => confirmDeleteCategory(id)} // pass delete callback
          />

          {/* Adding category modal */}
          <Modal
            isOpen={openAddCategoryModal}
            onClose={()=>setOpenAddCategoryModal(false)}
            title="Add Category"
          >
            <AddCategoryform onAddCategory={handleAddCategory} />
          </Modal>

          {/* Updating category modal */}
          <Modal
            onClose={()=>{
              setOpenEditCategoryModal(false);
              setSelectedCategory(null);
            }}
            isOpen={openEditCategoryModal}
            title="Update Category"
          >
            <AddCategoryform
              initialCategoryData={selectedCategory}
              onAddCategory={handleUpdateCategory}
              isEditing={true}
            />
          </Modal>

          {/* Delete confirmation modal */}
          <Modal
            isOpen={openDeleteAlert.show}
            onClose={() => setOpenDeleteAlert({ show: false, data: null })}
            title="Delete Category"
          >
            <DeleteAlert
              content="Are you sure you want to delete this category? This action cannot be undone."
              onDelete={handleDeleteCategory}
            />
          </Modal>
        </div>
      </Dashboard>
    </div>
  )
}

export default Category
