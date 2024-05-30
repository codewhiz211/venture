import { ORDER_LIST, SPEC } from './spec.fortest';
import { fieldHasValue, getSectionGroups, isGroupedBySubtitle, withoutEmptyGrouped } from './helpers';
import { includes, keys, mergeRight } from 'ramda';

import { exportVentureSpecForFreedom } from './export.service';
import mainBathroomConfig from '../config/spec-config/main-bathroom';

const checker = (arr, target) => target.every((v) => arr.includes(v));

describe('Export Service:', function () {
  describe('Export - Helpers', function () {
    it(`getSectionGroups - converts section to groups`, function () {
      const groups = getSectionGroups(mainBathroomConfig);

      expect(groups[0].group).toBe(0);
      expect(groups[0].title).toBe('Shower');
      expect(
        checker(groups[0].fields, [
          'shower',
          'showerPmNote',
          'mouldedWall',
          'glassDoor',
          'trim',
          'showerSlide',
          'tiledShelf',
          'enduroShield',
          'showerFrame',
          'showerMixer',
          'numberMixers',
        ])
      ).toBe(true);

      expect(groups[1].group).toBe(1);
      expect(groups[1].title).toBe('Shower - Tiles');
      expect(
        checker(groups[1].fields, [
          'showerTilesPmNote',
          'mainShowerColour1',
          'mainShowerColour2',
          'mainShowerGrout',
          'mainShowerLayout',
          'mainShowerTile',
          'mainShowerFloor',
          'mainShowerWall',
        ])
      ).toBe(true);
    });

    it(`isGroupedBySubtitle`, function () {
      expect(isGroupedBySubtitle('mainBathroom')).toBe(true);
      expect(isGroupedBySubtitle('ensuite')).toBe(true);
      expect(isGroupedBySubtitle('interior')).toBe(true);
      expect(isGroupedBySubtitle('joinery')).toBe(true);
      expect(isGroupedBySubtitle('kitchen')).toBe(true);
      expect(isGroupedBySubtitle('landscape')).toBe(true);
      expect(isGroupedBySubtitle('toilet')).toBe(true);

      expect(isGroupedBySubtitle('planning')).toBe(false);
    });

    it(`fieldHasValue`, function () {
      expect(fieldHasValue({ value: 'value' })).toBe(true);
      expect(fieldHasValue({ hex: 'value' })).toBe(true);
      expect(fieldHasValue({ url: 'value' })).toBe(true);

      expect(fieldHasValue({ label: 'label' })).toBe(false);
    });

    it(`withoutEmptyGrouped`, function () {
      const result = withoutEmptyGrouped({
        enduroShield: { label: 'Enduro Shield', value: undefined },
        glassDoor: { label: 'Glass Door', value: 'Yes' },
      });
      expect(result).toEqual({ glassDoor: { label: 'Glass Door', value: 'Yes' } });
    });
  });

  describe('Export => ', function () {
    it(`Exports Spec`, function () {
      const exported = exportVentureSpecForFreedom(SPEC);
      expect(exported).toBeDefined(exported);
    });

    it(`Removes unRequired sections from the export`, function () {
      const exported = exportVentureSpecForFreedom(SPEC);
      const exportedSections = keys(exported);
      expect(includes('custom_fields', exportedSections)).toBe(false);
      expect(includes('quote', exportedSections)).toBe(false);
    });

    it(`Removes hidden sections from the export`, function () {
      const input = mergeRight(SPEC, {
        hiddenSections: {
          garage: true,
          mainBathroom: false,
        },
      });

      const exported = exportVentureSpecForFreedom(input);
      const exportedSections = keys(exported);
      expect(includes('garage', exportedSections)).toBe(false);
      expect(includes('specBathroom', exportedSections)).toBe(true); // mainBathroom gets renamed to freedom value  => specBathroom
    });

    it(`Removes hidden sub sections (ONLY) from the export`, function () {
      const input = mergeRight(SPEC, {
        hiddenSections: {
          garage: true,
          mainBathroom: false,
          ensuite: {
            toiletSubTitle: true,
          },
        },
      });
      const exported = exportVentureSpecForFreedom(input);
      const exportedSections = keys(exported);
      expect(includes('specGarage', exportedSections)).toBe(false);
      expect(includes('specEnsuite', exportedSections)).toBe(true, 'ensuite');
      expect(includes('specBathroom', exportedSections)).toBe(true, 'mainBathroom');

      const toiletGroup = exported.specEnsuite.groups.find((group) => group.title === 'Toilet');
      expect(toiletGroup).toBeUndefined();

      const showerGroup = exported.specEnsuite.groups.find((group) => group.title === 'Shower');
      expect(showerGroup).toBeDefined();
    });

    it(`Adds section title`, function () {
      const exported = exportVentureSpecForFreedom(SPEC);

      expect(exported.specGarage.title).toEqual('Garage'); // garage gets renamed to freedom value => specGarage
    });

    it(`Adds custom (edited) section title`, function () {
      // @ts-ignore
      SPEC.insulation = { title: 'New Title' };

      const exported = exportVentureSpecForFreedom(SPEC);

      expect(exported.specInsulation.title).toEqual('New Title');
    });

    it(`Adds custom (edited) section subtitle`, function () {
      // @ts-ignore
      SPEC.custom_fields = { mainBathroom: { vanitySubTitle: 'Main Vanity' } };

      const exported = exportVentureSpecForFreedom(SPEC);

      expect(exported.specBathroom.groups[2].title).toEqual('Main Vanity');
    });

    it(`Adds order (if any) to sections`, function () {
      // @ts-ignore
      SPEC.sort = { orderList: ORDER_LIST };

      const exported = exportVentureSpecForFreedom(SPEC);

      expect(exported.specGarage.order).toBe(1);
      expect(exported.specBathroom.order).toBe(3);
    });

    it(`Adds order (if any) to additional sections`, function () {
      // @ts-ignore
      SPEC.sort = { orderList: ORDER_LIST };
      // @ts-ignore
      SPEC.floor = { test: 'value' };
      // @ts-ignore
      SPEC['flooring-additional'] = { test: 'value' };

      const exported = exportVentureSpecForFreedom(SPEC);

      expect(exported.specFloor.order).toBe(17);
      expect(exported.specFloorAdditional.order).toBe(17.5);
    });

    it(`It adds all fields to contact details section`, function () {
      const exported = exportVentureSpecForFreedom(SPEC);
      console.log(exported);
      expect(exported.specContactDetails.client).toEqual({
        label: 'Client Name',
        value: 'Mr Cantona',
        order: 1,
      });

      expect(exported.specContactDetails.phones).toEqual({
        label: 'Phone',
        value: [123456789],
        order: 2,
      });

      expect(exported.specContactDetails.emails).toEqual({
        label: 'Email',
        value: ['client@email.com'],
        order: 3,
      });

      expect(exported.specContactDetails.consultantName).toEqual({
        label: 'Sales Consultant',
        value: 'Randall Bouverie',
        order: 4,
      });
      expect(exported.specContactDetails.consultantPhone).toEqual({
        label: 'Sales Consultant Phone',
        value: '11111',
        order: 5,
      });
      expect(exported.specContactDetails.consultantEmail).toEqual({
        label: 'Sales Consultant Email',
        value: 'share@email.com',
        order: 6,
      });
      expect(exported.specContactDetails.projectManagerName).toEqual({
        label: 'Project Manager',
        value: 'Darren Merrick',
        order: 7,
      });

      expect(exported.specContactDetails.projectManagerPhone).toEqual({
        label: 'Project Manager Phone',
        value: '0274698318',
        order: 8,
      });
      expect(exported.specContactDetails.projectManagerEmail).toEqual({
        label: 'Project Manager Email',
        value: 'darren.merrick@venturedevelopments.co.nz',
        order: 9,
      });

      expect(exported.specContactDetails.quantitySurveyorName).toEqual({
        label: 'Quantity Surveyor',
        value: 'Kaelin Clark',
        order: 10,
      });
      expect(exported.specContactDetails.quantitySurveyorEmail).toEqual({
        label: 'Quantity Surveyor Email',
        value: 'kaelin.clark@venturedevelopments.co.nz',
        order: 11,
      });
    });

    it(`It does not add email or phone to contact details if empty`, function () {
      SPEC.contact_details = {
        ...SPEC.contact_details,
        // @ts-ignore
        phones: undefined,
        emails: [],
      };
      const exported = exportVentureSpecForFreedom(SPEC);
      expect(exported.specContactDetails.emails).toBeUndefined();
      expect(exported.specContactDetails.phones).toBeUndefined();
    });

    it(`It does not add email or phone to contact details if empty (2)`, function () {
      SPEC.contact_details = {
        ...SPEC.contact_details,
        // @ts-ignore
        phones: [''],
        emails: [''],
      };
      const exported = exportVentureSpecForFreedom(SPEC);
      expect(exported.specContactDetails.emails).toBeUndefined();
      expect(exported.specContactDetails.phones).toBeUndefined();
    });

    it(`It adds all fields to meta section`, function () {
      const exported = exportVentureSpecForFreedom(SPEC);

      expect(exported.meta.clientName).toEqual(SPEC.contact_details.client);
      expect(exported.meta.subdivision).toEqual(SPEC.section_details.subdivision);
    });

    it(`Adds custom (free text) sections (if any)`, function () {
      // @ts-ignore
      SPEC.sort = { orderList: ORDER_LIST };

      const exported = exportVentureSpecForFreedom(SPEC);

      expect(exported.swimmingpool_22).toBeDefined();
      expect(exported.swimmingpool_22.order).toBe(4);
      expect(exported.swimmingpool_22.title).toBe('Swimming Pool');
      expect(exported.swimmingpool_22.attachImage_additional).toEqual({
        label: 'Info',
        value: 'comes with pool cleaning robot',
      });
    });

    it(`Adds custom (duplicate) sections (if any)`, function () {
      // @ts-ignore
      SPEC.sort = { orderList: ORDER_LIST };

      // @ts-ignore
      const exported = exportVentureSpecForFreedom(SPEC);

      expect(exported.garage_23).toBeDefined();
      expect(exported.garage_23.title).toBe('New Garage');
      expect(exported.garage_23.order).toBe(5);
      expect(exported.garage_23.garageColour).toEqual({
        label: 'Colour',
        name: 'Desert sand',
        value: 'Desert sand',
        // TODO V2
        //hex: '#AD987A'
      });

      expect(exported.garage_23.order).toBe(5);
    });

    it(`Custom sections are not duplicated`, function () {
      // @ts-ignore
      SPEC.sort = { orderList: ORDER_LIST };

      const exported = exportVentureSpecForFreedom(SPEC);
      const allSections = keys(exported);
      const freeSections = allSections.filter((k) => k === 'swimmingpool_22');
      const duplicateSections = allSections.filter((k) => k === 'garage_23');

      expect(freeSections.length).toBe(1);
      expect(duplicateSections.length).toBe(1);
    });

    it(`There are no undefined sections`, function () {
      // @ts-ignore
      SPEC.sort = { orderList: ORDER_LIST };

      const exported = exportVentureSpecForFreedom(SPEC);
      const allSections = keys(exported);
      const undefinedSections = allSections.filter((k) => k === 'undefined');
      expect(undefinedSections.length).toBe(0);
    });

    it(`Does not include ignored fields for sections`, function () {
      // @ts-ignore
      SPEC.sort = { orderList: ORDER_LIST };

      // @ts-ignore
      const exported = exportVentureSpecForFreedom(SPEC);

      expect(exported.garage_23).toBeDefined();
      expect(exported.garage_23.hasExtras).toBeUndefined();
      expect(exported.garage_23.canHide).toBeUndefined();
      expect(exported.garage_23.dummy).toBeUndefined();
      expect(exported.garage_23.fields).toBeUndefined();
      expect(exported.garage_23.name).toBeUndefined();
      expect(exported.garage_23.id).toBeUndefined();
    });

    it(`Converts Normal section Standard fields (garageDoorInsulation)`, function () {
      const exported = exportVentureSpecForFreedom(SPEC);

      expect(exported.specGarage.garageDoorInsulation).toEqual({
        label: 'GDoor Insulation',
        value: 'No',
        order: 4,
      });
    });

    it(`Converts Normal section Standard fields with hint (AtticLader)`, function () {
      const exported = exportVentureSpecForFreedom(SPEC);

      expect(exported.specGarage.atticLadder).toEqual({
        label: 'Attic Ladder',
        value: 'Yes',
        hint: 'Includes 2 x kopine floor sheets',
        order: 7,
      });
    });

    it(`Converts Normal section Colour fields (Garage Colour)`, function () {
      const exported = exportVentureSpecForFreedom(SPEC);

      expect(exported.specGarage.garageColour).toEqual({
        label: 'Colour',
        name: 'Flax Pod',
        value: 'Flax Pod',
        order: 3,
        // TODO V2
        //hex: '#2F3131'
      });
    });

    // TODO restore once we have hosted images complete
    // it(`Converts Normal section Image fields (garageDoor)`, function() {
    //   const hiddenSections = {};

    //   const exported = exportVentureSpecForFreedom(SPEC, hiddenSections);

    //   expect(exported.specGarage.garageDoor).toEqual({
    //     label: 'Garage Door',
    //     name: 'Futura - Smooth',
    //     url: 'futura.png'
    //   });
    // });

    xit(`Adds fields for Kitchen Splashback Tiles when selected`, function () {
      const exported = exportVentureSpecForFreedom(SPEC);

      expect(exported.specKitchen.garageColour).toEqual({
        label: 'Colour',
        name: 'Flax Pod',
        hex: '#2F3131',
      });
    });

    xit(`Adds subheadings for sections that are groupBySubtitle (MainBathroom)`, function () {
      const exported = exportVentureSpecForFreedom(SPEC);

      expect(exported.specBathroom.grouped).toBe(true);
      expect(exported.specBathroom.title).toEqual('Main Bathroom');

      expect(exported.specBathroom.groups[0].title).toEqual('Shower');
      expect(exported.specBathroom.groups[0].fields['enduroShield']).toEqual({
        label: 'Enduro Shield',
        value: 'No',
        order: 10,
      });

      expect(exported.specBathroom.groups[2].title).toEqual('Vanity');
      expect(exported.specBathroom.groups[2].fields['vanity']).toEqual({
        label: 'Vanity',
        value: 'Venture S50 double draw neg detail handles ',
        order: 33,
      });
    });

    it(`Converts Additional section fields`, function () {
      // @ts-ignore
      SPEC.sort = { orderList: ORDER_LIST };

      const exported = exportVentureSpecForFreedom(SPEC);

      // TO REVIEW Andrii updates the method that calculates order
      // see https://bitbucket.org/mattg88/venture/pull-requests/267
      const expected = {
        title: 'Cladding',
        blocked: true,
        order: 8.5,
        blocks: [
          {
            block: 0,
            fields: {
              claddingType: {
                label: 'Cladding Type',
                value: 'JH Linea WB 180mm cover',
                order: 0,
              },
              area: {
                label: 'Area',
                value: 'As per plan',
                order: 1,
              },
              colour1: {
                label: 'Colour 1',
                value: 'Double Foundry',
                order: 3,
              },
              lrv1: {
                label: 'LRV',
                value: '6',
                order: 4,
              },
            },
          },
          {
            block: 1,
            fields: {
              claddingType: {
                label: 'Cladding Type',
                value: 'JH Linea WB 180mm cover',
                order: 0,
              },
              area: {
                label: 'Area',
                value: 'As per plan',
                order: 1,
              },
              colour1: {
                label: 'Colour 1',
                value: 'Double Foundry',
                order: 3,
              },
              lrv1: {
                label: 'LRV',
                value: '6',
                order: 4,
              },
              mortarColour: {
                label: 'Mortar Colour',
                hint: 'Mortar to match brick colour additional $400 (POA)',
                value: 'Coloured to match',
                order: 7,
              },
            },
          },
          {
            block: 2,
            fields: {
              area: {
                label: 'Area',
                value: 'Outdoor Bar',
                order: 1,
              },
              facingsAndScribers: {
                label: 'Facings and Scribers',
                value: 'Rounded Scriber (std)',
                order: 2,
              },
            },
          },
        ],
      };
      expect(exported['specCladdingAdditional']).toEqual(expected);
    });
  });
});
