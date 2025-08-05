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
      LoginRequest: {
        identifier: 'rizkyprtm',
        password: 'Member1',
      },
      ActivationRequest: {
        code: 'activationCode',
      },
      RegisterRequest: {
        fullName: 'Rizky Pratama',
        username: 'rizkyprtm',
        email: 'rizkypratama98@gmail.com',
        address: 'Jl. Kalijudan No. 12, Surabaya',
        phone: '081234567891',
        password: 'Member1',
        confirmPassword: 'Member1',
      },
      UpdateProfileRequest: {
        fullName: 'Update Full Name',
        phone: 'Update Phone Number',
        address: 'Update Address',
        profilePicture: 'file url',
      },
      UpdatePasswordRequest: {
        oldPassword: 'Member1',
        password: 'Member123',
        confirmPassword: 'Member123',
      },
      RegisterOrganizerRequest: {
        organizerName: 'Yayasan Anti Senggol',
        email: 'yysnSenggol22@gmail.com',
        password: 'Organizer2025',
        confirmPassword: 'Organizer2025',
        contactPerson: 'Iib Ibrahim',
        descriptionOrganizer:
          'Lembaga non-profit yang berfokus pada kegiatan sosial, kemanusiaan, dan pemberdayaan masyarakat.',
        dateEstablished: '2025-01-22',
        phone: '08123456789',
        location: {
          domicile: 3216,
          address: 'Ujung Harapan',
        },
      },
      UpdateProfileOrganizerRequest: {
        organizerName: 'Update Name Organizer',
        contactPerson: 'Update Contact Person',
        phone: '08123456789',
        descriptionOrganizer: 'Update Description Organizer',
        dateEstablished: 'YYYY-MM-DD',
        location: {
          domicile: '3216',
          address: 'Update Address',
        },
        logo: 'file url',
      },
      UpdatePasswordOrganizerRequest: {
        oldPassword: 'Organizer2025',
        password: 'Organizer123',
        confirmPassword: 'Organizer123',
      },
      CreateCategoryRequest: {
        name: 'Kesehatan',
        description:
          'Kategori untuk kegiatan kesehatan masyarakat seperti donor darah, penyuluhan, dan bantuan medis.',
        image: 'file url',
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
        location: {
          region: 31,
          address: 'Jl. Otto Iskandardinata, Kampung Melayu, Jakarta Timur',
        },
        requiredVolunteers: 50,
        requirements:
          'Sehat jasmani, membawa alat kebersihan sendiri (sarung tangan, karung, dll.), dan tidak takut kotor.',
        benefits: 'Sertifikat partisipasi, konsumsi, dan kaos kegiatan.',
        tags: ['lingkungan', 'sungai', 'relawan', 'Jakarta'],
      },
      CreateFAQRequest: {
        question: 'Bisakah saya melihat data relawan yang sudah mendaftar?',
        answer:
          'Ya, sebagai organizer Anda bisa melihat daftar relawan dari dashboard event yang Anda kelola.',
        type: 'organizer | member',
        isPublish: true,
      },
      CreateEventVolunteerRequest: {
        motivation:
          'Saya ingin berkontribusi di kegiatan sosial karena merasa terpanggil untuk membantu sesama.',
        experience:
          'Pernah menjadi fasilitator dalam acara donasi buku ke pelosok.',
        skills: ['Public Speaking'],
        portfolioUrl: 'https://drive.google.com/your-portfolio-folder',
      },
      UpdateEventVolunteerRequest: {
        status: 'pending | accepted | rejected',
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
