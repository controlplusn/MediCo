import React, { useState, useEffect } from 'react';
import CardContentAdd from './CardContentAdd.jsx';
import CardSide from './CardSide.jsx';
import axios from 'axios';
import '../../styles/addcard.css';

export const AddCard = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubset, setActiveSubset] = useState(null);

  // Getting the userId using JWT token
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/auth/check-auth', {
          withCredentials: true,
        });
        if (response.data.user) {
          setUserId(response.data.user._id);
        }
      } catch (err) {
        console.error('Error checking authentication:', err);
      }
    };
    
    fetchUser();
  }, []);

  // fetch categories and subset
  useEffect(() => {
    const fetchCategories = async () => {
      if (userId) {
        try {
          const response = await axios.get('http://localhost:3001/api/flashcard/cards', {
            withCredentials: true,
          });
          if (response.data.success) {
            setCategories(response.data.data);
            if (response.data.data.length > 0) {
              setActiveCategory(response.data.data[0]._id);
              if (response.data.data[0].subsets.length > 0) {
                setActiveSubset(response.data.data[0].subsets[0]._id);
              }
            }
          }
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      }
    };

    if (userId) {
      fetchCategories();
    }
    
  }, [userId]);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    const category = categories.find(cat => cat._id === categoryId);
    if (category && category.subsets.length > 0) {
      setActiveSubset(category.subsets[0]._id);
    } else {
      setActiveSubset(null);
    }
  };

  const handleSubsetChange = (subsetId) => {
    setActiveSubset(subsetId);
  };


  return (
    <div className="addcrd-container">
      <CardSide
        setActiveCard={setActiveCard}
        userId={userId}
        categories={categories}
        activeCategory={activeCategory}
        activeSubset={activeSubset}
        onCategoryChange={handleCategoryChange}
        onSubsetChange={handleSubsetChange}
      />
      <CardContentAdd
        activeCard={activeCard}
        userId={userId}
        categoryId={activeCategory}
        subsetId={activeSubset}
      />
    </div>
  );
};

export default AddCard;