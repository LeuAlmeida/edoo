import { BenefitRepository, ValidationFailedError } from './BenefitRepository';
import { sequelize } from '../database/config';

describe('BenefitRepository', () => {
  let repository: BenefitRepository;

  beforeEach(async () => {
    repository = new BenefitRepository();
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('findAll', () => {
    it('should return empty list when no benefits exist', async () => {
      const result = await repository.findAll();
      expect(result.items).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.page).toBe(1);
      expect(result.totalPages).toBe(0);
    });

    it('should return paginated benefits with default options', async () => {
      for (let i = 1; i <= 15; i++) {
        await repository.create({
          name: `Benefit ${i}`,
          description: `Description ${i}`,
          isActive: true
        });
      }

      const result = await repository.findAll();
      expect(result.items).toHaveLength(10);
      expect(result.total).toBe(15);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(2);
    });

    it('should return sorted benefits', async () => {
      await repository.create({ name: 'C Benefit', description: 'C', isActive: true });
      await repository.create({ name: 'A Benefit', description: 'A', isActive: true });
      await repository.create({ name: 'B Benefit', description: 'B', isActive: true });

      const result = await repository.findAll({
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'ASC'
      });
      expect(result.items[0].name).toBe('A Benefit');
      expect(result.items[1].name).toBe('B Benefit');
      expect(result.items[2].name).toBe('C Benefit');
    });

    it('should throw error for invalid sort field', async () => {
      await expect(repository.findAll({
        page: 1,
        limit: 10,
        sortBy: 'invalid'
      }))
        .rejects
        .toThrow(ValidationFailedError);
    });
  });

  describe('create', () => {
    it('should create a new benefit', async () => {
      const benefit = await repository.create({
        name: 'Health Insurance',
        description: 'Medical coverage',
        isActive: true
      });

      expect(benefit.id).toBeDefined();
      expect(benefit.name).toBe('Health Insurance');
      expect(benefit.description).toBe('Medical coverage');
      expect(benefit.isActive).toBe(true);
    });

    it('should throw error for invalid name', async () => {
      await expect(repository.create({
        name: 'ab',
        description: 'Too short name',
        isActive: true
      })).rejects.toThrow(ValidationFailedError);
    });
  });

  describe('update', () => {
    it('should update an existing benefit', async () => {
      const benefit = await repository.create({
        name: 'Old Name',
        description: 'Old Description',
        isActive: true
      });

      const updated = await repository.update(benefit.id!, {
        name: 'New Name',
        description: 'New Description'
      });

      expect(updated?.name).toBe('New Name');
      expect(updated?.description).toBe('New Description');
    });

    it('should return null for non-existent benefit', async () => {
      const result = await repository.update(999, { name: 'New Name' });
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete an existing benefit', async () => {
      const benefit = await repository.create({
        name: 'To Delete',
        description: 'Will be deleted',
        isActive: true
      });

      await repository.delete(benefit.id!);
      const result = await repository.findById(benefit.id!);
      expect(result).toBeNull();
    });
  });
});
