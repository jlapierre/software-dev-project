(function () {
    'use strict';

    angular
        .module('app')
        .factory('PartnerService', PartnerService);

    function PartnerService($http) {

        // Get all of the current partners
        function getPartners() {
            return $http({
                method: 'GET',
                url: '/api/all_partners'});
        }

        // Update the given partner
        function updatePartner(partner) {
            return $http({
                method: 'POST',
                url: '/api/update_partner',
                data: {partner: partner}});
        }

        // Add a new partner
        function addPartner(partner) {
            return $http({
                method: 'POST',
                url: '/api/create_partner',
                data: {partner: partner}});
        }

        // Delete the given partner
        function deletePartner(partner) {
            return $http({
                method: 'POST',
                url: '/api/delete_partner/' + partner
            });
        }

        // Upload a new set of partners
        function uploadPartners(file) {
            var fileFormData = new FormData();
            fileFormData.append('file', file);

            return $http({
                method: 'POST',
                url: '/api/upload_from_file',
                data: {file: fileFormData, type: 'Partners'}});
        }

        return {
            getPartners: getPartners,
            updatePartner: updatePartner,
            deletePartner: deletePartner,
            addPartner: addPartner,
            uploadPartners: uploadPartners
        };
    }

})();