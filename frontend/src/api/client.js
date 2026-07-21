async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `HTTP Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData && errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // Fallback to generic status message if body isn't JSON
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

//L_Photos image retrieval with default placeholder image
export function getPrimaryPhotoUrl(rawPhotos) {
  const DEFAULT_IMAGE = 'https://via.placeholder.com/400x300?text=No+Image+Available';

  if (!rawPhotos) {
    return DEFAULT_IMAGE;
  }

  try {
    //basically if it's alr an array parse that otherwise parse as json
    const parsed = Array.isArray(rawPhotos) ? rawPhotos : JSON.parse(rawPhotos);

    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
      return parsed[0];
    }
  } catch (err) {
    console.warn('Failed to parse L_Photos:', rawPhotos, err);
  }

  return DEFAULT_IMAGE;
}