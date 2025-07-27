import express from 'express';
import authController from '../controllers/auth.controller';
import authMiddleware from '../middlewares/auth.middleware';
import authOrganizerController from '../controllers/authOrganizer.controller';
import categoriesController from '../controllers/categories.controller';
import aclMiddleware from '../middlewares/acl.middleware';
import { ROLES } from '../utils/constant';
import mediaMiddleware from '../middlewares/media.middleware';
import imageController from '../controllers/image.controller';
import regionController from '../controllers/region.controller';
import eventsController from '../controllers/events.controller';
import faqController from '../controllers/faq.controller';
import eventVolunteerController from '../controllers/eventVolunteer.controller';

const router = express.Router();

//* routes auth
router.post(
  '/auth/register',
  authController.register
  /*
    #swagger.tags = ['Auth']
    #swagger.requestBody = {
      required: true,
      schema: {$ref: '#/components/schemas/RegisterRequest'}
    }
  */
);
router.post(
  '/auth/login',
  authController.login
  /*
    #swagger.tags = ['Auth']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/LoginRequest' }
        }
      }
    }
  */
);
router.post(
  '/auth/activation',
  authController.activation
  /*
  #swagger.tags = ['Auth']
  #swagger.requestBody = {
    required: true,
    schema: {$ref: '#/components/schemas/ActivationRequest'}
    }
  */
);
router.get(
  '/auth/getProfile',
  authMiddleware,
  authController.getProfile
  /*
    #swagger.tags = ['Auth']
    #swagger.security = [{ "bearerAuth": [] }]
  */
);
router.get(
  '/member',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  authController.getAllUser
  /*
    #swagger.tags = ['Auth']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['limit'] = {
      in: 'query',
      type: 'number',
      default: 10
    }
    #swagger.parameters['page'] = {
      in: 'query',
      type: 'number',
      default: 1
    }
  */
);
router.get(
  '/auth/member/:id',
  authController.getUserById
  /*
    #swagger.tags = ['Auth']
  */
);
router.put(
  '/auth/update-profile',
  authMiddleware,
  authController.updateProfile
  /*
  #swagger.tags = ['Auth']
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.requestBody = {
    required: true,
    schema: {$ref: '#/components/schemas/UpdateProfileRequest'}
    }
  */
);
router.put(
  '/auth/update-password',
  authMiddleware,
  authController.updatePassword
  /*
  #swagger.tags = ['Auth']
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.requestBody = {
    required: true,
    schema: {$ref: '#/components/schemas/UpdatePasswordRequest'}
    }
  */
);

//* routes organizer
router.post(
  '/auth/register/organizer',
  authOrganizerController.registerOrganizer
  /*
    #swagger.tags = ['Auth Organizer']
    #swagger.requestBody = {
      required: true,
      schema: {$ref: '#/components/schemas/RegisterOrganizerRequest'}
    }
  */
);
router.post(
  '/auth/login/organizer',
  authOrganizerController.loginOrganizer
  /*
    #swagger.tags = ['Auth Organizer']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/LoginOrganizerRequest' }
        }
      }
    }
  */
);
router.post(
  '/auth/activation/organizer',
  authOrganizerController.activationOrganizer
  /*
    #swagger.tags = ['Auth Organizer']
    #swagger.requestBody = {
      required: true,
      content: {
        "application/json": {
          schema: { $ref: '#/components/schemas/ActivationOrganizerRequest' }
        }
      }
    }
    */
);
router.get(
  '/auth/getOrganizer',
  authMiddleware,
  authOrganizerController.getOrganizer
  /*
    #swagger.tags = ['Auth Organizer']
    #swagger.security = [{ "bearerAuth": [] }]
    */
);
router.get(
  '/organizers',
  authOrganizerController.getAllOrganizers
  /*
    #swagger.tags = ['Auth Organizer']
    #swagger.parameters['limit'] = { in: 'query', type: 'number', default: 10 }
    #swagger.parameters['page'] = { in: 'query', type: 'number', default: 1 }
   */
);
router.get(
  '/organizers/:organizerId',
  authOrganizerController.getOrganizerById
  /*
  #swagger.tags = ['Auth Organizer']
  #swagger.parameters['organizerId'] = { in: 'path', type: 'string' }
  */
);
router.put(
  '/auth/update-profile/organizer',
  [authMiddleware, aclMiddleware([ROLES.ORGANIZER])],
  authOrganizerController.updateProfileOrganizer
  /*
  #swagger.tags = ['Auth Organizer']
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.requestBody = {
    required: true,
    schema: {$ref: '#/components/schemas/UpdateProfileOrganizerRequest'}
    }
    */
);
router.put(
  '/auth/update-password/organizer',
  authMiddleware,
  authOrganizerController.updatePasswordOrganizer
  /*
  #swagger.tags = ['Auth Organizer']
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.requestBody = {
    required: true,
    schema: {$ref: '#/components/schemas/UpdatePasswordOrganizerRequest'}
    }
  */
);
router.delete(
  '/organizer/:organizerId',
  [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.ORGANIZER])],
  authOrganizerController.deleteOrganizer
  /*
    #swagger.tags = ['Auth Organizer']
    #swagger.security = [{ "bearerAuth": [] }]
    #swagger.parameters['organizerId'] = { in: 'path', type: 'string' }
  */
);

