import swaggerAutogen from 'swagger-autogen';

const outputFile = './swagger_output.json';
const endpointsFiles = ['../routes/api.ts'];
const doc = {
  info: {
    version: 'v0.0.1',
    title: 'API Documentation siVolunteer',
  },
  servers: [
    {
      url: 'http://localhost:3000/api',
      description: 'Local server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
      },
    },
    schemas: {
      RegisterRequest: {
        fullName: 'Iib Ibrahim',
        username: 'Ibrhm22',
        email: 'ibrhm@yopmail.com',
        password: 'Ibrhm123',
        confirmPassword: 'Ibrhm123',
      },
      LoginRequest: {
        identifier: 'Ibrhm22 / ibrhm@yopmail.com',
        password: 'Ibrhm123',
      },
      ActivationRequest: {
        code: 'activationCode',
      },
      RegisterOrganizerRequest: {
        organizerName: 'organizer 1',
        email: 'abc@gmail.com',
        contactPerson: 'Jajang',
        phone: '0812345678',
        address: 'Jln. Mangga 2',
        password: 'Admin123',
        confirmPassword: 'Admin123',
      },
      LoginOrganizerRequest: {
        identifier: 'abc@gmail.com / organizer 1',
        password: 'Admin123',
      },
      ActivationOrganizerRequest: {
        code: 'activationCode',
      },
    },
  },
};

swaggerAutogen({
  openapi: '3.0.0',
})(outputFile, endpointsFiles, doc);
