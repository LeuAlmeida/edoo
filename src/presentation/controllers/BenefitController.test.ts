import { Request, Response } from 'express';
import { BenefitController } from './BenefitController';
import { IBenefitRepository } from '../../domain/repositories/IBenefitRepository';
import { IBenefit } from '../../domain/entities/Benefit';

describe('BenefitController', () => {
  let controller: BenefitController;
  let mockRepository: jest.Mocked<IBenefitRepository>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseJson: jest.Mock;
  let responseStatus: jest.Mock;

  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    responseJson = jest.fn();
    responseStatus = jest.fn().mockReturnThis();

    mockResponse = {
      json: responseJson,
      status: responseStatus,
      send: jest.fn(),
    };

    controller = new BenefitController(mockRepository);
  });

  describe('listBenefits', () => {
    it('should return all benefits', async () => {
      const benefits: IBenefit[] = [
        { id: 1, name: 'Benefit 1', description: 'Description 1', isActive: true },
        { id: 2, name: 'Benefit 2', description: 'Description 2', isActive: false },
      ];

      mockRepository.findAll.mockResolvedValue(benefits);

      await controller.listBenefits({} as Request, mockResponse as Response);

      expect(mockRepository.findAll).toHaveBeenCalled();
      expect(responseJson).toHaveBeenCalledWith(benefits);
    });

    it('should handle errors', async () => {
      mockRepository.findAll.mockRejectedValue(new Error('Database error'));

      await controller.listBenefits({} as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('createBenefit', () => {
    it('should create a benefit with valid data', async () => {
      const benefitData = {
        name: 'New Benefit',
        description: 'Description',
      };

      const createdBenefit = { ...benefitData, id: 1, isActive: true };

      mockRequest = {
        body: benefitData,
      };

      mockRepository.create.mockResolvedValue(createdBenefit);

      await controller.createBenefit(mockRequest as Request, mockResponse as Response);

      expect(mockRepository.create).toHaveBeenCalled();
      expect(responseStatus).toHaveBeenCalledWith(201);
      expect(responseJson).toHaveBeenCalledWith(createdBenefit);
    });

    it('should handle validation errors', async () => {
      mockRequest = {
        body: {
          name: 'ab',
          description: 'Description',
        },
      };

      mockRepository.create.mockRejectedValue(new Error('Name must be between 3 and 100 characters'));

      await controller.createBenefit(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(400);
      expect(responseJson).toHaveBeenCalledWith({
        error: 'Name must be between 3 and 100 characters'
      });
    });
  });

  describe('deactivateBenefit', () => {
    it('should deactivate an existing benefit', async () => {
      const benefit = {
        id: 1,
        name: 'Benefit',
        description: 'Description',
        isActive: false
      };

      mockRequest = {
        params: { id: '1' },
      };

      mockRepository.update.mockResolvedValue(benefit);

      await controller.deactivateBenefit(mockRequest as Request, mockResponse as Response);

      expect(mockRepository.update).toHaveBeenCalledWith(1, { isActive: false });
      expect(responseJson).toHaveBeenCalledWith(benefit);
    });

    it('should handle non-existent benefit', async () => {
      mockRequest = {
        params: { id: '999' },
      };

      mockRepository.update.mockResolvedValue(null);

      await controller.deactivateBenefit(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(404);
      expect(responseJson).toHaveBeenCalledWith({ error: 'Benefit not found' });
    });
  });

  describe('activateBenefit', () => {
    it('should activate an existing benefit', async () => {
      const benefit = {
        id: 1,
        name: 'Benefit',
        description: 'Description',
        isActive: true
      };

      mockRequest = {
        params: { id: '1' },
      };

      mockRepository.update.mockResolvedValue(benefit);

      await controller.activateBenefit(mockRequest as Request, mockResponse as Response);

      expect(mockRepository.update).toHaveBeenCalledWith(1, { isActive: true });
      expect(responseJson).toHaveBeenCalledWith(benefit);
    });
  });

  describe('deleteBenefit', () => {
    it('should delete an existing benefit', async () => {
      mockRequest = {
        params: { id: '1' },
      };

      await controller.deleteBenefit(mockRequest as Request, mockResponse as Response);

      expect(mockRepository.delete).toHaveBeenCalledWith(1);
      expect(responseStatus).toHaveBeenCalledWith(204);
      expect(mockResponse.send).toHaveBeenCalled();
    });

    it('should handle errors during deletion', async () => {
      mockRequest = {
        params: { id: '1' },
      };

      mockRepository.delete.mockRejectedValue(new Error('Database error'));

      await controller.deleteBenefit(mockRequest as Request, mockResponse as Response);

      expect(responseStatus).toHaveBeenCalledWith(500);
      expect(responseJson).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });
});
