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
    email: "appadmin@test.com",
    password: "123456",
    role: "admin"
  });

  const adminLogin = await request("POST", "/api/auth/login", {
    email: "appadmin@test.com",
    password: "123456"
  });
  const adminToken = adminLogin.data.token;

  await request("POST", "/api/auth/register", {
    name: "User",
    email: "appuser@test.com",
    password: "123456"
  });

  const userLogin = await request("POST", "/api/auth/login", {
    email: "appuser@test.com",
    password: "123456"
  });
  const userToken = userLogin.data.token;

  const slot = await request("POST", "/api/slots", {
    start: "2026-07-01T09:00:00Z",
    end: "2026-07-01T10:00:00Z"
  }, adminToken);
  const slotId = slot.data._id;

  const noBody = await request("POST", "/api/appointments", {}, userToken);
  console.log(`Missing slotId: ${noBody.status}`, noBody.data);

  const noAuth = await request("POST", "/api/appointments", { slotId });
  console.log(`No token: ${noAuth.status}`, noAuth.data);

  const badSlot = await request("POST", "/api/appointments", { slotId: "000000000000000000000000" }, userToken);
  console.log(`Invalid slot: ${badSlot.status}`, badSlot.data);

  const success = await request("POST", "/api/appointments", { slotId }, userToken);
  console.log(`Valid booking: ${success.status}`, success.data);

  const results = [
    noBody.status === 400,
    noAuth.status === 401,
    badSlot.status === 404,
    success.status === 201 && success.data.slot === slotId && success.data.status === "pending"
  ];

  if (results.every(Boolean)) {
    console.log("PASS: All appointment creation tests passed");
  } else {
    console.log("FAIL: Some tests failed", results);
  }
}

test();
