import ApiDocCard from "@/component/ApiDocCard";
export default function ApiDocPage() {
    return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">API Documentation</h1>

      <ApiDocCard
        method="POST"
        path="/api/login"
        description="takes an email and password as input and returns a JWT token."
        exampleRequest={{
          email: "user@example.com",
          password: "secret123",
        }}
        exampleResponse={{
          id: "12",
          name: "test",
          email: "user@example.com",
          role: "user",
          token: "token123",
        }}
      />

      <ApiDocCard
        method="POST"
        path="/api/whatsapp/send-message"
        description="Sends a WhatsApp message."
        exampleRequest={{
          deviceId: "12",
          phoneNumber: "1234567890",
          message: "Hello, world!",
        }}
        exampleHeaders={{
          "Content-Type": "application/json",
          "authorization": `Bearer yourtoken`,
        }}
      
        exampleResponse={{
          code: 200,
          message: "Message sent successfully",
          data: {
            deviceId: "12",
            phoneNumber: "1234567890",
            message: "Hello, world!",
          }
        }}
      />

      <ApiDocCard
        method="POST"
        path="/api/whatsapp/send-message-ai-birthday"
        description="Sends a birthday message using AI."
        exampleRequest={{
          deviceId: "12",
          phoneNumber: "1234567890",
          gender: "male/female",
          ageUsers: "20",
          usersName: "John Doe"
        }}
        exampleHeaders={{
          "Content-Type": "application/json",
          "authorization": `Bearer yourtoken`,
        }}
      
        exampleResponse={{
          code: 200,
          message: "Message sent successfully",
          data: {
            deviceId: "12",
            phoneNumber: "1234567890",
            message: "Hello, world!",
          }
        }}
      />
    </div>
  );
}