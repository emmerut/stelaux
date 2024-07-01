import { getCookie } from '@/constant/sessions'

function getCSRF(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export const productData = async () => {
    const csrftoken = getCookie('csrftoken');
  
    try {
      const response = await fetch('http://127.0.0.1:8000/v1/inventory/list_product_all/', { // Adjust URL if needed
        method: 'GET',
        headers: {
          'X-CSRFToken': csrftoken
        }
      });
  
      if (!response.ok) {
        throw new Error('Error fetching product data');
      }
  
      const data = await response.json();
  
      // Handle empty data as needed
      if (data.products.length === 0) {
        console.warn("Warning: No products available.");
      }
  
      // You might want to process data further here
      // ...
  
      return data; // Return only the product data
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
};

export const serviceData = async () => {
  const csrftoken = getCookie('csrftoken');

  try {
    const response = await fetch('http://127.0.0.1:8000/v1/inventory/list_service_all/', { // Adjust URL if needed
      method: 'GET',
      headers: {
        'X-CSRFToken': csrftoken
      }
    });

    if (!response.ok) {
      throw new Error('Error fetching service data');
    }

    const data = await response.json();

    // Handle empty data as needed
    if (data.services.length === 0) {
      console.warn("Warning: No services available.");
    }

    // You might want to process data further here
    // ...

    return data; // Return only the service data
  } catch (error) {
    console.error("Error fetching service data:", error);
    return null;
  }
};

export const financeData = async () => {
  const csrftoken = getCSRF('csrftoken');
  const userToken = getCookie('user_token');

  try {
    const response = await fetch('http://127.0.0.1:8000/v1/finance/finance_all_data/', { // Adjust URL if needed
      method: 'GET',
      headers: {
        'X-CSRFToken': csrftoken,
        'Authorization': `${userToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Error fetching service data');
    }

    const data = await response.json();

    return data; // Return only the service data
  } catch (error) {
    console.error("Error fetching service data:", error);
    return null;
  }
};

export const ordersData = async () => {
  const csrftoken = getCookie('csrftoken');

  try {
    const response = await fetch('http://127.0.0.1:8000/v1/inventory/list_service_all/', { // Adjust URL if needed
      method: 'GET',
      headers: {
        'X-CSRFToken': csrftoken
      }
    });

    if (!response.ok) {
      throw new Error('Error fetching service data');
    }

    const data = await response.json();

    // Handle empty data as needed
    if (data.services.length === 0) {
      console.warn("Warning: No services available.");
    }

    // You might want to process data further here
    // ...

    return data; // Return only the service data
  } catch (error) {
    console.error("Error fetching service data:", error);
    return null;
  }
};

export const getUserData = async () => {
  const csrftoken = getCSRF('csrftoken');
  const userToken = getCookie('user_token');

  try {
    const response = await fetch('http://127.0.0.1:8000/v1/users/user_all_data/', { // Adjust URL if needed
      method: 'GET',
      headers: {
        'X-CSRFToken': csrftoken,
        'Authorization': `${userToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Error fetching service data');
    }

    const data = await response.json();

    return data; // Return only the service data
  } catch (error) {
    console.error("Error fetching service data:", error);
    return null;
  }
};