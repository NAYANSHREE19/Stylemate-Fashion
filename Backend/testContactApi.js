import axios from 'axios';

async function testContactApi() {
  try {
    const response = await axios.post('http://localhost:5000/api/contact', {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Hello this is a test from API.'
    });
    console.log('Success!', response.data);
  } catch (error) {
    if (error.response) {
      console.log('Error Response:', error.response.status, error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testContactApi();
