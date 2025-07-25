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
        email: 'ibrhm@gmail.com',
        address: 'Jln Merderka 123',
        phone: '123123',
        password: 'Ibrhm123',
        confirmPassword: 'Ibrhm123',
      },
      LoginRequest: {
        identifier: 'Ibrhm22',
        password: 'Ibrhm123',
      },
      ActivationRequest: {
        code: 'activationCode',
      },
      UpdateProfileRequest: {
        fullName: 'Iib Ibrahim Update',
        phone: '123123',
        address: 'Jln Merderka 123',
        profilePicture: 'Update-profile.png',
      },
      UpdatePasswordRequest: {
        oldPassword: 'Ibrhm123',
        password: 'Ibrhm1234',
        confirmPassword: 'Ibrhm1234',
      },
      RegisterOrganizerRequest: {
        organizerName: 'Organizer Name',
        email: 'emailOrganizer@gmail.com',
        password: 'Organizer123',
        confirmPassword: 'Organizer123',
        contactPerson: 'John Doe',
        descriptionOrganizer: 'Organizer Description',
        dateEstablished: 'YYYY-MM-DD',
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
      UpdateProfileOrganizerRequest: {
        organizerName: 'Organizer Update 2',
        contactPerson: 'John Doe',
        phone: '08123456789',
        descriptionOrganizer: 'ini update deskripsi',
        dateEstablished: 'YYYY-MM-DD',
        location: {
          domicile: 'asdqw',
          address: 'asd',
        },
        logo: 'update.png',
      },
      UpdatePasswordOrganizerRequest: {
        oldPassword: 'Admin123',
        password: 'Organizer2',
        confirmPassword: 'Organizer2',
      },
      CreateCategoryRequest: {
        name: 'Category Name',
        description: 'Category Description',
        image: 'File Url',
      },
      DeleteFileRequest: {
        fileUrl: 'File Url',
      },
      CreateEventRequest: {
        name: 'Test Event',
        description: 'description test event',
        startDate: 'YYYY-MM-DD HH:MM:SS',
        endDate: 'YYYY-MM-DD HH:MM:SS',
        isOnline: false,
        category: 'Category Id',
        location: {
          region: 'Region Id',
          address: 'Jln. Merdeka',
        },
        image: 'file Url ',
      },
    },
  },
};

swaggerAutogen({
  openapi: '3.0.0',
})(outputFile, endpointsFiles, doc);
