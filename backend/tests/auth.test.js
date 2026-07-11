import { jest } from "@jest/globals";

// Mock the email service to avoid real Resend/Brevo API key & domain restriction errors
jest.unstable_mockModule("../src/services/emailService.js", () => ({
    sendEmail: jest.fn().mockResolvedValue({ messageId: "mock-email-id" })
}));

// Use top-level await to import modules after the mock has been registered
const request = (await import("supertest")).default;
const { connectDB } = await import("../src/config/db.js");
const { redisClient } = await import("../src/config/redis.js");
const { default: OTP } = await import("../src/modules/auth/otp.model.js");
const { default: User } = await import("../src/modules/auth/auth.model.js");
const mongoose = (await import("mongoose")).default;
const { app } = await import("../src/app.js");
const { generateToken, storeRefreshToken } = await import("../src/modules/auth/auth.service.js");

describe("Integration test for Auth API", () => {

    beforeAll(async () => {
        await connectDB();
    });

    afterAll(async () => {
        await mongoose.connection.close();
        await redisClient.quit();
    });

    beforeEach(async () => {
        const testEmail = "kunal@example.com";
        await OTP.deleteMany({ email: testEmail });
        await User.deleteMany({ email: testEmail });
        await redisClient.del(`signup:${testEmail}`);
    });

    test("POST /auth/signup should return 201 for a valid signup request", async () => {
        const { body, statusCode } = await request(app).post("/api/auth/signup").send({
            name: "Kunal",
            email: "kunal@example.com",
            password: "123456",
        });

        expect(statusCode).toBe(201);
        expect(body.message).toBe("OTP sent to email. Please verify to complete registration.");
        expect(body.success).toBe(true);
        expect(body.data).toBe(null);
    })

    it("POST /auth/signup should return 400 if email or password is missing", async () => {
        const { body, statusCode } = await request(app).post("/api/auth/signup").send({
            name: "Kunal",
            email: "kunal@example.com"
        });

        expect(statusCode).toBe(400);
        expect(body.success).toBe(false);
        expect(body.message).toBe("Name, email, and password are required");
    })

    it("POST /auth/signup should return 400 if email is already registered", async () => {
        await User.create({
            name: "Kunal",
            email: "kunal@example.com",
            password: "hashedpassword123",
        });

        const { body, statusCode } = await request(app).post("/api/auth/signup").send({
            name: "Kunal",
            email: "kunal@example.com",
            password: "123456",
        });

        expect(statusCode).toBe(400);
        expect(body.success).toBe(false);
        expect(body.message).toBe("User already exists");
    })

    it("POST /auth/login should return 200 for valid login request",async()=>{
        await User.create({
            name:"Kunal",
            email:"kunal@example.com",
            password:"123456",
            Verified: true
        });
        const {body,statusCode} = await request(app).post("/api/auth/login").send({
            email:"kunal@example.com",
            password:"123456",
        });
        expect(statusCode).toBe(200);
        expect(body.success).toBe(true);
        expect(body.message).toBe("Credentials verified. OTP sent to email.");
    })

    it("POST /auth/logout should return 200 and clear session and cookies", async () => {
        const userId = new mongoose.Types.ObjectId();
        const { accessToken, refreshToken } = generateToken(userId);
        await storeRefreshToken(userId, refreshToken);

        let storedToken = await redisClient.get(userId.toString());
        expect(storedToken).toBe(refreshToken);

        const { body, statusCode, headers } = await request(app)
            .post("/api/auth/logout")
            .set("Cookie", [`refreshToken=${refreshToken}`, `accessToken=${accessToken}`]);

        expect(statusCode).toBe(200);
        expect(body.success).toBe(true);
        expect(body.message).toBe("Logged out successfully");

        expect(headers["set-cookie"]).toBeDefined();
        const setCookieHeaders = headers["set-cookie"].join(";");
        expect(setCookieHeaders).toContain("refreshToken=;");
        expect(setCookieHeaders).toContain("accessToken=;");

        storedToken = await redisClient.get(userId.toString());
        expect(storedToken).toBeNull();
    })
})