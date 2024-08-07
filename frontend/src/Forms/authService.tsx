import apiClient from '../apiClient';

export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post('/auth/Login', { email, password });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as { response: { data: { message: string } } };
      throw new Error(axiosError.response.data.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

export const signup = async (
  email: string,
  password: string,
  firstName: string,
  middleName: string,
  lastName: string,
  mobilePhone: string,
  countryOfResidence: string,
  cohortYear: Number,
  parentFirstName: string,
  parentMiddleName: string,
  parentLastName: string,
  parentEmail: string,
  parentMobilePhone: string
) => {
  try {
    const response = await apiClient.post('/auth/Signup', {
      firstName,
      middleName,
      lastName,
      email,
      password,
      mobilePhone,
      countryOfResidence,
      cohortYear,
      parentFirstName,
      parentMiddleName,
      parentLastName,
      parentEmail,
      parentMobilePhone
    });
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else if (typeof error === 'object' && error !== null && 'response' in error) {
      const axiosError = error as { response: { data: { message: string } } };
      throw new Error(axiosError.response.data.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

export const logout = async () => {
  try {
   
    const Admi = localStorage.getItem('isAdmin') 
    console.log('admin?',Admi)

    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    await apiClient.post(
      '/auth/Logout',
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Clear localStorage
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    console.log('isAdmin:', isAdmin); // Verify this value

    localStorage.removeItem('token');
    localStorage.removeItem('email');
    if (isAdmin) {
      window.location.href = '/admin-login';
    } else {
      window.location.href = '/';
    }

  } catch (error) {
    console.error('Logout failed:', error);
    alert('Logout Failed')
  }
};