import express from 'express';
import authController from '../controllers/auth.controller';
import authMiddleware from '../middlewares/auth.middleware';
import authOrganizerController from '../controllers/authOrganizer.controller';

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
export default router;
