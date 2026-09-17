import { create } from 'zustand';

const useTryOnStore = create((set) => ({
  isModalOpen: false,
  userImage: null,
  selectedProduct: null,
  generatedResult: null,
  isGenerating: false,
  generationError: null,
  
  openModal: (product = null) => set({ isModalOpen: true, selectedProduct: product }),
  closeModal: () => set({ isModalOpen: false }),
  setUserImage: (image) => set({ userImage: image }),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setGeneratedResult: (result) => set({ generatedResult: result }),
  setGenerating: (status) => set({ isGenerating: status }),
  setGenerationError: (error) => set({ generationError: error }),
  resetState: () => set({ 
    userImage: null, 
    selectedProduct: null, 
    generatedResult: null, 
    isGenerating: false,
    generationError: null
  }),
  resetResult: () => set({
    generatedResult: null,
    isGenerating: false,
    generationError: null
  })
}));

export default useTryOnStore;