//* router category
router.post(
  '/category',
  [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.ORGANIZER])],
  categoriesController.createCategory
  /*
    #swagger.tags = ['Category'],
    #swagger.security = [{ "bearerAuth": {} }]
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: '#/components/schemas/CreateCategoryRequest'}
      },
    }
  */
);
router.get(
  '/category',
  categoriesController.getCategory
  /*
    #swagger.tags = ['Category'],
    #swagger.parameters['limit'] = {
      in: 'query',
      type: 'number',
      default: 10
    }
    #swagger.parameters['page'] = {
      in: 'query',
      type: 'number',
      default: 1
    }
  */
);
router.get(
  '/category/:id',
  categoriesController.getCategoryById
  /*
    #swagger.tags = ['Category'],
  */
);
router.put(
  '/category/:id',
  [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.ORGANIZER])],
  categoriesController.updateCategory
  /*
    #swagger.tags = ['Category'],
    #swagger.security = [{ "bearerAuth": {} }]
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: '#/components/schemas/CreateCategoryRequest'}
      },
    }
  */
);
router.delete(
  '/category/:id',
  [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.ORGANIZER])],
  categoriesController.deleteCategory
  /*
    #swagger.tags = ['Category'],
    #swagger.security = [{ "bearerAuth": {} }]
  */
);

//* routes event
router.post(
  '/events',
  [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.ORGANIZER])],
  eventsController.createEvent
  /*
    #swagger.tags = ['Events'],
    #swagger.security = [{ "bearerAuth": {} }]
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: '#/components/schemas/CreateEventRequest'}
      },
    }
  */
);
router.get(
  '/events',
  eventsController.getAllEvents
  /*
    #swagger.tags = ['Events']
    #swagger.parameters['category'] = { in: 'query', type: 'string' }
    #swagger.parameters['limit'] = { in: 'query', type: 'number', default: 10 }
    #swagger.parameters['page'] = { in: 'query', type: 'number', default: 1 }
    #swagger.parameters['isOnline'] = { in: 'query', type: 'boolean' }
    #swagger.parameters['isPublish'] = { in: 'query', type: 'boolean' }
    #swagger.parameters['isFeatured'] = { in: 'query', type: 'boolean' }
    */
);
router.get(
  '/events/:id',
  eventsController.getEventById
  /*
    #swagger.tags = ['Events'],
   */
);
router.get(
  '/events/:slug/slug',
  eventsController.getEventBySlug
  /*
    #swagger.tags = ['Events'],
  */
);
router.get(
  '/events/:organizerId/organizer',
  eventsController.getEventByOrganizer
  /*
    #swagger.tags = ['Events'],
  */
);
router.put(
  '/events/:id',
  [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.ORGANIZER])],
  eventsController.updateEvent
  /*
    #swagger.tags = ['Events'],
    #swagger.security = [{ "bearerAuth": {} }]
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: '#/components/schemas/CreateEventRequest'}
      },
    }
  */
);
router.delete(
  '/events/:id',
  [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.ORGANIZER])],
  eventsController.deleteEvent
  /*
    #swagger.tags = ['Events'],
    #swagger.security = [{ "bearerAuth": {} }]
  */
);

