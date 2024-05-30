import {
  bathHistoryImages,
  bathImages,
  bathMixerImages,
  bathSpoutImages,
  historyShowerMixerImages,
  historyVanityColourImages,
  mainBathRoomVanityColourImages,
  mouldedWallImages,
  showerImages,
  showerMixerImages,
  toiletImages,
  toiletRollHolder,
  towelRailImages,
  vanityImages,
  vanityMixerImages
} from './images';

export const mainBathroomConfig = {
  id: 13,
  name: 'mainBathroom',
  title: 'Main Bathroom',
  canHide: true,
  canDuplicate: true,
  hasExtras: true,
  groupBySubtitle: true,
  fields: [
    // SHOWER /////////////////////////////////////////////////
    { name: 'mainBathroomPmNote', display: 'PM Notes', type: 'textarea' },
    { type: 'subtitle', text: 'Shower', name: 'showerSubTitle' },
    { name: 'showerPmNote', display: 'PM Notes', type: 'textarea', canHide: 'showerSubTitle' },
    {
      name: 'shower',
      display: 'Shower',
      items: showerImages,
      type: 'image-picker',
      conditional: [
        'glassDoor',
        'trim',
        'mouldedWall',
        'tiledShelf',
        'mainShowerTile',
        'mainShowerColour1',
        'mainShowerColour2',
        'mainShowerGrout',
        'mainShowerLayout',
        'numberMixers',
        'showerFrame',
        'mainShowerFloor',
        'mainShowerWall',
        'showerTileSubTitle'
      ],
      canHide: 'showerSubTitle'
    },
    {
      name: 'mouldedWall',
      display: 'Moulded Wall',
      items: mouldedWallImages,
      type: 'image-picker',
      condition: {
        field: 'shower',
        value: '!tiledAsPerPlan'
      },
      canHide: 'showerSubTitle'
    },
    {
      name: 'glassDoor',
      display: 'Glass Door',
      items: ['Sliding', 'Hinged', 'Panel', 'Other - Please specify'],
      type: 'dropdown',
      condition: {
        field: 'shower',
        value: 'tiledAsPerPlan'
      },
      canHide: 'showerSubTitle'
    },
    {
      name: 'trim',
      display: 'Trim',
      type: 'text-conditional',
      condition: {
        field: 'shower',
        value: 'tiledAsPerPlan'
      },
      canHide: 'showerSubTitle'
    },
    {
      name: 'showerSlide',
      display: 'Shower Slide',
      items: ['Std', 'Viva', 'Fixed Rose', 'Other - Please Specify'],
      type: 'dropdown',
      canHide: 'showerSubTitle'
    },
    {
      name: 'tiledShelf',
      display: 'Tiled Shelf',
      items: ['Yes', 'No', 'Other - Please Specify'],
      type: 'dropdown',
      condition: {
        field: 'shower',
        value: 'tiledAsPerPlan'
      },
      canHide: 'showerSubTitle'
    },
    {
      name: 'enduroShield',
      display: 'Enduro Shield',
      items: ['Yes', 'No', 'Other - Please Specify'],
      type: 'dropdown',
      canHide: 'showerSubTitle'
    },
    {
      name: 'showerFrame',
      display: 'Shower Frame',
      items: ['White', 'Chrome', 'Other - Please Specify'],
      type: 'dropdown',
      condition: {
        field: 'shower',
        value: 'tiledAsPerPlan'
      },
      canHide: 'showerSubTitle'
    },
    {
      name: 'showerMixer',
      display: 'Shower Mixer',
      items: showerMixerImages,
      historyItems: historyShowerMixerImages,
      type: 'image-picker',
      canHide: 'showerSubTitle'
    },
    {
      name: 'showerFrame',
      display: 'Shower Frame',
      items: ['White', 'Chrome (std)', ' Black (POA)', 'Other - Please Specify'],
      type: 'dropdown',
      condition: {
        field: 'shower',
        value: '!tiledAsPerPlan'
      },
      canHide: 'showerSubTitle'
    },
    {
      name: 'numberMixers',
      display: 'Number Mixers',
      type: 'number-conditional',
      condition: {
        field: 'shower',
        value: 'tiledAsPerPlan'
      },
      canHide: 'showerSubTitle'
    },
    // SHOWER TILES
    {
      type: 'subtitle-conditional',
      text: 'Shower - Tiles',
      name: 'showerTileSubTitle',
      condition: {
        field: 'shower',
        value: 'tiledAsPerPlan'
      }
    },
    { name: 'showerTilesPmNote', display: 'PM Notes', type: 'textarea', canHide: 'showerTileSubTitle' },
    {
      name: 'mainShowerTile',
      display: 'Tile Type',
      type: 'text-conditional',
      condition: {
        specVersion: '1.0',
        field: 'shower',
        value: 'tiledAsPerPlan'
      },
      canHide: 'showerTileSubTitle'
    },
    {
      name: 'mainShowerColour1',
      display: 'Tile Colour 1',
      type: 'text-conditional',
      condition: {
        specVersion: '1.0',
        field: 'shower',
        value: 'tiledAsPerPlan'
      },
      canHide: 'showerTileSubTitle'
    },
    {
      name: 'mainShowerColour2',
      display: 'Tile Colour 2',
      type: 'text-conditional',
      condition: {
        specVersion: '1.0',
        field: 'shower',
        value: 'tiledAsPerPlan'
      },
      canHide: 'showerTileSubTitle'
    },
    {
      name: 'mainShowerGrout',
      display: 'Grout Colour',
      type: 'text-conditional',
      condition: {
        specVersion: '1.0',
        field: 'shower',
        value: 'tiledAsPerPlan'
      },
      canHide: 'showerTileSubTitle'
    },
    {
      name: 'mainShowerLayout',
      display: 'Tile Layout',
      type: 'text-conditional',
      condition: {
        specVersion: '1.0',
        field: 'shower',
        value: 'tiledAsPerPlan'
      },
      canHide: 'showerTileSubTitle'
    },
    {
      name: 'mainShowerFloor',
      display: 'Floor Tile',
      items: ['Stack bond (STD)', 'Hearing Bone, Stretch, Mosaic, ETC. (POA)', 'None', 'Other - Please Specify'],
      type: 'dropdown',
      condition: {
        specVersion: '1.0',
        field: 'shower',
        value: 'tiledAsPerPlan'
      },
      canHide: 'showerTileSubTitle'
    },
    {
      name: 'mainShowerWall',
      display: 'Wall Tile',
      items: ['Stack bond (STD)', 'Hearing Bone, Stretch, Mosaic, ETC. (POA)', 'None', 'Other - Please Specify'],
      type: 'dropdown',
      condition: {
        specVersion: '1.0',
        field: 'shower',
        value: 'tiledAsPerPlan'
      },
      canHide: 'showerTileSubTitle'
    },
    {
      name: 'mainShowerWallTileColour',
      display: 'Wall Tile Colour',
      type: 'text-conditional',
      condition: {
        specVersion: '2.01+',
        field: 'shower',
        value: 'tiledAsPerPlan'
      },
      canHide: 'showerTileSubTitle'
    },
    {
      name: 'mainShowerWallGroutColour',
      display: 'Wall Grout Colour',
      type: 'text-conditional',
      condition: {
        specVersion: '2.01+',
        field: 'shower',
        value: 'tiledAsPerPlan'
      },
      canHide: 'showerTileSubTitle'
    },
    {
      name: 'mainShowerWallTileLayout',
      display: 'Wall Tile Layout',
      type: 'dropdown',
      items: ['Stacked', 'Bricklayed', 'Other - Please specify'],
      condition: {
        specVersion: '2.01+',
        field: 'shower',
        value: 'tiledAsPerPlan'
      },
      canHide: 'showerTileSubTitle'
    },
    {
      name: 'mainShowerFloorTileColour',
      display: 'Floor Tile Colour',
      type: 'text-conditional',
      condition: {
        specVersion: '2.01+',
        field: 'shower',
        value: 'tiledAsPerPlan'
      },
      canHide: 'showerTileSubTitle'
    },
    {
      name: 'mainShowerFloorGroutColour',
      display: 'Floor Grout Colour',
      type: 'text-conditional',
      condition: {
        specVersion: '2.01+',
        field: 'shower',
        value: 'tiledAsPerPlan'
      },
      canHide: 'showerTileSubTitle'
    },
    {
      name: 'mainShowerFloorTileLayout',
      display: 'Floor Tile Layout',
      type: 'dropdown',
      items: ['Stacked', 'Bricklayed', 'Other - Please specify'],
      condition: {
        specVersion: '2.01+',
        field: 'shower',
        value: 'tiledAsPerPlan'
      },
      canHide: 'showerTileSubTitle'
    },
    {
      name: 'mainShowerAdditionalInfo',
      display: 'Additional Info',
      type: 'textarea-conditional',
      condition: {
        field: 'shower',
        value: 'tiledAsPerPlan'
      },
      canHide: 'showerTileSubTitle'
    },

    // VANITY /////////////////////////////////////////////////

    { type: 'subtitle', text: 'Vanity', name: 'vanitySubTitle' },
    { name: 'vanityPmNote', display: 'PM Notes', type: 'textarea', canHide: 'vanitySubTitle' },
    { name: 'vanity', display: 'Vanity', items: vanityImages, type: 'image-picker', canHide: 'vanitySubTitle' },
    {
      name: 'vanityColour',
      display: 'Vanity Colour',
      items: mainBathRoomVanityColourImages,
      historyItems: historyVanityColourImages,
      type: 'image-picker',
      canHide: 'vanitySubTitle'
    },
    //This field 'melamineFinishes' is deprecated and just serves for old value Melamine Woodgrain (Std)' in vanityColour
    {
      type: 'dropdown',
      display: 'Melamine Finishes',
      name: 'melamineFinishes',
      condition: {
        field: 'vanityColour',
        value: 'Melamine Woodgrain (Std)'
      },
      items: [
        'Melamine Wilderness Arctic White',
        'Melamine Winter Wood Velvet',
        'Melamine Cape Cod Velvet',
        'Melamine Grain Premium Oak',
        'Melamine Coastal Elm Wilderness',
        'Melamine Grain Basalt',
        'Melamine Treble Beech Wilderness',
        'Melamine Coronet Beech Wilderness',
        'Melamine Dusky Elm Wilderness',
        'Melamine Southern Oak Velvet',
        'Melamine Tahoe Walnut',
        'Melamine Fumed Oak',
        'Melamine Hamptons Elm Velvet',
        'Melamine Tasman Elm Wilderness',
        'Other - Please Specify'
      ],
      canHide: 'vanitySubTitle'
    },
    {
      type: 'dropdown',
      display: 'Vanity Handles',
      name: 'vanityHandles',
      items: ['Concealed Opening (std)', 'Handles', 'Other - Please Specify'],
      canHide: 'vanitySubTitle'
    },
    { name: 'vanityMixer', display: 'Vanity Mixer', items: vanityMixerImages, type: 'image-picker', canHide: 'vanitySubTitle' },
    {
      name: 'mirrorVanity',
      display: 'Mirror Vanity',
      items: ['900 High with tiled splashback', '1100 High mirror down to vanity', 'Other - Please specify'],
      type: 'dropdown',
      canHide: 'vanitySubTitle'
    },
    {
      name: 'vanitySplashback',
      display: 'Vanity Splashback',
      items: ['Match Bath Height', 'Tiled 100mm', 'Tiled 200mm', 'Tiled - other', 'Mirror', 'None', 'Other - Please Specify'],
      type: 'dropdown',
      conditional: ['subtitleVanityTiles', 'mainVanityTile', 'mainVanityColour', 'mainVanityGrout', 'mainVanityLayout'],
      canHide: 'vanitySubTitle'
    },
    {
      name: 'splashbackColour',
      display: 'Splashback Colour',
      type: 'text'
    },
    /// VANITY TILES /////////////////////////////////////////////
    {
      type: 'subtitle-conditional',
      text: 'Vanity Splashback - Tiles',
      name: 'subtitleVanityTiles',
      condition: {
        field: 'vanitySplashback',
        value: 'Tiled 100mm,Tiled 200mm,Tiled - other'
      }
    },
    { name: 'vanitySplashbackTilesPmNote', display: 'PM Notes', type: 'textarea', canHide: 'subtitleVanityTiles' },
    {
      name: 'mainVanityType',
      display: 'Tile Type',
      type: 'text-conditional',
      condition: {
        specVersion: '1.0',
        field: 'vanitySplashback',
        value: 'Tiled 100mm,Tiled 200mm,Tiled - other'
      },
      canHide: 'subtitleVanityTiles'
    },
    {
      name: 'mainVanityColour',
      display: 'Tile Colour',
      type: 'text-conditional',
      condition: {
        field: 'vanitySplashback',
        value: 'Tiled 100mm,Tiled 200mm,Tiled - other'
      },
      canHide: 'subtitleVanityTiles'
    },
    {
      name: 'mainVanityGrout',
      display: 'Grout Colour',
      type: 'text-conditional',
      condition: {
        field: 'vanitySplashback',
        value: 'Tiled 100mm,Tiled 200mm,Tiled - other'
      },
      canHide: 'subtitleVanityTiles'
    },
    {
      name: 'mainVanityLayout',
      display: 'Tile Layout',
      type: 'text-conditional',
      condition: {
        specVersion: '1.0',
        field: 'vanitySplashback',
        value: 'Tiled 100mm,Tiled 200mm,Tiled - other'
      },
      canHide: 'subtitleVanityTiles'
    },
    {
      name: 'mainVanityLayout',
      display: 'Tile Layout',
      type: 'dropdown',
      items: ['Stacked', 'Bricklayed', 'Other - Please specify'],
      condition: {
        specVersion: '2.01+',
        field: 'vanitySplashback',
        value: 'Tiled 100mm,Tiled 200mm,Tiled - other'
      },
      canHide: 'subtitleVanityTiles'
    },
    {
      name: 'vanityAdditionalInfo',
      display: 'Additional Info',
      type: 'textarea-conditional',
      condition: {
        field: 'vanitySplashback',
        value: 'Tiled 100mm,Tiled 200mm,Tiled - other'
      },
      canHide: 'subtitleVanityTiles'
    },

    /// BATH //////////////////////////////////////////////////////////////////

    { type: 'subtitle', text: 'Bath', name: 'bathSubTitle' },
    { name: 'bathPmNote', display: 'PM Notes', type: 'textarea', canHide: 'bathSubTitle' },
    { name: 'bath', display: 'Bath', items: bathImages, historyItems: bathHistoryImages, type: 'image-picker', canHide: 'bathSubTitle' },
    {
      name: 'bathSize',
      display: 'Bath Size',
      items: ['1500', '1700', 'Other - Please specify'],
      type: 'dropdown',
      canHide: 'bathSubTitle'
    },
    { name: 'bathMixer', display: 'Bath Mixer', items: bathMixerImages, type: 'image-picker', canHide: 'bathSubTitle' },
    { name: 'bathSpout', display: 'Bath Spout', items: bathSpoutImages, type: 'image-picker', canHide: 'bathSubTitle' },
    {
      name: 'bathMixerAndSpoutPlacement',
      display: 'Bath Mixer and Spout Placement',
      items: ['Centre (std)', 'RHS Back Wall', 'RHS Side Wall', 'LHS Back Wall', 'LHS Side Wall', 'Other - Please Specify'],
      type: 'dropdown',
      canHide: 'bathSubTitle'
    },
    {
      name: 'bathSurround',
      display: 'Bath Surround',
      items: ['Tiled (1 Row)', 'Tiled to underside window', 'Tiled - other', 'None', 'Other - Please Specify'],
      conditional: ['subtitleBathTiles', 'mainBathTile', 'mainBathColour', 'mainBathGrout', 'mainBathLayout'],
      type: 'dropdown',
      canHide: 'bathSubTitle'
    },
    {
      type: 'subtitle-conditional',
      text: 'Bath Surround - Tiles',
      name: 'subtitleBathTiles',
      condition: {
        field: 'bathSurround',
        value: 'Tiled (1 Row),Tiled to underside window,Tiled - other'
      }
    },
    {
      name: 'mainBathType',
      display: 'Tile Type',
      type: 'text-conditional',
      condition: {
        specVersion: '1.0',
        field: 'bathSurround',
        value: 'Tiled (1 Row),Tiled to underside window,Tiled - other'
      },
      canHide: 'subtitleBathTiles'
    },
    {
      name: 'mainBathColour',
      display: 'Tile Colour',
      type: 'text-conditional',
      condition: {
        field: 'bathSurround',
        value: 'Tiled (1 Row),Tiled to underside window,Tiled - other'
      },
      canHide: 'subtitleBathTiles'
    },
    {
      name: 'mainBathGrout',
      display: 'Grout Colour',
      type: 'text-conditional',
      condition: {
        field: 'bathSurround',
        value: 'Tiled (1 Row),Tiled to underside window,Tiled - other'
      },
      canHide: 'subtitleBathTiles'
    },
    {
      name: 'mainBathLayout',
      display: 'Tile Layout',
      type: 'text-conditional',
      condition: {
        specVersion: '1.0',
        field: 'bathSurround',
        value: 'Tiled (1 Row),Tiled to underside window,Tiled - other'
      },
      canHide: 'subtitleBathTiles'
    },
    {
      name: 'mainBathLayout',
      display: 'Tile Layout',
      type: 'dropdown',
      items: ['Stacked', 'Bricklayed', 'Other - Please specify'],
      condition: {
        specVersion: '2.01+',
        field: 'bathSurround',
        value: 'Tiled (1 Row),Tiled to underside window,Tiled - other'
      },
      canHide: 'subtitleBathTiles'
    },
    {
      name: 'bathSurroundTileAdditionalInfo',
      display: 'Additional Info',
      type: 'textarea-conditional',
      condition: {
        field: 'bathSurround',
        value: 'Tiled (1 Row),Tiled to underside window,Tiled - other'
      },
      canHide: 'subtitleBathTiles'
    },
    /// TOILET ///////////////////////////////////////
    { type: 'subtitle', text: 'Toilets', name: 'toiletsSubTitle' },
    { name: 'toiletsPmNote', display: 'PM Notes', type: 'textarea', canHide: 'toiletsSubTitle' },
    { name: 'toilet', display: 'Toilet', items: toiletImages, type: 'image-picker', canHide: 'toiletsSubTitle' },
    { type: 'subtitle', text: 'Hardware', name: 'hardwareSubTitle' },
    { name: 'hardwarePmNote', display: 'PM Notes', type: 'textarea', canHide: 'hardwareSubTitle' },
    { name: 'heatedTowelRail', display: 'Heated Towel Rail', items: towelRailImages, type: 'image-picker', canHide: 'hardwareSubTitle' },
    { name: 'toiletRollHolder', display: 'Toilet Roll Holder', items: toiletRollHolder, type: 'image-picker', canHide: 'hardwareSubTitle' },

    /// FLOORS ///////////////////////////////////////
    { type: 'subtitle', text: 'Floors', name: 'floorsSubTitle' },
    { name: 'floorsPmNote', display: 'PM Notes', type: 'textarea', canHide: 'floorsSubTitle' },
    {
      name: 'floorType',
      display: 'Floor Type',
      items: ['Tiled', 'Vinyl', 'Other - Please Specify'],
      type: 'dropdown',
      conditonal: ['subtitleFloorTiles', 'mainFloorType', 'mainFloorColour', 'mainFloorGrout', 'mainFloorLayout'],
      canHide: 'floorsSubTitle'
    },
    {
      name: 'skirting',
      display: 'Skirting',
      items: ['Tiled', 'Timber', 'Other - Please Specify'],
      type: 'dropdown',
      canHide: 'floorsSubTitle'
    },
    {
      name: 'skirtingColour',
      display: 'Skirting Colour',
      type: 'text',
      canHide: 'floorsSubTitle'
    },
    {
      type: 'subtitle-conditional',
      text: 'Floor - Tiles',
      name: 'subtitleFloorTiles',
      condition: {
        field: 'floorType',
        value: 'Tiled'
      }
    },
    { name: 'floorTilesPmNote', display: 'PM Notes', type: 'textarea', canHide: 'subtitleFloorTiles' },
    {
      name: 'mainFloorType',
      display: 'Tile Type',
      type: 'text-conditional',
      condition: {
        specVersion: '1.0',
        field: 'floorType',
        value: 'Tiled'
      },
      canHide: 'subtitleFloorTiles'
    },
    {
      name: 'mainFloorColour',
      display: 'Tile Colour',
      type: 'text-conditional',
      condition: {
        field: 'floorType',
        value: 'Tiled'
      },
      canHide: 'subtitleFloorTiles'
    },
    {
      name: 'mainFloorGrout',
      display: 'Grout Colour',
      type: 'text-conditional',
      condition: {
        field: 'floorType',
        value: 'Tiled'
      },
      canHide: 'subtitleFloorTiles'
    },
    {
      name: 'mainFloorLayout',
      display: 'Tile Layout',
      type: 'text-conditional',
      condition: {
        specVersion: '1.0',
        field: 'floorType',
        value: 'Tiled'
      },
      canHide: 'subtitleFloorTiles'
    },
    {
      name: 'mainFloorLayout',
      display: 'Tile Layout',
      type: 'dropdown',
      items: ['Stacked', 'Bricklayed', 'Other - Please specify'],
      condition: {
        specVersion: '2.01+',
        field: 'floorType',
        value: 'Tiled'
      },
      canHide: 'subtitleFloorTiles'
    },
    {
      name: 'floorAdditionalInfo',
      display: 'Additional Info',
      type: 'textarea-conditional',
      condition: {
        field: 'floorType',
        value: 'Tiled'
      },
      canHide: 'subtitleFloorTiles'
    }
  ]
};
export default mainBathroomConfig;
