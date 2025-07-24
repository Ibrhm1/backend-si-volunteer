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
    #swagger.parameters['limit'] = { in: 'query', type: 'number', default: 10 }
    #swagger.parameters['page'] = { in: 'query', type: 'number', default: 1 }
    #swagger.parameters['category'] = { in: 'query', type: 'string' }
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
router.get(
  '/events/:slug/slug',
  eventsController.getEventBySlug
  /*
    #swagger.tags = ['Events'],
   */
);

//* router upload image
router.post(
  '/image/upload-single',
  [
    authMiddleware,
    mediaMiddleware.singleUpload('file'),
  ],
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
