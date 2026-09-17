/**
 * Abstracted API service for the Virtual Try-On feature.
 * Currently uses a mock/demo mode to simulate generation.
 */

export const generateVirtualTryOn = async ({ userImage, productImage, productType }) => {
  // Demo Mode Implementation
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate random error 10% of the time to test error handling
      if (Math.random() > 0.9) {
        reject(new Error("We couldn't create your preview this time. Please try another photo."));
        return;
      }

      // Return a mock result. In a real scenario, this would be the URL 
      // returned from the AI image generation service.
      resolve({
        success: true,
        // Using a premium placeholder from Unsplash that looks like a Try-On result
        resultUrl: "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&q=80&w=800",
      });
    }, 3000); // 3 seconds loading to show the shimmer animation
  });
};
