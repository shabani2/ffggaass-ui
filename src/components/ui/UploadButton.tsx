import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import UploadIcon from '@mui/icons-material/Upload';
import { fetchMvtStocks, importMvtStock } from '@/Redux/Admin/mvtStockSlice';
import { AppDispatch, RootState } from '@/Redux/Store';
import { fetchProduits } from '@/Redux/Admin/productSlice';
import { fetchCategories } from '@/Redux/Admin/categorySlice';

const UploadButton: React.FC = () => {
  const dispatch: AppDispatch = useDispatch<AppDispatch>();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const loading = useSelector((state: RootState) => state.mvtStock.loading);
  const error = useSelector((state: RootState) => state.mvtStock.error);

  const handleUploadClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      dispatch(importMvtStock(file));
      dispatch(fetchMvtStocks());
      dispatch(fetchProduits());
      dispatch(fetchCategories());
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={inputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={<UploadIcon />}
        onClick={handleUploadClick}
        disabled={loading}
      >
        {loading ? 'Uploading...' : 'Upload CSV'}
      </Button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default UploadButton;
