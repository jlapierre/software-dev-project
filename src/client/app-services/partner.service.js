(function () {
    'use strict';

    angular
        .module('app')
        .factory('PartnerService', PartnerService);

    function PartnerService($http) {
        // Example Contacts
        var contact1 = {
            name: 'Katherine McDonough',
            email: 'mcdonough.kat@husky.neu.edu',
            phone: '6175550129',
            active: true
        };
        var contact2 = {
            name: 'Jennifer LaPierre',
            email: 'lapierre.j@husky.neu.edu',
            phone: '6175558726',
            active: true
        };
        var contact3 = {
            name: 'Lawrence Lim',
            email: 'lim.law@husky.neu.edu',
            phone: '6175558217',
            active: true
        };
        var contact4 = {
            name: 'Jonathon Northcott',
            email: 'northcott.j@husky.neu.edu',
            phone: '6175552625',
            active: true
        };

        // Example Locations
        var location1 = {
            street: '165 Hemenway Street',
            city: 'Boston',
            state: 'MA',
            zipcode: '02115',
            location: {lat: 42.341423, lng: -71.091129},
            name: '165 Hemenway Street, Boston MA, 02115',
            active: true
        };
        var location2 = {
            street: '171 Hemenway Street',
            city: 'Boston',
            state: 'MA',
            zipcode: '02115',
            location: {lat: 42.341309, lng: -71.091202},
            name: '171 Hemenway Street, Boston MA, 02115',
            active: true
        };
        var location3 = {
            street: '360 Huntington Ave',
            city: 'Boston',
            state: 'MA',
            zipcode: '02115',
            location: {lat: 42.340496, lng: -71.087897},
            name: '360 Huntington Ave, Boston MA, 02115',
            active: true
        };
        var location4 = {
            street: '633 Clark Street',
            city: 'Evanston',
            state: 'IL',
            zipcode: '60208',
            location: {lat: 42.050626, lng: -87.679727},
            name: '633 Clark Street, Evanston IL, 60208',
            active: true
        };

        // Example Partners
        var partner1 = {
            id: 1,
            name: 'Partner 1',
            contacts: {1: contact1},
            locations: {1: location1, 2: location2},
            core: true,
            active: true
        };
        var partner2 = {
            id: 2,
            name: 'Partner 2',
            contacts: {},
            locations: {3: location3},
            core: false,
            active: true
        };
        var partner3 = {
            id: 3,
            name: 'Partner 3',
            contacts: {2: contact2, 3: contact3, 4: contact4},
            locations: {2: location2, 3: location3, 4: location4},
            core: true,
            active: true
        };
        var partner4 = {
            id: 4,
            name: 'Partner 4',
            contacts: {2: contact2, 4: contact4},
            locations: {2: location2, 4: location4},
            core: false,
            active: false
        };

        // Get all of the current partners
        function getPartners() {
            return [partner1, partner2, partner3, partner4];
        }

        // Update the given partner
        function updatePartner(partner) {
            return true;
        }

        // Add a new partner
        function addPartner(partner) {
            return true;
        }

        // Delete the given partner
        function deletePartner(partner) {
            return true;
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