'use server';

const Login = async () => {
  try {
    const response = await fetch('login');
    const data = await response.json();
    return data;
  } catch (e) {
    console.log(e);
  }
};
