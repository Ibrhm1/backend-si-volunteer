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
        name: 'Aksi Bersih Sungai Ciliwung',
        description:
          'Kami membuka kesempatan bagi para relawan untuk berpartisipasi dalam kegiatan pembersihan sungai Ciliwung demi menciptakan lingkungan yang lebih sehat dan bebas sampah.',
        startDate: '2025-09-15T07:30:00Z',
        endDate: '2025-09-15T12:00:00Z',
        image: 'file Url',
        category: 'Category Id',
        isOnline: false,
        isPublish: true,
        isFeatured: false,
        location: {
          region: 31,
          address: 'Jl. Otto Iskandardinata, Kampung Melayu, Jakarta Timur',
        },
        requiredVolunteers: 50,
        currentVolunteers: 10,
        requirements:
          'Sehat jasmani, membawa alat kebersihan sendiri (sarung tangan, karung, dll.), dan tidak takut kotor.',
        benefits: 'Sertifikat partisipasi, konsumsi, dan kaos kegiatan.',
        tags: ['lingkungan', 'sungai', 'relawan', 'Jakarta'],
      },
    },
  },
};

swaggerAutogen({
  openapi: '3.0.0',
})(outputFile, endpointsFiles, doc);
