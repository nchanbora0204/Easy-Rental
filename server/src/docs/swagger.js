import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "CarRental API",
    version: "1.0.0",
    description:
      "Tài liệu API cho project CarRental (Express + MongoDB). Bao gồm Auth, Cars, Bookings, Payments, Reviews.",
  },
  servers: [{ url: "http://localhost:5000", description: "Local" }],
  components: {
    securitySchemes: {
      bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
    },
  },
  security: [{ bearerAuth: [] }],
};

export const swaggerOptions = {
  swaggerDefinition,
  // Quét toàn bộ routes/controller để đọc @swagger JSDoc
  apis: ["./src/**/*.js"],
};

export function buildSwaggerSpec() {
  return swaggerJSDoc(swaggerOptions);
}
