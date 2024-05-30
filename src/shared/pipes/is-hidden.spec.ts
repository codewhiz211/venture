import { showHideField, showHideSection } from './is-hidden.pipe';

const hiddenSections = {
  mainBathroom: true,
  blinds: {},
  joinery: {
    windowsSubTitle: false
  },
  floor: {
    carpetSubTitle: true,
    tileSubtitle: true
  }
};

describe('showHideSection', function() {
  it(`returns TRUE, when sectionName is in hiddenSections and value is true `, function() {
    expect(showHideSection(hiddenSections, 'mainBathroom')).toEqual(true);
  });
  it(`returns FALSE, when sectionName is NOT in hiddenSections`, function() {
    expect(showHideSection(hiddenSections, 'garage')).toEqual(false);
  });
  it(`returns FALSE, when sectionName is in hiddenSections and value is empty object`, function() {
    expect(showHideSection(hiddenSections, 'blinds')).toEqual(false);
  });
  it(`returns FALSE, when sectionName is in hiddenSections and value is object, with no hidden Subsection`, function() {
    expect(showHideSection(hiddenSections, 'joinery')).toEqual(false);
  });
  it(`returns FALSE, when sectionName is in hiddenSections and value is object, with some hidden Subsections`, function() {
    expect(showHideSection(hiddenSections, 'floor')).toEqual(false);
  });
});

describe('showHideField', function() {
  it(`returns TRUE, when both sectionName adn fieldName are in hiddenSections and fieldNname is true `, function() {
    expect(showHideField(hiddenSections, 'floor', 'carpetSubTitle')).toEqual(true);
  });
  // probably not needed since outer container is not displayed?
  xit(`returns TRUE, when both sectionName is in hiddenSections and has value of true`, function() {
    expect(showHideField(hiddenSections, 'mainBathroom', 'showerSubTitle')).toEqual(true);
  });
  it(`returns FALSE, when sectionName is NOT in hiddenSections `, function() {
    expect(showHideField(hiddenSections, 'garage', 'carpetSubTitle')).toEqual(false);
  });
  it(`returns FALSE, when sectionName is in hiddenSections, but fieldName is not `, function() {
    expect(showHideField(hiddenSections, 'blinds', 'blindSubTitle')).toEqual(false);
  });
  it(`returns FALSE, when both sectionName and fieldName are in hiddenSections, but fieldName is false `, function() {
    expect(showHideField(hiddenSections, 'joinery', 'windowsSubTitle')).toEqual(false);
  });
});
