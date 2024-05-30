import { handBasinImages, historyToiletFinishesImages, separateToiletImages, toiletMelamineFinishesImages } from './images';

export const toiletConfig = {
  id: 14,
  name: 'toilet',
  title: 'Separate Toilet',
  canDuplicate: true,
  canHide: true,
  hasExtras: true,
  fields: [
    { name: 'toiletPmNote', display: 'PM Notes', type: 'textarea' },
    { type: 'subtitle', text: '' } /* to create a group for the items below */,
    { name: 'toilet', display: 'Toilet', items: separateToiletImages, type: 'image-picker' },
    { name: 'handbasin', display: 'Hand Basin', items: handBasinImages, type: 'image-picker' },
    {
      type: 'image-picker',
      display: 'Melamine Finishes',
      condition: {
        field: 'handbasin',
        value: 'melamineWoodgrain400'
      },
      items: toiletMelamineFinishesImages,
      historyItems: historyToiletFinishesImages
    },
    {
      name: 'splashback',
      display: 'Vanity Splashback',
      items: ['Tiled 100mm', 'Tiled 200mm', 'Tiled - other', 'Mirror', 'None', 'Other - Please Specify'],
      conditional: ['toiletVanityColour', 'toiletVanityGrout', 'toiletVanityLayout', ''],
      type: 'dropdown'
    },
    {
      name: 'splashbackColour',
      display: 'Splashback Colour',
      type: 'text',
      canHide: 'vanitySplashbackTiles'
    },
    /// SPLASHBACK TILES ////////////////////////////
    {
      type: 'subtitle-conditional',
      text: 'Vanity - Splashback Tiles',
      name: 'vanitySplashbackTiles',
      condition: {
        field: 'splashback',
        value: 'Tiled,Tiled 100mm,Tiled 200mm,Tiled - other'
      }
    },
    { name: 'vanitySplashbackTilesPmNote', display: 'PM Notes', type: 'textarea', canHide: 'vanitySplashbackTiles' },
    {
      name: 'toiletVanityType',
      display: 'Tile Type',
      type: 'text-conditional',
      condition: {
        specVersion: '1.0',
        field: 'splashback',
        value: 'Tiled,Tiled 100mm,Tiled 200mm,Tiled - other'
      },
      canHide: 'vanitySplashbackTiles'
    },
    {
      name: 'toiletVanityColour',
      display: 'Tile Colour',
      type: 'text-conditional',
      condition: {
        field: 'splashback',
        value: 'Tiled,Tiled 100mm,Tiled 200mm,Tiled - other'
      },
      canHide: 'vanitySplashbackTiles'
    },
    {
      name: 'toiletVanityGrout',
      display: 'Grout Colour',
      type: 'text-conditional',
      condition: {
        field: 'splashback',
        value: 'Tiled,Tiled 100mm,Tiled 200mm,Tiled - other'
      },
      canHide: 'vanitySplashbackTiles'
    },
    {
      name: 'toiletVanityLayout',
      display: 'Tile Layout',
      type: 'text-conditional',
      condition: {
        specVersion: '1.0',
        field: 'splashback',
        value: 'Tiled,Tiled 100mm,Tiled 200mm,Tiled - other'
      },
      canHide: 'vanitySplashbackTiles'
    },
    {
      name: 'toiletVanityLayout',
      display: 'Tile Layout',
      type: 'dropdown',
      items: ['Stacked', 'Bricklayed', 'Other - Please specify'],
      condition: {
        specVersion: '2.01+',
        field: 'splashback',
        value: 'Tiled,Tiled 100mm,Tiled 200mm,Tiled - other'
      },
      canHide: 'vanitySplashbackTiles'
    },
    {
      name: 'toiletVanityInfo',
      display: 'Additional Info',
      type: 'textarea-conditional',
      condition: {
        field: 'splashback',
        value: 'Tiled,Tiled 100mm,Tiled 200mm,Tiled - other'
      },
      canHide: 'vanitySplashbackTiles'
    },
    { text: 'Floors', type: 'subtitle', name: 'floorsSubTitle' },
    { name: 'floorsPmNote', display: 'PM Notes', type: 'textarea', canHide: 'floorsSubTitle' },
    /// FLOOR ////////////////////////////
    {
      name: 'floorType',
      display: 'Floor Type',
      items: ['Vinyl', 'Tiled', 'Other - Please Specify'],
      type: 'dropdown',
      conditonal: [
        'subtitleFloorTiles',
        'toiletFloorType',
        'toiletFloorColour',
        'toiletFloorGrout',
        'toiletFloorLayout',
        'toiletFloorInfo'
      ],
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
    /// FLOOR TILES ////////////////////////////
    {
      type: 'subtitle-conditional',
      name: 'subtitleFloorTiles',
      text: 'Floor - Tiles',
      condition: {
        field: 'floorType',
        value: 'Tiled'
      }
    },
    { name: 'floorTilesPmNote', display: 'PM Notes', type: 'textarea', canHide: 'subtitleFloorTiles' },
    {
      name: 'toiletFloorType',
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
      name: 'toiletFloorColour',
      display: 'Tile Colour',
      type: 'text-conditional',
      condition: {
        field: 'floorType',
        value: 'Tiled'
      },
      canHide: 'subtitleFloorTiles'
    },
    {
      name: 'toiletFloorGrout',
      display: 'Grout Colour',
      type: 'text-conditional',
      condition: {
        field: 'floorType',
        value: 'Tiled'
      },
      canHide: 'subtitleFloorTiles'
    },
    {
      name: 'toiletFloorLayout',
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
      name: 'toiletFloorLayout',
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
      name: 'toiletFloorInfo',
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
