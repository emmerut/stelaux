import { getCookie } from '@/constant/sessions'
import { Navigate } from 'react-router-dom';
import { apiGetDataReqPortal, apiGetPortal, apiDeletePortalUrl } from '@/constant/apiUrl'

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

/* metodos GET */
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

export const getPortal = async (portal_id) => {
  const csrftoken = getCSRF('csrftoken');
  const userToken = getCookie('user_token');

  try {
    const url = portal_id ? `${apiGetPortal}?portal_id=${portal_id}` : apiGetPortal;
    const response = await fetch(url, { // Adjust URL if needed
      method: 'GET',
      headers: {
        'X-CSRFToken': csrftoken,
        'Authorization': `${userToken}`
      },
    });

    if (!response.ok) {
      throw new Error('Error fetching service data');
    }

    const data = await response.json();

    return data; // Return only the service data
  } catch (error) {
    console.error("Error fetching service data:", error);
    return;
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
    return;
  }
};

export const getPortalRequirement = async () => {
  const csrftoken = getCSRF('csrftoken');
  const userToken = getCookie('user_token');

  try {
    const response = await fetch(apiGetDataReqPortal, { // Adjust URL if needed
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
    return;
  }
};

export const getProducts = async () => {
} 

export const retrievePurchase = async () => {
  const csrftoken = getCSRF('csrftoken');
  const userToken = getCookie('user_token');

  try {
    const response = await fetch('http://127.0.0.1:8000/v1/payments/get_purchase/', { // Adjust URL if needed
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
    Navigate('/plans')
  }

}

export const getPaymentMethods = async () => {
  const csrftoken = getCSRF('csrftoken');
  const userToken = getCookie('user_token');

  try {
    const response = await fetch('http://127.0.0.1:8000/v1/payments/get_payment_methods/', { // Adjust URL if needed
      method: 'GET',
      headers: {
        'X-CSRFToken': csrftoken,
        'Authorization': `${userToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Error fetching payment methods');
    }

    const data = await response.json();

    return data; // Return the payment methods data
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return null;
  }
};

export const getPlans = async () => {
  const csrftoken = getCSRF('csrftoken');
  const userToken = getCookie('user_token');

  try {
    const response = await fetch('http://127.0.0.1:8000/v1/payments/get_plans/', { // Adjust URL if needed
      method: 'GET',
      headers: {
        'X-CSRFToken': csrftoken,
        'Authorization': `${userToken}`
      }
    });

    if (!response.ok) {
      throw new Error('Error fetching payment methods');
    }

    const data = await response.json();

    return data; // Return the payment methods data
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return null;
  }
};

/* metodos POST */
export const triggerNewcomerPlan = async (title, price, check, plan_id) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/v1/payments/create_purchase/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRF('csrftoken'),
        },
        body: JSON.stringify({
          title,
          price,
          plan_id,
          token: getCookie('user_token'),
          annually: check,
          type: 'newcomerPlan'
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Error creating purchase:', response.status);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error during checkout:', error);
  }
};

export const createPaymentIntent = async () => {
  const csrftoken = getCookie('csrftoken');
  const userToken = getCookie('user_token');

  try {
    const res = await fetch('http://127.0.0.1:8000/v1/payments/create_setup_intent/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
        'Authorization': `${userToken}`
      },
    });

    if (!res.ok) {
      throw new Error('Error creating payment intent:', response.status);
    }

    const data = await res.json();
    return data; // Assuming the API returns the clientSecret

  } catch (error) {
    console.error('Error creating payment intent:', error);
  }
};

export const createPaymentMethod = async ({ type, setup_id }) => {
  const csrftoken = getCookie('csrftoken');
  const userToken = getCookie('user_token');

  try {
    const res = await fetch('http://127.0.0.1:8000/v1/payments/create_payment_method/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
        'Authorization': `${userToken}`
      },
      body: JSON.stringify({
        type,
        setup_id
      })
    });

    if (!res.ok) {
      throw new Error('Error creating payment method:', res.status);
    }

    const data = await res.json();
    return data; // Assuming the API returns the clientSecret

  } catch (error) {
    console.error('Error creating payment method:', error);
  }
};

export const handlerCoupon = async (couponCode) => {

  const csrftoken = getCookie('csrftoken');
  const userToken = getCookie('user_token');

  try {
    const res = await fetch('http://127.0.0.1:8000/v1/payments/handler_coupon/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
        'Authorization': `${userToken}`,
      },
      body: JSON.stringify({ couponCode }),
    });

    if (!res.ok) {
      throw new Error(`Error handling coupon: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error('Error handling coupon:', error);
    throw error; // Re-throw the error for proper handling
  }
};

export const createSubscription = async (plan_id, coupon) => {

  const csrftoken = getCookie('csrftoken');
  const userToken = getCookie('user_token');

  try {
    const res = await fetch('http://127.0.0.1:8000/v1/payments/create_subscription/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken,
        'Authorization': `${userToken}`,
      },
      body: JSON.stringify({
        plan_id,
        coupon
      }),
    });

    if (!res.ok) {
      throw new Error(`Error handling coupon: ${res.status}`);
    }

    return res;
  } catch (error) {
    console.error('Error handling coupon:', error);
    throw error; // Re-throw the error for proper handling
  }
};

/* metodos DELETE */
export const deletePaymentMethod = async (pay_id) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/v1/payments/delete_payment_method/`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRF('csrftoken'),
        },
        body: JSON.stringify({
          token: getCookie('user_token'),
          pay_id,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Error:', response.status);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error during checkout:', error);
  }
};

export const deleteContent = async (object_id) => {
  try {
    const response = await fetch(
      `http://127.0.0.1:8000/v1/stela-editor/delete_content/`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRF('csrftoken'),
        },
        body: JSON.stringify({
          token: getCookie('user_token'),
          object_id,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Error:', response.status);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error during checkout:', error);
  }
};

export const apiDeletePortal = async (portal_id) => {
  try {
    const response = await fetch(
      apiDeletePortalUrl,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCSRF('csrftoken'),
        },
        body: JSON.stringify({
          token: getCookie('user_token'),
          portal_id,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Error:', response.status);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error during checkout:', error);
  }
};
