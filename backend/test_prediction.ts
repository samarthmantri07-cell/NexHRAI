import axios from 'axios';

async function testPrediction() {
  try {
    const loginRes = await axios.post('http://localhost:5000/api/v1/auth/login', {
      email: 'admin@nexhr.com',
      password: 'admin'
    });
    const token = loginRes.headers['set-cookie'] ? loginRes.headers['set-cookie'][0] : '';
    console.log('Got cookie:', !!token);

    const empRes = await axios.get('http://localhost:5000/api/v1/employees?page=1&limit=1', {
      headers: { Cookie: token }
    });
    const employeeId = empRes.data.data.employees[0].id;
    console.log('Got employee ID:', employeeId);

    console.log('Calling predict API...');
    const predRes = await axios.post(`http://localhost:5000/api/v1/predictions/${employeeId}`, {}, {
      headers: { Cookie: token }
    });
    
    console.log('Prediction Response:', predRes.status, JSON.stringify(predRes.data, null, 2));
  } catch (error: any) {
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
    } else {
      console.error('Error message:', error.message);
    }
  }
}

testPrediction();
