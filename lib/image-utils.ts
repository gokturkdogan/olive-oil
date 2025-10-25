/**
 * Utility function to safely extract images from product data
 * Handles various formats: string, array, nested array
 */
export function extractProductImages(images: any): string[] {
  let imageArray: string[] = [];
  
  // Handle string format (JSON string)
  if (typeof images === 'string') {
    try {
      imageArray = JSON.parse(images);
    } catch (e) {
      imageArray = [];
    }
  } 
  // Handle array format
  else if (Array.isArray(images)) {
    imageArray = images;
  }
  
  // Recursively flatten nested arrays
  function flattenArray(arr: any[]): string[] {
    const result: string[] = [];
    
    for (const item of arr) {
      if (typeof item === 'string') {
        result.push(item);
      } else if (Array.isArray(item)) {
        result.push(...flattenArray(item));
      }
    }
    
    return result;
  }
  
  // Flatten the array recursively
  imageArray = flattenArray(imageArray);
  
  // Filter out empty strings and ensure we have valid URLs
  return imageArray.filter(img => typeof img === 'string' && img.trim().length > 0);
}
