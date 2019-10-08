import { TestBed, inject } from '@angular/core/testing';

import { CreateOrderService } from './create-order.service';

describe('CreateOrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreateOrderService]
    });
  });

  it('should be created', inject([CreateOrderService], (service: CreateOrderService) => {
    expect(service).toBeTruthy();
  }));
});
