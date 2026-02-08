
const { File } = require("buffer");

async function testFullFlow() {
  const baseURL = "http://localhost:5001";
  
  console.log("=== STARTING FULL FLOW TEST ===");

  try {
    // 1. Login
    console.log("\n1. Logging in...");
    const loginRes = await fetch(`${baseURL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "arifin@example.com", password: "password123" }),
    });

    if (!loginRes.ok) {
      throw new Error(`Login failed: ${await loginRes.text()}`);
    }

    const { token, user } = await loginRes.json();
    console.log("✅ Login successful. User ID:", user.id);

    // 2. Upload Avatar
    console.log("\n2. Uploading Avatar...");
    const avatarData = new FormData();
    const avatarFile = new File(["fake image content"], "avatar.png", { type: "image/png" });
    avatarData.append("avatar", avatarFile);

    const avatarRes = await fetch(`${baseURL}/users/me/avatar`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: avatarData,
    });

    if (!avatarRes.ok) {
      throw new Error(`Avatar upload failed: ${await avatarRes.text()}`);
    }

    const avatarJson = await avatarRes.json();
    console.log("✅ Avatar upload successful.");
    console.log("Avatar Path from DB:", avatarJson.user.avatarPath);

    // 3. Verify Avatar Image Access
    const avatarUrl = `${baseURL}${avatarJson.user.avatarPath}`;
    console.log(`\n3. Verifying Avatar Access at: ${avatarUrl}`);
    const checkAvatar = await fetch(avatarUrl);
    if (checkAvatar.ok) {
      console.log("✅ Avatar image is accessible (200 OK).");
    } else {
      console.error("❌ Avatar image is NOT accessible:", checkAvatar.status);
    }

    // 4. Create Post with Image
    console.log("\n4. Creating Post with Image...");
    const postData = new FormData();
    postData.append("title", "Automated Test Post");
    postData.append("content", "This is a test post created by the test script.");
    postData.append("category", "Test");
    const postFile = new File(["fake post image"], "post.png", { type: "image/png" });
    postData.append("image", postFile);

    const postRes = await fetch(`${baseURL}/posts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: postData,
    });

    if (!postRes.ok) {
      throw new Error(`Post creation failed: ${await postRes.text()}`);
    }

    const postJson = await postRes.json();
    console.log("✅ Post creation successful.");
    console.log("Post Image Path:", postJson.post.image);

    // 5. Verify Post Image Access
    const postImageUrl = `${baseURL}${postJson.post.image}`;
    console.log(`\n5. Verifying Post Image Access at: ${postImageUrl}`);
    const checkPostImage = await fetch(postImageUrl);
    if (checkPostImage.ok) {
      console.log("✅ Post image is accessible (200 OK).");
    } else {
      console.error("❌ Post image is NOT accessible:", checkPostImage.status);
    }

    console.log("\n=== TEST COMPLETED SUCCESSFULLY ===");

  } catch (err) {
    console.error("\n❌ TEST FAILED:", err.message);
  }
}

testFullFlow();
