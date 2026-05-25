async function testRegistration() {
  const response = await fetch('http://localhost:3000/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: 'Test User',
      email: 'test' + Date.now() + '@example.com',
      password: 'password123',
    }),
  });

  const data = await response.json();
  console.log('Status:', response.status);
  console.log('Data:', data);
}

testRegistration();
