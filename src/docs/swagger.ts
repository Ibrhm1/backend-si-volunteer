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
    {
      url: 'https://api-si-volunteer.vercel.app/api',
      description: 'Production server',
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
        organizerName: 'Organizer Name',
        email: 'emailOrganizer@gmail.com',
        password: 'Organizer123',
        confirmPassword: 'Organizer123',
        contactPerson: 'John Doe',
        descriptionOrganizer: 'Organizer Description',
        dateEstablished: '2025-01-01',
        phone: '0812345678',
        location: {
          domicile: 'Region Id',
          address: 'Jln. Mangga 2',
        },
      },
      LoginOrganizerRequest: {
        identifier: 'emailOrganizer@gmail.com / Organizer Name',
        password: 'Organizer123',
      },
      ActivationOrganizerRequest: {
        code: 'activationCode',
      },
      CreateCategoryRequest: {
        name: 'Category Name',
        description: 'Category Description',
        image: 'File Url',
      },
      DeleteFileRequest: {
        fileUrl: 'File Url',
      },
    },
  },
};

swaggerAutogen({
  openapi: '3.0.0',
})(outputFile, endpointsFiles, doc);
