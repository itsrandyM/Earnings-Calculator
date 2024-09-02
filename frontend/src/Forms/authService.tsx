import apiClient from '../apiClient';

export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post('/auth/Login', { email, password });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
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
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error('An unknown error occurred');
    }
  }
};

export const logout = async () => {
  try {
    await apiClient.post('/auth/Logout');
    localStorage.removeItem('email');
    window.location.href = '/';
  } catch (error) {
    console.error('Logout failed:', error);
    alert('Logout Failed')
  }
};
