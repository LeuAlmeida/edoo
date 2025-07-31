import { sequelize } from '../database/config';
import { BenefitRepository, ValidationFailedError } from './BenefitRepository';
import { IBenefit } from '../../domain/entities/Benefit';

describe('BenefitRepository', () => {
  let repository: BenefitRepository;

  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    repository = new BenefitRepository();
    await sequelize.authenticate();
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  const createValidBenefit = async (): Promise<IBenefit> => {
    return await repository.create({
      name: 'Health Insurance',
      description: 'Complete medical coverage',
      isActive: true
    });
  };

  describe('create', () => {
    it('should create a benefit with valid data', async () => {
      const benefit = await createValidBenefit();

      expect(benefit).toHaveProperty('id');
      expect(benefit.name).toBe('Health Insurance');
      expect(benefit.description).toBe('Complete medical coverage');
      expect(benefit.isActive).toBe(true);
    });

    it('should throw ValidationFailedError when name is invalid', async () => {
      await expect(repository.create({
        name: 'ab',
        description: 'Invalid name test',
        isActive: true
      })).rejects.toThrow(ValidationFailedError);

      await expect(repository.create({
        name: 'ab',
        description: 'Invalid name test',
        isActive: true
      })).rejects.toThrow('Validation len on name failed');
    });
  });

  describe('findAll', () => {
    it('should return empty array when no benefits exist', async () => {
      const benefits = await repository.findAll();
      expect(benefits).toEqual([]);
    });

    it('should return all benefits', async () => {
      await createValidBenefit();
      await repository.create({
        name: 'Dental Plan',
        description: 'Basic dental coverage',
        isActive: true
      });

      const benefits = await repository.findAll();
      expect(benefits).toHaveLength(2);
      expect(benefits[0]).toHaveProperty('id');
      expect(benefits[1]).toHaveProperty('id');
    });
  });

  describe('findById', () => {
    it('should return null for non-existent benefit', async () => {
      const benefit = await repository.findById(999);
      expect(benefit).toBeNull();
    });

    it('should return benefit when it exists', async () => {
      const created = await createValidBenefit();
      const found = await repository.findById(created.id!);

      expect(found).not.toBeNull();
      expect(found?.id).toBe(created.id);
      expect(found?.name).toBe(created.name);
    });
  });

  describe('update', () => {
    it('should update benefit successfully', async () => {
      const benefit = await createValidBenefit();
      const updated = await repository.update(benefit.id!, {
        name: 'Updated Insurance',
        description: 'Updated description'
      });

      expect(updated).not.toBeNull();
      expect(updated?.name).toBe('Updated Insurance');
      expect(updated?.description).toBe('Updated description');
    });

    it('should return null when updating non-existent benefit', async () => {
      const result = await repository.update(999, { name: 'Test' });
      expect(result).toBeNull();
    });

    it('should throw ValidationFailedError when update data is invalid', async () => {
      const benefit = await createValidBenefit();
      await expect(repository.update(benefit.id!, {
        name: 'ab' // nome muito curto
      })).rejects.toThrow(ValidationFailedError);
    });
  });

  describe('delete', () => {
    it('should delete existing benefit', async () => {
      const benefit = await createValidBenefit();
      await repository.delete(benefit.id!);

      const found = await repository.findById(benefit.id!);
      expect(found).toBeNull();
    });

    it('should not throw error when deleting non-existent benefit', async () => {
      await repository.delete(999);
      expect(true).toBe(true);
    });
  });

  describe('activate/deactivate', () => {
    it('should deactivate benefit', async () => {
      const benefit = await createValidBenefit();
      const updated = await repository.update(benefit.id!, { isActive: false });

      expect(updated).not.toBeNull();
      expect(updated?.isActive).toBe(false);
    });

    it('should activate benefit', async () => {
      const benefit = await createValidBenefit();
      await repository.update(benefit.id!, { isActive: false });
      const updated = await repository.update(benefit.id!, { isActive: true });

      expect(updated).not.toBeNull();
      expect(updated?.isActive).toBe(true);
    });
  });
});
