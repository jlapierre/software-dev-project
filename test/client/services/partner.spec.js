'use strict';

describe('PartnerService', function() {

  beforeEach(module('app'));


  it('service should contain a function called getPartners', inject(function($injector) {
    var PartnerService = $injector.get('PartnerService');

    expect(PartnerService.getPartners).not.toBe(undefined);
    expect(typeof PartnerService.getPartners).toBe('function');

  }));

  it('getPartners should return a list of partners', inject(function($injector) {
    var PartnerService = $injector.get('PartnerService');
    var partners = PartnerService.getPartners();

    expect(Array.isArray(partners)).toBe(true);

  }));

  it('service should contain a function called uploadPartners', inject(function($injector) {
    var PartnerService = $injector.get('PartnerService');

    expect(PartnerService.uploadPartners).not.toBe(undefined);
    expect(typeof PartnerService.uploadPartners).toBe('function');

  }));

  it('uploadPartners should return a list of partners', inject(function($injector) {
    var PartnerService = $injector.get('PartnerService');
    var promise = PartnerService.uploadPartners();

    expect(typeof promise).toBe('object');

  }));

});