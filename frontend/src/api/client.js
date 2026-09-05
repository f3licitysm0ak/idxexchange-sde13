async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      //empty bc we are just passing forward the data OR the error if present 
      
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

//property fetch request with filters as query params
export async function fetchProperties(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  const url = `/api/properties${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url);

  return handleResponse(response);
}

//request for getting a particular property by its id 
export async function getPropertyById(id) {
  const response = await fetch(`/api/properties/${id}`);
  return handleResponse(response);
}

export async function getOpenHouses(id) {
  const response = await fetch(`/api/properties/${id}/openhouses`);
  return handleResponse(response);
}

export function parsePhotos(rawPhotos) {
  if (!rawPhotos) {
    return [];
  }

  try {
    const parsed = Array.isArray(rawPhotos) ? rawPhotos : JSON.parse(rawPhotos);
    return Array.isArray(parsed)
      ? parsed.filter((photo) => typeof photo === 'string' && photo.trim() !== '').map((photo) => photo.trim())
      : [];
  } catch {
    return [];
  }
}

//L_Photos image retrieval with default placeholder image
export function getPrimaryPhotoUrl(rawPhotos) {
  const DEFAULT_IMAGE = 'https://via.placeholder.com/400x300?text=No+Image+Available';
  return parsePhotos(rawPhotos)[0] || DEFAULT_IMAGE;
}