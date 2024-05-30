/**
 * Generate a $200 extra if the Door Frame Colour doe snot match the Window colour.
   But NOT if either is TBC or empty.
 * @param doorFrameColour
 * @param windowFrameColour
 */
const doorFrameColour = (doorFrameColour, windowFrameColour) => {
  if (doorFrameColour === undefined || windowFrameColour === undefined) {
    return false;
  }
  if (doorFrameColour.toLowerCase() === 'tbc' || windowFrameColour.toLowerCase() === 'tbc') {
    return false;
  }
  if (doorFrameColour === '' || windowFrameColour === '') {
    return false;
  }
  if (doorFrameColour === windowFrameColour) {
    return false;
  }
  return true;
};

export default doorFrameColour;
