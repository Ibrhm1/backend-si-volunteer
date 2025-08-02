import express from 'express';
import authController from '../controllers/auth.controller';
import authMiddleware from '../middlewares/auth.middleware';
import organizerController from '../controllers/organizer.controller';
import categoriesController from '../controllers/categories.controller';
import aclMiddleware from '../middlewares/acl.middleware';
import { ROLES } from '../utils/constant';
import mediaMiddleware from '../middlewares/media.middleware';
import imageController from '../controllers/image.controller';
import regionController from '../controllers/region.controller';
import eventsController from '../controllers/events.controller';
import faqController from '../controllers/faq.controller';
import eventVolunteerController from '../controllers/eventVolunteer.controller';
import userController from '../controllers/user.controller';

const router = express.Router();

//* routes auth
router.post(
  '/auth/login',
  authController.login
  /*
    #swagger.tags = ['Auth']
    #swagger.description = 'Login user and organizer'
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
  #swagger.description = 'activation user and organizer'
  #swagger.requestBody = {
    required: true,
    schema: {$ref: '#/components/schemas/ActivationRequest'}
    }
  */
);
router.get(
  '/auth/get-profile',
  authMiddleware,
  authController.getProfile
  /*
    #swagger.tags = ['Auth']
    #swagger.description = 'get profile user and organizer'
    #swagger.security = [{ "bearerAuth": [] }]
  */
);

//* router user
router.post(
  '/auth/register',
  userController.register
  /*
    #swagger.tags = ['Users']
    #swagger.requestBody = {
      required: true,
      schema: {$ref: '#/components/schemas/RegisterRequest'}
    }
  */
);
router.get(
  '/member',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  userController.getAllUser
  /*
    #swagger.tags = ['Users']
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
  userController.getUserById
  /*
    #swagger.tags = ['Users']
  */
);
router.put(
  '/auth/update-profile',
  authMiddleware,
  userController.updateProfile
  /*
  #swagger.tags = ['Users']
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
  userController.updatePassword
  /*
  #swagger.tags = ['Users']
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.requestBody = {
    required: true,
    schema: {$ref: '#/components/schemas/UpdatePasswordRequest'}
    }
  */
);

//* routes organizer
router.post(
  '/auth/register/organizers',
  organizerController.registerOrganizer
  /*
    #swagger.tags = ['Organizers']
    #swagger.requestBody = {
      required: true,
      schema: {$ref: '#/components/schemas/RegisterOrganizerRequest'}
    }
  */
);
router.get(
  '/organizers',
  organizerController.getAllOrganizers
  /*
    #swagger.tags = ['Organizers']
    #swagger.parameters['limit'] = { in: 'query', type: 'number', default: 10 }
    #swagger.parameters['page'] = { in: 'query', type: 'number', default: 1 }
   */
);
router.get(
  '/organizers/:organizerId',
  organizerController.getOrganizerById
  /*
  #swagger.tags = ['Organizers']
  #swagger.parameters['organizerId'] = { in: 'path', type: 'string' }
  */
);
router.put(
  '/auth/update-profile/organizers',
  [authMiddleware, aclMiddleware([ROLES.ORGANIZER])],
  organizerController.updateProfileOrganizer
  /*
  #swagger.tags = ['Organizers']
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.requestBody = {
    required: true,
    schema: {$ref: '#/components/schemas/UpdateProfileOrganizerRequest'}
    }
    */
);
router.put(
  '/auth/update-password/organizers',
  authMiddleware,
  organizerController.updatePasswordOrganizer
  /*
  #swagger.tags = ['Organizers']
  #swagger.security = [{ "bearerAuth": [] }]
  #swagger.requestBody = {
    required: true,
    schema: {$ref: '#/components/schemas/UpdatePasswordOrganizerRequest'}
    }
  */
);
router.delete(
  '/organizers/:organizerId',
  [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.ORGANIZER])],
  organizerController.deleteOrganizer
  /*
    #swagger.tags = ['Organizers']
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
  '/organizers/events',
  [authMiddleware, aclMiddleware([ROLES.ORGANIZER])],
  eventsController.getEventByOrganizer
  /*
    #swagger.tags = ['Events'],
    #swagger.security = [{ "bearerAuth": {} }]
    #swagger.parameters['limit'] = { in: 'query', type: 'number', default: 10 }
    #swagger.parameters['page'] = { in: 'query', type: 'number', default: 1 }
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
  '/event-volunteers/:eventId',
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
  '/event-volunteers/member',
  [authMiddleware, aclMiddleware([ROLES.MEMBER])],
  eventVolunteerController.getEventVolunteerByMember
  /*
    #swagger.tags = ['Event Volunteers'],
    #swagger.security = [{ "bearerAuth": {} }]
    #swagger.parameters['limit'] = { in: 'query', type: 'number', default: 10 }
    #swagger.parameters['page'] = { in: 'query', type: 'number', default: 1 }
  */
);
router.get(
  '/event-volunteers/:eventId',
  [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.ORGANIZER])],
  eventVolunteerController.getEventVolunteerByEvent
  /*
    #swagger.tags = ['Event Volunteers'],
    #swagger.security = [{ "bearerAuth": {} }]
    #swagger.parameters['eventId'] = { in: 'path', type: 'string' }
  */
);
router.put(
  '/event-volunteers/:eventVolunteerId/status',
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