//* router FaQ
router.post(
  '/Faq',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  faqController.createFAQ
  /*
    #swagger.tags = ['Frequently Asked Questions'],
    #swagger.security = [{ "bearerAuth": {} }]
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: '#/components/schemas/CreateFAQRequest'}
      },
    }
   */
);
router.get(
  '/Faq',
  faqController.getFAQ
  /*
    #swagger.tags = ['Frequently Asked Questions'],
    #swagger.parameters['limit'] = { in: 'query', type: 'number', default: 10 }
    #swagger.parameters['page'] = { in: 'query', type: 'number', default: 1 }
  */
);
router.get(
  '/Faq/:id',
  faqController.getFAQById
  /*
    #swagger.tags = ['Frequently Asked Questions'],
  */
);
router.put(
  '/Faq/:id',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  faqController.updateFAQ
  /*
    #swagger.tags = ['Frequently Asked Questions'],
    #swagger.security = [{ "bearerAuth": {} }]
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: '#/components/schemas/CreateFAQRequest'}
      },
    }
   */
);
router.delete(
  '/Faq/:id',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  faqController.deleteFAQ
  /*
    #swagger.tags = ['Frequently Asked Questions'],
    #swagger.security = [{ "bearerAuth": {} }]
  */
);

//* event volunteer
router.post(
  '/events/:eventId/volunteer',
  [authMiddleware, aclMiddleware([ROLES.MEMBER])],
  eventVolunteerController.createEventVolunteer
  /**
    #swagger.tags = ['Event Volunteers'],
    #swagger.security = [{ "bearerAuth": {} }]
    #swagger.parameters['eventId'] = { in: 'path', type: 'string' }
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: '#/components/schemas/CreateEventVolunteerRequest'}
      },
    }
   */
);
router.get(
  '/event-volunteers',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  eventVolunteerController.getAllEventVolunteers
  /*
    #swagger.tags = ['Event Volunteers'],
    #swagger.security = [{ "bearerAuth": {} }]
    #swagger.parameters['limit'] = { in: 'query', type: 'number', default: 10 }
    #swagger.parameters['page'] = { in: 'query', type: 'number', default: 1 }
    #swagger.parameters['eventId'] = { in: 'query', type: 'string'}
    #swagger.parameters['userId'] = { in: 'query', type: 'string'}
  */
);
router.get(
  '/event-volunteers/:eventId',
  [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.ORGANIZER])],
  eventVolunteerController.getEventVolunteerByEvent
  /*
    #swagger.tags = ['Event Volunteers'],
    #swagger.security = [{ "bearerAuth": {} }]
    #swagger.parameters['eventId'] = { in: 'query', type: 'string' }
  */
);
router.put(
  '/event-volunteer/:eventVolunteerId/status',
  [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.ORGANIZER])],
  eventVolunteerController.updateStatusEventVolunteer
  /*
    #swagger.tags = ['Event Volunteers'],
    #swagger.security = [{ "bearerAuth": {} }]
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: '#/components/schemas/UpdateEventVolunteerRequest'}
      },
    }
   */
);
router.delete(
  '/event-volunteers/:eventVolunteerId',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  eventVolunteerController.deleteEventVolunteer
  /*
    #swagger.tags = ['Event Volunteers'],
    #swagger.security = [{ "bearerAuth": {} }]
  */
);

//* router upload image
router.post(
  '/image/upload-single',
  [authMiddleware, mediaMiddleware.singleUpload('file')],
  imageController.uploadSingle
  /*
    #swagger.tags = ['Image File'],
    #swagger.security = [{ "bearerAuth": {} }]
    #swagger.requestBody = {
      required: true,
      content: {
        'multipart/form-data': {
          schema: {
            type: 'object',
            properties: {
              file: {
                type: 'string',
                format: 'binary',
              },
            },
          },
        },
      },
    }
   */
);
router.delete(
  '/image/delete-file',
  [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.MEMBER])],
  imageController.deleteFile
  /*
    #swagger.tags = ['Image File'],
    #swagger.security = [{ "bearerAuth": {} }]
    #swagger.requestBody = {
      required: true,
      schema: {
        $ref: '#/components/schemas/DeleteFileRequest'
      }
    }
   */
);

//* router region
router.get(
  '/regions',
  regionController.getAllProvinces
  /*
    #swagger.tags = ['Regions'],
   */
);
router.get(
  '/regions/:id/province',
  regionController.getProvince
  /*
    #swagger.tags = ['Regions'],
   */
);
router.get(
  '/regions/:id/regency',
  regionController.getRegency
  /*
    #swagger.tags = ['Regions'],
   */
);
router.get(
  '/regions/:id/district',
  regionController.getDistrict
  /*
    #swagger.tags = ['Regions'],
   */
);
router.get(
  '/regions/:id/village',
  regionController.getVillage
  /*
    #swagger.tags = ['Regions'],
   */
);
router.get(
  '/regions-search',
  regionController.findByCity
  /*
    #swagger.tags = ['Regions'],
    #swagger.description = 'Search regions by city name',
   */
);

export default router;
