import { Request, Response } from 'express';
import { IBenefitRepository } from '../../domain/repositories/IBenefitRepository';
import { Benefit } from '../../domain/entities/Benefit';
import { ValidationFailedError } from '../../infrastructure/repositories/BenefitRepository';
import { benefitOperations } from '../../infrastructure/metrics/config';

export class BenefitController {
  constructor(private readonly benefitRepository: IBenefitRepository) {}

  public listBenefits = async (req: Request, res: Response): Promise<void> => {
    try {
      const pageStr = req.query.page as string;
      const limitStr = req.query.limit as string;
      const sortBy = req.query.sortBy as string;
      const sortOrder = (req.query.sortOrder as string || 'ASC').toUpperCase() as 'ASC' | 'DESC';

      const page = pageStr ? parseInt(pageStr) : 1;
      if (isNaN(page) || page < 1) {
        res.status(400).json({ error: 'Page must be greater than 0' });
        return;
      }

      const limit = limitStr ? parseInt(limitStr) : 10;
      if (isNaN(limit) || limit < 1 || limit > 100) {
        res.status(400).json({ error: 'Limit must be between 1 and 100' });
        return;
      }

      if (sortOrder !== 'ASC' && sortOrder !== 'DESC') {
        res.status(400).json({ error: 'Sort order must be ASC or DESC' });
        return;
      }

      const result = await this.benefitRepository.findAll({
        page,
        limit,
        sortBy,
        sortOrder
      });

      benefitOperations.inc({ operation: 'list' });
      res.json(result);
    } catch (error) {
      if (error instanceof ValidationFailedError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };

  public createBenefit = async (req: Request, res: Response): Promise<void> => {
    try {
      const benefit = new Benefit({
        name: req.body.name,
        description: req.body.description,
        isActive: true,
      });

      const createdBenefit = await this.benefitRepository.create(benefit);
      benefitOperations.inc({ operation: 'create' });
      res.status(201).json(createdBenefit);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: 'Validation error' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };

  public deactivateBenefit = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const updatedBenefit = await this.benefitRepository.update(id, { isActive: false });

      if (!updatedBenefit) {
        res.status(404).json({ error: 'Benefit not found' });
        return;
      }

      benefitOperations.inc({ operation: 'deactivate' });
      res.json(updatedBenefit);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public activateBenefit = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      const updatedBenefit = await this.benefitRepository.update(id, { isActive: true });

      if (!updatedBenefit) {
        res.status(404).json({ error: 'Benefit not found' });
        return;
      }

      benefitOperations.inc({ operation: 'activate' });
      res.json(updatedBenefit);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public deleteBenefit = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      await this.benefitRepository.delete(id);
      benefitOperations.inc({ operation: 'delete' });
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
