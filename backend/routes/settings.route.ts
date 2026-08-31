import express from 'express';
import * as settingsController from '../controllers/settings.controller';

const router = express.Router();

router.get('/', settingsController.getSettings);
router.put('/', settingsController.updateSettings);

export default router;
