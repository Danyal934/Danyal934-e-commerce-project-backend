// using native fetch
// If node-fetch is not available, we can use built-in fetch if Node version is recent
// We will use a try-catch block to handle this script execution

const MAIN_URL = 'http://localhost:5000/api';

async function runTests() {
    console.log('Running RBAC Tests...');

    // 1. Register a regular user
    const userEmail = `testuser_${Date.now()}@example.com`;
    console.log(`\n1. Registering new regular user: ${userEmail}`);
    let userToken;
    try {
        const res = await fetch(`${MAIN_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test User',
                email: userEmail,
                password: 'password123'
            })
        });
        const data = await res.json();
        if (res.status === 201 || res.status === 200) {
            console.log('✅ User registered successfully');
            userToken = data.token;
            console.log(`   Role: ${data.role || 'user'}`);
        } else {
            console.error('❌ User registration failed:', data.message);
            return;
        }
    } catch (e) {
        console.error('❌ Error testing user registration:', e.message);
        return;
    }

    // 2. Try to access Protected Admin Route (Product Creation) as User
    console.log('\n2. Testing Admin Route (Create Product) as Regular User');
    try {
        const res = await fetch(`${MAIN_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({
                name: 'Hacker Product',
                price: 0,
                description: 'Should fail',
                category: 'Hack',
                stock: 10
            })
        });
        const data = await res.json();
        if (res.status === 403 || res.status === 401) {
            console.log(`✅ Access denied as expected (Status: ${res.status})`);
        } else {
            console.error(`❌ Access NOT denied! Status: ${res.status}`);
        }
    } catch (e) {
        console.error('❌ Error testing admin route:', e.message);
    }

    // 3. Login as Admin
    console.log('\n3. Logging in as Admin');
    let adminToken;
    try {
        const res = await fetch(`${MAIN_URL}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'admin@example.com',
                password: 'adminpassword123'
            })
        });
        const data = await res.json();
        if (res.status === 200) {
            console.log('✅ Admin login successful');
            adminToken = data.token;
            console.log(`   Role: ${data.role}`);
        } else {
            console.error('❌ Admin login failed:', data.message);
            return; // Cannot proceed
        }
    } catch (e) {
        console.error('❌ Error testing admin login:', e.message);
        return;
    }

    // 4. Try to access Protected Admin Route as Admin
    console.log('\n4. Testing Admin Route (Get Admin Profile) as Admin');
    try {
        const res = await fetch(`${MAIN_URL}/admin/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });
        const data = await res.json();
        if (res.status === 200) {
            console.log('✅ Access granted (Status: 200)');
        } else {
            console.error(`❌ Access failed! Status: ${res.status}`, data);
        }
    } catch (e) {
        console.error('❌ Error testing admin access:', e.message);
    }

    console.log('\nTests Completed.');
}

runTests();
