import { Request, Response } from 'express';
import { IBenefitRepository } from '../../domain/repositories/IBenefitRepository';
import { BenefitController } from './BenefitController';
import { ValidationFailedError } from '../../infrastructure/repositories/BenefitRepository';

describe('BenefitController', () => {
  let mockRepository: jest.Mocked<IBenefitRepository>;
  let controller: BenefitController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnThis();
    mockResponse = {
      json: jsonMock,
      status: statusMock,
      send: jest.fn()
    };
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    };
    controller = new BenefitController(mockRepository);
  });

  describe('listBenefits', () => {
    it('should return paginated benefits with default parameters', async () => {
      const mockResult = {
        items: [
          { id: 1, name: 'Benefit 1', description: 'Description 1', isActive: true }
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1
      };

      mockRequest = {
        query: {}
      };

      mockRepository.findAll.mockResolvedValue(mockResult);

      await controller.listBenefits(mockRequest as Request, mockResponse as Response);

      expect(mockRepository.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        sortOrder: 'ASC'
      });
      expect(jsonMock).toHaveBeenCalledWith(mockResult);
    });

    it('should return paginated benefits with custom parameters', async () => {
      const mockResult = {
        items: [
          { id: 1, name: 'Benefit 1', description: 'Description 1', isActive: true }
        ],
        total: 1,
        page: 2,
        limit: 5,
        totalPages: 1
      };

      mockRequest = {
        query: {
          page: '2',
          limit: '5',
          sortBy: 'name',
          sortOrder: 'DESC'
        }
      };

      mockRepository.findAll.mockResolvedValue(mockResult);

      await controller.listBenefits(mockRequest as Request, mockResponse as Response);

      expect(mockRepository.findAll).toHaveBeenCalledWith({
        page: 2,
        limit: 5,
        sortBy: 'name',
        sortOrder: 'DESC'
      });
      expect(jsonMock).toHaveBeenCalledWith(mockResult);
    });

    it('should return 400 for invalid page number', async () => {
      mockRequest = {
        query: {
          page: '0'
        }
      };

      await controller.listBenefits(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Page must be greater than 0' });
    });

    it('should return 400 for invalid limit', async () => {
      mockRequest = {
        query: {
          limit: '0'
        }
      };

      await controller.listBenefits(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Limit must be between 1 and 100' });
    });

    it('should return 400 for invalid sort order', async () => {
      mockRequest = {
        query: {
          sortOrder: 'INVALID'
        }
      };

      await controller.listBenefits(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Sort order must be ASC or DESC' });
    });

    it('should return 400 for invalid sort field', async () => {
      mockRequest = {
        query: {
          page: '1',
          limit: '10',
          sortBy: 'invalid'
        }
      };

      mockRepository.findAll.mockRejectedValue(new ValidationFailedError('Invalid sort field'));

      await controller.listBenefits(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Invalid sort field' });
    });
  });

  describe('createBenefit', () => {
    it('should create a new benefit', async () => {
      const mockBenefit = {
        id: 1,
        name: 'New Benefit',
        description: 'Description',
        isActive: true
      };

      mockRequest = {
        body: {
          name: 'New Benefit',
          description: 'Description'
        }
      };

      mockRepository.create.mockResolvedValue(mockBenefit);

      await controller.createBenefit(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(mockBenefit);
    });

    it('should return 400 for validation error', async () => {
      mockRequest = {
        body: {
          name: 'ab',
          description: 'Too short name'
        }
      };

      mockRepository.create.mockRejectedValue(new Error('Validation error'));

      await controller.createBenefit(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Validation error' });
    });
  });

  describe('deactivateBenefit', () => {
    it('should deactivate a benefit', async () => {
      const mockBenefit = {
        id: 1,
        name: 'Benefit',
        description: 'Description',
        isActive: false
      };

      mockRequest = {
        params: { id: '1' }
      };

      mockRepository.update.mockResolvedValue(mockBenefit);

      await controller.deactivateBenefit(mockRequest as Request, mockResponse as Response);

      expect(mockRepository.update).toHaveBeenCalledWith(1, { isActive: false });
      expect(jsonMock).toHaveBeenCalledWith(mockBenefit);
    });

    it('should return 404 for non-existent benefit', async () => {
      mockRequest = {
        params: { id: '999' }
      };

      mockRepository.update.mockResolvedValue(null);

      await controller.deactivateBenefit(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Benefit not found' });
    });
  });

  describe('activateBenefit', () => {
    it('should activate a benefit', async () => {
      const mockBenefit = {
        id: 1,
        name: 'Benefit',
        description: 'Description',
        isActive: true
      };

      mockRequest = {
        params: { id: '1' }
      };

      mockRepository.update.mockResolvedValue(mockBenefit);

      await controller.activateBenefit(mockRequest as Request, mockResponse as Response);

      expect(mockRepository.update).toHaveBeenCalledWith(1, { isActive: true });
      expect(jsonMock).toHaveBeenCalledWith(mockBenefit);
    });

    it('should return 404 for non-existent benefit', async () => {
      mockRequest = {
        params: { id: '999' }
      };

      mockRepository.update.mockResolvedValue(null);

      await controller.activateBenefit(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Benefit not found' });
    });
  });

  describe('deleteBenefit', () => {
    it('should delete a benefit', async () => {
      mockRequest = {
        params: { id: '1' }
      };

      await controller.deleteBenefit(mockRequest as Request, mockResponse as Response);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
      expect(statusMock).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should return 500 for error during deletion', async () => {
      mockRequest = {
        params: { id: '1' }
      };

      mockRepository.delete.mockRejectedValue(new Error('Database error'));

      await controller.deleteBenefit(mockRequest as Request, mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});
