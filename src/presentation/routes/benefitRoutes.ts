import { Router } from 'express';
import { BenefitController } from '../controllers/BenefitController';
import { BenefitRepository } from '../../infrastructure/repositories/BenefitRepository';

const benefitRouter = Router();
const benefitRepository = new BenefitRepository();
const benefitController = new BenefitController(benefitRepository);

benefitRouter.get('/benefits', benefitController.listBenefits);
benefitRouter.post('/benefits', benefitController.createBenefit);
benefitRouter.put('/benefits/:id/deactivate', benefitController.deactivateBenefit);
benefitRouter.put('/benefits/:id/activate', benefitController.activateBenefit);
benefitRouter.delete('/benefits/:id', benefitController.deleteBenefit);

export default benefitRouter;
