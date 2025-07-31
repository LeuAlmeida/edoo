import { IBenefitRepository } from '../../domain/repositories/IBenefitRepository';
import { IBenefit, Benefit } from '../../domain/entities/Benefit';
import BenefitModel from '../database/models/Benefit';

export class BenefitRepository implements IBenefitRepository {
  async findAll(): Promise<IBenefit[]> {
    const benefits = await BenefitModel.findAll();
    return benefits.map(benefit => new Benefit(benefit.get({ plain: true })));
  }

  async findById(id: number): Promise<IBenefit | null> {
    const benefit = await BenefitModel.findByPk(id);
    return benefit ? new Benefit(benefit.get({ plain: true })) : null;
  }

  async create(benefitData: IBenefit): Promise<IBenefit> {
    try {
      const benefit = await BenefitModel.create({
        name: benefitData.name,
        description: benefitData.description,
        isActive: benefitData.isActive ?? true
      });

      return new Benefit(benefit.get({ plain: true })).toJSON();
    } catch (error) {
      console.error('Error creating benefit:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to create benefit: ${error.message}`);
      }
      throw new Error('Failed to create benefit');
    }
  }

  async update(id: number, benefitData: Partial<IBenefit>): Promise<IBenefit | null> {
    try {
      const benefit = await BenefitModel.findByPk(id);

      if (!benefit) {
        return null;
      }

      await benefit.update(benefitData);
      return new Benefit(benefit.get({ plain: true })).toJSON();
    } catch (error) {
      console.error('Error updating benefit:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to update benefit: ${error.message}`);
      }
      throw new Error('Failed to update benefit');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await BenefitModel.destroy({ where: { id } });
    } catch (error) {
      console.error('Error deleting benefit:', error);
      if (error instanceof Error) {
        throw new Error(`Failed to delete benefit: ${error.message}`);
      }
      throw new Error('Failed to delete benefit');
    }
  }
}
