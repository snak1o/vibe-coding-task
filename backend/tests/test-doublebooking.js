const BASE_URL = "http://localhost:3000";

async function request(method, path, body, token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });
  return { status: res.status, data: await res.json() };
}

async function test() {
  await request("POST", "/api/auth/register", {
    name: "Admin",
    email: "dbadmin@test.com",
    password: "123456",
    role: "admin"
  });

  const adminLogin = await request("POST", "/api/auth/login", {
    email: "dbadmin@test.com",
    password: "123456"
  });
  const adminToken = adminLogin.data.token;

  await request("POST", "/api/auth/register", {
    name: "User",
    email: "dbuser@test.com",
    password: "123456"
  });

  const userLogin = await request("POST", "/api/auth/login", {
    email: "dbuser@test.com",
    password: "123456"
  });
  const userToken = userLogin.data.token;

  const slot = await request("POST", "/api/slots", {
    start: "2026-06-01T09:00:00Z",
    end: "2026-06-01T10:00:00Z"
  }, adminToken);
  const slotId = slot.data._id;

  const first = await request("POST", "/api/appointments", { slotId }, userToken);
  console.log(`First booking: ${first.status}`, first.data);

  const second = await request("POST", "/api/appointments", { slotId }, userToken);
  console.log(`Second booking: ${second.status}`, second.data);

  if (first.status === 201 && second.status === 400) {
    console.log("PASS: Doublebooking prevented");
  } else {
    console.log("FAIL: Doublebooking not prevented");
  }
}

test();
