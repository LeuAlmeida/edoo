import { IBenefitRepository, PaginationOptions, PaginatedResult } from '../../domain/repositories/IBenefitRepository';
import { IBenefit, Benefit } from '../../domain/entities/Benefit';
import BenefitModel from '../database/models/Benefit';
import { ValidationError, Order } from 'sequelize';

export class ValidationFailedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationFailedError';
  }
}

const VALID_SORT_FIELDS = ['id', 'name', 'description', 'isActive', 'createdAt', 'updatedAt'];

export class BenefitRepository implements IBenefitRepository {
  async findAll(options?: PaginationOptions): Promise<PaginatedResult<IBenefit>> {
    const page = options?.page || 1;
    const limit = options?.limit || 10;
    const offset = (page - 1) * limit;

    let order: Order = [['id', 'ASC']];
    if (options?.sortBy) {
      const sortField = options.sortBy.toLowerCase();
      if (!VALID_SORT_FIELDS.includes(sortField)) {
        throw new ValidationFailedError(`Invalid sort field. Valid fields are: ${VALID_SORT_FIELDS.join(', ')}`);
      }
      order = [[sortField, options.sortOrder || 'ASC']];
    }

    const { count, rows } = await BenefitModel.findAndCountAll({
      limit,
      offset,
      order
    });

    const totalPages = Math.ceil(count / limit);

    return {
      items: rows.map(benefit => new Benefit(benefit.get({ plain: true }))),
      total: count,
      page,
      limit,
      totalPages
    };
  }

  async findById(id: number): Promise<IBenefit | null> {
    const benefit = await BenefitModel.findByPk(id);
    return benefit ? new Benefit(benefit.get({ plain: true })) : null;
  }

  async create(benefitData: IBenefit): Promise<IBenefit> {
    try {
      const { name, description, isActive } = benefitData;
      const benefit = await BenefitModel.create({
        name,
        description,
        isActive: isActive ?? true
      } as any);

      return new Benefit(benefit.get({ plain: true })).toJSON();
    } catch (error) {
      if (error instanceof ValidationError) {
        const message = error.errors.map(err => err.message).join(', ');
        throw new ValidationFailedError(message);
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
      if (error instanceof ValidationError) {
        const message = error.errors.map(err => err.message).join(', ');
        throw new ValidationFailedError(message);
      }
      throw new Error('Failed to update benefit');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await BenefitModel.destroy({ where: { id } });
    } catch (error) {
      throw new Error('Failed to delete benefit');
    }
  }
}
