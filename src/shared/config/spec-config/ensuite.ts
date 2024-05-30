import {
  ensuiteMouldWallImages,
  ensuiteShowerImages,
  ensuiteShowerMixerImages,
  ensuiteToiletImages,
  ensuiteToiletRollHolderImages,
  ensuiteTowelRailImages,
  ensuiteVanityColourImages,
  ensuiteVanityImages,
  ensuiteVanityMixerImages,
  historyShowerMixerImages,
  historyVanityColourImages
} from './images';

export const ensuiteConfig = {
  id: 15,
  name: 'ensuite',
  title: 'Ensuite',
  canDuplicate: true,
  canHide: true,
  hasExtras: true,
  groupBySubtitle: true,
  fields: [
    { name: 'ensuitePmNote', display: 'PM Notes', type: 'textarea' },
    { type: 'subtitle', text: 'Shower', name: 'showerSubTitle' },
    { name: 'showerPmNote', display: 'PM Notes', type: 'textarea', canHide: 'showerSubTitle' },
    {
      name: 'shower',
      display: 'Shower',
      items: ensuiteShowerImages,
      type: 'image-picker',
      conditional: [
        'glassDoor',
        'trim',
        'mouldedWall',
        'tiledShelf',
        'tileLayoutShower',
        'groutColourShower',
        'tileColour2',
        'tileColour1',
        'tileTypeShower',
        'numberMixers',
        'showerFrame'
      ],
      canHide: 'showerSubTitle'
    },
    {
      name: 'mouldedWall',
      display: 'Moulded Wall',
      items: ensuiteMouldWallImages,
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
      items: ensuiteShowerMixerImages,
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

    // SHOWER TILES ////////////////////////////////////////////////////////////
    {
      type: 'subtitle-conditional',
      text: 'Shower - Tiles',
      name: 'showerTilesSubTitle',
      condition: {
        field: 'shower',
        value: 'tiledAsPerPlan'
      }
    },
    { name: 'showerTilesPmNote', display: 'PM Notes', type: 'textarea', canHide: 'showerTilesSubTitle' },
    {
      name: 'ensuiteShowerTile',
      display: 'Tile Type',
      type: 'text-conditional',
      condition: {
        specVersion: '1.0',
        field: 'shower',
        value: 'tiledAsPerPlan'
      },
      canHide: 'showerTilesSubTitle'
    },
    {
      name: 'ensuiteShowerColour1',
      display: 'Tile Colour 1',
      type: 'text-conditional',
      condition: {
        specVersion: '1.0',
        field: 'shower',
        value: 'tiledAsPerPlan'
      },
      canHide: 'showerTilesSubTitle'
    },
    {
      name: 'ensuiteShowerColour2',
      display: 'Tile Colour 2',
      type: 'text-conditional',
      condition: {
        specVersion: '1.0',
        field: 'shower',
        value: 'tiledAsPerPlan'
      },
      canHide: 'showerTilesSubTitle'
    },
    {
      name: 'ensuiteShowerGrout',
      display: 'Grout Colour',
      type: 'text-conditional',
      condition: {
        specVersion: '1.0',
        field: 'shower',
        value: 'tiledAsPerPlan'
      },
      canHide: 'showerTilesSubTitle'
    },
    {
      name: 'ensuiteShowerLayout',
      display: 'Tile Layout',
      type: 'text-conditional',
      condition: {
        specVersion: '1.0',
        field: 'shower',
        value: 'tiledAsPerPlan'
      },
      canHide: 'showerTilesSubTitle'
    },
    {
      name: 'ensuiteShowerFloor',
      display: 'Floor Tile',
      items: ['Stack bond (STD)', 'Hearing Bone, Stretch, Mosaic, ETC. (POA)', 'None', 'Other - Please Specify'],
      type: 'dropdown',
      condition: {
        specVersion: '1.0',
        field: 'shower',
        value: 'tiledAsPerPlan'
      },
      canHide: 'showerTilesSubTitle'
    },
    {
      name: 'ensuiteShowerWall',
      display: 'Wall Tile',
      items: ['Stack bond (STD)', 'Hearing Bone, Stretch, Mosaic, ETC. (POA)', 'None', 'Other - Please Specify'],
      type: 'dropdown',
      condition: {
        specVersion: '1.0',
        field: 'shower',
        value: 'tiledAsPerPlan'
      },
      canHide: 'showerTilesSubTitle'
    },
    {
      name: 'ensuiteWallTileColour',
      display: 'Wall Tile Colour',
      type: 'text-conditional',
      condition: { specVersion: '2.01+', field: 'shower', value: 'tiledAsPerPlan' },
      canHide: 'showerTilesSubTitle'
    },
    {
      name: 'ensuiteWallGroutColour',
      display: 'Wall Grout Colour',
      type: 'text-conditional',
      condition: { specVersion: '2.01+', field: 'shower', value: 'tiledAsPerPlan' },
      canHide: 'showerTilesSubTitle'
    },
    {
      name: 'ensuiteWallTileLayout',
      display: 'Wall Tile Layout',
      type: 'dropdown',
      items: ['Stacked', 'Bricklayed', 'Other - Please specify'],
      condition: { specVersion: '2.01+', field: 'shower', value: 'tiledAsPerPlan' },
      canHide: 'showerTilesSubTitle'
    },
    {
      name: 'ensuiteFloorTileColour',
      display: 'Floor Tile Colour',
      type: 'text-conditional',
      condition: { specVersion: '2.01+', field: 'shower', value: 'tiledAsPerPlan' },
      canHide: 'showerTilesSubTitle'
    },
    {
      name: 'ensuiteFloorGroutColour',
      display: 'Floor Grout Colour',
      type: 'text-conditional',
      condition: { specVersion: '2.01+', field: 'shower', value: 'tiledAsPerPlan' },
      canHide: 'showerTilesSubTitle'
    },
    {
      name: 'ensuiteFloorTileLayout',
      display: 'Floor Tile Layout',
      type: 'dropdown',
      items: ['Stacked', 'Bricklayed', 'Other - Please specify'],
      condition: { specVersion: '2.01+', field: 'shower', value: 'tiledAsPerPlan' },
      canHide: 'showerTilesSubTitle'
    },
    {
      name: 'ensuiteShowerInfo',
      display: 'Additional Info',
      type: 'textarea-conditional',
      condition: {
        field: 'shower',
        value: 'tiledAsPerPlan'
      },
      canHide: 'showerTilesSubTitle'
    },
    /// VANITY //////////////////////////////////////
    { type: 'subtitle', text: 'Vanity', name: 'vanitySubTitle' },
    { name: 'vanityPmNote', display: 'PM Notes', type: 'textarea', canHide: 'vanitySubTitle' },
    { name: 'vanity', display: 'Vanity', items: ensuiteVanityImages, type: 'image-picker', canHide: 'vanitySubTitle' },
    {
      name: 'vanityColour',
      display: 'Vanity Colour',
      items: ensuiteVanityColourImages,
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
    {
      name: 'vanityMixer',
      display: 'Vanity Mixer',
      type: 'image-picker',
      items: ensuiteVanityMixerImages
    },
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
      items: ['TBC', 'Tiled 100mm', 'Tiled 200mm', 'Tiled - other', 'Mirror', 'None', 'Other - Please Specify'],
      type: 'dropdown',
      canHide: 'vanitySubTitle'
    },
    { name: 'slashbackColour', display: 'Splashback Colour', type: 'text', canHide: 'vanitySubTitle' },

    // VANITY TILES ////////////////////////////////////////////////////////////
    {
      type: 'subtitle-conditional',
      text: 'Vanity Tiles',
      name: 'vanityTilesSubTitle',
      condition: {
        field: 'vanitySplashback',
        value: 'Match Bath Height,Tiled 100mm,Tiled 200mm,Tiled - other'
      }
    },
    { name: 'vanityTilesPmNote', display: 'PM Notes', type: 'textarea', canHide: 'vanityTilesSubTitle' },
    {
      name: 'ensuiteVanityType',
      display: 'Tile Type',
      type: 'text-conditional',
      condition: {
        specVersion: '1.0',
        field: 'vanitySplashback',
        value: 'Match Bath Height,Tiled 100mm,Tiled 200mm,Tiled - other'
      },
      canHide: 'vanityTilesSubTitle'
    },
    {
      name: 'ensuiteVanityColour',
      display: 'Tile Colour',
      type: 'text-conditional',
      condition: {
        field: 'vanitySplashback',
        value: 'Match Bath Height,Tiled 100mm,Tiled 200mm,Tiled - other'
      },
      canHide: 'vanityTilesSubTitle'
    },
    {
      name: 'ensuiteVanityGrout',
      display: 'Grout Colour',
      type: 'text-conditional',
      condition: {
        field: 'vanitySplashback',
        value: 'Match Bath Height,Tiled 100mm,Tiled 200mm,Tiled - other'
      },
      canHide: 'vanityTilesSubTitle'
    },
    {
      name: 'ensuiteVanityLayout',
      display: 'Tile Layout',
      type: 'dropdown',
      items: ['Stacked', 'Bricklayed', 'Other - Please specify'],
      condition: {
        field: 'vanitySplashback',
        value: 'Match Bath Height,Tiled 100mm,Tiled 200mm,Tiled - other'
      },
      canHide: 'vanityTilesSubTitle'
    },
    {
      name: 'ensuiteVanityInfo',
      display: 'Additional Info',
      type: 'textarea-conditional',
      condition: {
        field: 'vanitySplashback',
        value: 'Match Bath Height,Tiled 100mm,Tiled 200mm,Tiled - other'
      },
      canHide: 'vanityTilesSubTitle'
    },

    // TOILET ////////////////////////////////////////////////////////////

    { type: 'subtitle', text: 'Toilets', name: 'toilersSubTitle' },
    { name: 'toiletsPmNote', display: 'PM Notes', type: 'textarea', canHide: 'toilersSubTitle' },
    { name: 'toilet', display: 'Toilet', items: ensuiteToiletImages, type: 'image-picker', canHide: 'toilersSubTitle' },
    { type: 'subtitle', text: 'Hardware', name: 'hardwareSubTitle' },
    { name: 'hardwarePmNote', display: 'PM Notes', type: 'textarea', canHide: 'hardwareSubTitle' },
    {
      name: 'heatedTowelRail',
      display: 'Heated Towel Rail',
      items: ensuiteTowelRailImages,
      type: 'image-picker',
      canHide: 'hardwareSubTitle'
    },
    {
      name: 'toiletRollHolder',
      display: 'Toilet Roll Holder',
      items: ensuiteToiletRollHolderImages,
      type: 'image-picker',
      canHide: 'hardwareSubTitle'
    },

    // FLOOR //////////////////////////////////////////
    { type: 'subtitle', text: 'Floors', name: 'floorsSubTitle' },
    { name: 'floorsPmNote', display: 'PM Notes', type: 'textarea', canHide: 'floorsSubTitle' },
    {
      name: 'floorType',
      display: 'Floor Type',
      items: ['Tiled', 'Vinyl', 'Other - Please Specify'],
      type: 'dropdown',
      conditonal: ['tileTypeSkirting', 'tileColourSkirting', 'tileGroutSkirting', 'tileLayoutSkirting'],
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

    // FLOOR TILES //////////////////////////////////////////////////////////////////////////
    {
      type: 'subtitle-conditional',
      text: 'Floor Tiles',
      name: 'floorTilesSubTitle',
      condition: {
        field: 'floorType',
        value: 'Tiled'
      }
    },
    { name: 'floorTilesPmNote', display: 'PM Notes', type: 'textarea', canHide: 'floorTilesSubTitle' },
    {
      name: 'ensuiteFloorType',
      display: 'Tile Type',
      type: 'text-conditional',
      condition: {
        specVersion: '1.0',
        field: 'floorType',
        value: 'Tiled'
      },
      canHide: 'floorTilesSubTitle'
    },
    {
      name: 'ensuiteFloorColour',
      display: 'Tile Colour',
      type: 'text-conditional',
      condition: {
        field: 'floorType',
        value: 'Tiled'
      },
      canHide: 'floorTilesSubTitle'
    },
    {
      name: 'ensuiteFloorGrout',
      display: 'Grout Colour',
      type: 'text-conditional',
      condition: {
        field: 'floorType',
        value: 'Tiled'
      },
      canHide: 'floorTilesSubTitle'
    },
    {
      name: 'ensuiteFloorLayout',
      display: 'Tile Layout',
      type: 'text-conditional',
      condition: {
        specVersion: '1.0',
        field: 'floorType',
        value: 'Tiled'
      },
      canHide: 'floorTilesSubTitle'
    },
    {
      name: 'ensuiteFloorLayout',
      display: 'Tile Layout',
      type: 'dropdown',
      items: ['Stacked', 'Bricklayed', 'Other - Please specify'],
      condition: {
        specVersion: '2.01+',
        field: 'floorType',
        value: 'Tiled'
      },
      canHide: 'floorTilesSubTitle'
    },

    {
      name: 'ensuiteFloorInfo',
      display: 'Additional Info',
      type: 'textarea-conditional',
      condition: {
        field: 'floorType',
        value: 'Tiled'
      },
      canHide: 'floorTilesSubTitle'
    }
  ]
};
