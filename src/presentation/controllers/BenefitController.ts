import { Request, Response } from 'express';
import { IBenefitRepository } from '../../domain/repositories/IBenefitRepository';
import { Benefit } from '../../domain/entities/Benefit';

export class BenefitController {
  constructor(private readonly benefitRepository: IBenefitRepository) {}

  public listBenefits = async (_req: Request, res: Response): Promise<void> => {
    try {
      const benefits = await this.benefitRepository.findAll();
      res.json(benefits);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
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
      res.status(201).json(createdBenefit);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
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

      res.json(updatedBenefit);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public deleteBenefit = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = Number(req.params.id);
      await this.benefitRepository.delete(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
