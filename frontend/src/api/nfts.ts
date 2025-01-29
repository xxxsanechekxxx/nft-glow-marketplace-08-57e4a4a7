import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchNFTs = async (page: number, limit: number = 8) => {
  const response = await axios.get(`${API_URL}/nfts?page=${page}&limit=${limit}`);
  return response.data;
};

export const fetchNFTById = async (id: string) => {
  const response = await axios.get(`${API_URL}/nfts/${id}`);
  return response.data;
};

export const createNFT = async (nftData: {
  name: string;
  image: string;
  price: string;
  creator: string;
  endTime: string;
}) => {
  const response = await axios.post(`${API_URL}/nfts`, nftData);
  return response.data;
};