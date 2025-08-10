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
router.post('/auth/login', authController.login);
router.post('/auth/activation', authController.activation);
router.get('/auth/get-profile', authMiddleware, authController.getProfile);

//* router user
router.post('/auth/register', userController.register);
router.get(
  '/member',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  userController.getAllUser
);
router.get('/member/:id', userController.getUserById);
router.put(
  '/auth/update-profile',
  authMiddleware,
  userController.updateProfile
);
router.put(
  '/auth/update-password',
  authMiddleware,
  userController.updatePassword
);

//* routes organizer
router.post('/auth/register/organizers', organizerController.registerOrganizer);
router.get('/organizers', organizerController.getAllOrganizers);
router.get('/organizers/:organizerId', organizerController.getOrganizerById);
router.put(
  '/auth/update-profile/organizers',
  [authMiddleware, aclMiddleware([ROLES.ORGANIZER])],
  organizerController.updateProfileOrganizer
);
router.put(
  '/auth/update-password/organizers',
  authMiddleware,
  organizerController.updatePasswordOrganizer
);
router.delete(
  '/organizers/:organizerId',
  [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.ORGANIZER])],
  organizerController.deleteOrganizer
);

//* router category
router.post(
  '/category',
  [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.ORGANIZER])],
  categoriesController.createCategory
);
router.get('/category', categoriesController.getCategory);
router.get('/category/:id', categoriesController.getCategoryById);
router.put(
  '/category/:id',
  [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.ORGANIZER])],
  categoriesController.updateCategory
);
router.delete(
  '/category/:id',
  [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.ORGANIZER])],
  categoriesController.deleteCategory
);

//* routes event
router.post(
  '/events',
  [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.ORGANIZER])],
  eventsController.createEvent
);
router.get('/events', eventsController.getAllEvents);
router.get(
  '/events/organizers',
  [authMiddleware, aclMiddleware([ROLES.ORGANIZER])],
  eventsController.getEventByOrganizer
);
router.get('/events/:id', eventsController.getEventById);
router.get(
  '/events/createdBy/:organizerId',
  eventsController.getEventByOrganzer
);
router.get('/events/:slug/slug', eventsController.getEventBySlug);
router.put(
  '/events/:id',
  [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.ORGANIZER])],
  eventsController.updateEvent
);
router.delete(
  '/events/:id',
  [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.ORGANIZER])],
  eventsController.deleteEvent
);

//* router FaQ
router.post(
  '/faqs',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  faqController.createFAQ
);
router.get('/faqs', faqController.getFAQ);
router.get('/faqs/:id', faqController.getFAQById);
router.put(
  '/faqs/:id',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  faqController.updateFAQ
);
router.delete(
  '/faqs/:id',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  faqController.deleteFAQ
);

//* event volunteer
router.post(
  '/event-volunteers/:eventId',
  [authMiddleware, aclMiddleware([ROLES.MEMBER])],
  eventVolunteerController.createEventVolunteer
);
router.get(
  '/event-volunteers',
  [authMiddleware, aclMiddleware([ROLES.ADMIN])],
  eventVolunteerController.getAllEventVolunteers
);
router.get(
  '/event-volunteers/member',
  [authMiddleware, aclMiddleware([ROLES.MEMBER])],
  eventVolunteerController.getEventVolunteerByMember
);
router.get(
  '/event-volunteers/:eventId',
  eventVolunteerController.getEventVolunteerByEvent
);
router.put(
  '/event-volunteers/:eventVolunteerId/status',
  [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.ORGANIZER])],
  eventVolunteerController.updateStatusEventVolunteer
);
router.delete(
  '/event-volunteers/:eventVolunteerId',
  [authMiddleware, aclMiddleware([ROLES.ADMIN, ROLES.ORGANIZER])],
  eventVolunteerController.deleteEventVolunteer
);

//* router upload image
router.post(
  '/image/upload-single',
  [authMiddleware, mediaMiddleware.singleUpload('file')],
  imageController.uploadSingle
);
router.delete('/image/delete-file', authMiddleware, imageController.deleteFile);

//* router region
router.get('/regions', regionController.getAllProvinces);
router.get('/regions/:id/province', regionController.getProvince);
router.get('/regions/:id/regency', regionController.getRegency);
router.get('/regions/:id/district', regionController.getDistrict);
router.get('/regions/:id/village', regionController.getVillage);
router.get('/regions-search', regionController.findByCity);

export default router;
