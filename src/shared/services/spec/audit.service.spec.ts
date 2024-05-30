import { getAuditList, getGroupName, getInitialAudit, getNextChangeId, getSectionName, removeBlockAndUpdateOrder } from './audit.service';

const beforeChange = {
  'cladding-additional': {
    'cladding-additional-0': {
      claddingType: [
        { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Brick' }
      ]
    }
  },
  details: {
    client: [{ date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'rich' }],
    status: [{ date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Quote' }],
    subdivision: [
      { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'rich' }
    ],
    scheme: [
      { value: 'scheme 1', user: 'rich@blacksandsolutions.co', date: '2020-06-25T23:40:14.076Z' },
      { value: 'scheme 2', user: 'rich@blacksandsolutions.co', date: '2020-06-25T23:41:28.795Z' }
    ]
  },
  'flooring-additional': {
    'flooring-additional-0': {
      floorTypes: [
        { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Carpet' },
        { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Tiles' }
      ]
    }
  },
  section_details: {
    lot: [
      { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'rich new 2' }
    ]
  },
  quote: {
    paymentMethod: [
      {
        date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)',
        user: 'rich@blacksandsolutions.co',
        value: 'Turnkey Payment method'
      }
    ]
  }
};

describe('Auditing - Helpers', function() {
  it(`getGroupName returns '' for non additional section`, function() {
    expect(getGroupName('details')).toEqual('');
  });
  it(`getGroupName returns correct name for additional section`, function() {
    expect(getGroupName('cladding-additional^0')).toEqual('cladding-additional-0');
  });
  it(`getSectionName returns original name for non additional section`, function() {
    expect(getSectionName('details')).toEqual('details');
  });
  it(`getSectionName returns correct name for additional section`, function() {
    expect(getSectionName('cladding-additional^0')).toEqual('cladding-additional');
  });
  it(`getNextChangeId returns 0 when normal section with no changes`, function() {
    expect(getNextChangeId(beforeChange, 'garage', '', 'garageDoor')).toEqual(0);
  });
  it(`getNextChangeId returns 1 when normal section with one change`, function() {
    expect(getNextChangeId(beforeChange, 'section_details', '', 'lot')).toEqual(1);
  });
  it(`getNextChangeId returns 0 when additional section with no changes`, function() {
    expect(getNextChangeId(beforeChange, 'blinds-additional', 'blinds-additional-0', 'blinds')).toEqual(0);
  });
  it(`getNextChangeId returns 1 when additional section with one changes`, function() {
    expect(getNextChangeId(beforeChange, 'cladding-additional', 'cladding-additional-0', 'claddingType')).toEqual(1);
  });
  it(`getNextChangeId returns 2 when additional section with two changes`, function() {
    expect(getNextChangeId(beforeChange, 'flooring-additional', 'flooring-additional-0', 'floorTypes')).toEqual(2);
  });
});

describe('Auditing - initial Audit', function() {
  it('It creates correct initial audit for date and users', function() {
    const user = 'rich';
    const date = Date();
    const clientDetails = {
      client: 'Giggsy',
      subdivision: 'Old Trafford',
      lot: 'MUFC'
    };

    const result = getInitialAudit(clientDetails, date, user);

    // NOTE additionals are saved under their own section, not under their parent.
    // E.g cladding-additional is not under cladding

    const expected = {
      'cladding-additional': {
        'cladding-additional-0': {
          claddingType: [{ date, user, value: 'Brick' }]
        }
      },
      details: {
        client: [{ date, user, value: clientDetails.client }],
        status: [{ date, user, value: 'Quote' }],
        subdivision: [{ date, user, value: clientDetails.subdivision }]
      },
      'flooring-additional': {
        'flooring-additional-0': {
          floorTypes: [{ date, user, value: 'Carpet' }]
        }
      },
      section_details: {
        lot: [{ date, user, value: clientDetails.lot }]
      },
      quote: {
        paymentMethod: [{ date, user, value: 'Turnkey Payment method' }]
      }
    };

    expect(result).toEqual(expected);
  });
});

describe('Auditing - Local Audit', function() {
  it('It updates local audit correctly when a field changed, and section already has audit change', function() {
    const sectionName = 'details';
    const fieldName = 'scheme';
    const groupName = '';
    const user = 'rich@blacksandsolutions.co';
    const date = '2020-06-26T00:21:47.761Z';
    const change = {
      user,
      date,
      value: 'scheme 3'
    };

    const afterChange = getAuditList(beforeChange, sectionName, fieldName, change, groupName);

    const expected = {
      'cladding-additional': {
        'cladding-additional-0': {
          claddingType: [
            { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Brick' }
          ]
        }
      },
      details: {
        client: [
          { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'rich' }
        ],
        status: [
          { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Quote' }
        ],
        subdivision: [
          { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'rich' }
        ],
        scheme: [
          { value: 'scheme 1', user: 'rich@blacksandsolutions.co', date: '2020-06-25T23:40:14.076Z' },
          { value: 'scheme 2', user: 'rich@blacksandsolutions.co', date: '2020-06-25T23:41:28.795Z' },
          { value: 'scheme 3', user: 'rich@blacksandsolutions.co', date: '2020-06-26T00:21:47.761Z' }
        ]
      },
      'flooring-additional': {
        'flooring-additional-0': {
          floorTypes: [
            { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Carpet' },
            { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Tiles' }
          ]
        }
      },
      section_details: {
        lot: [
          { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'rich new 2' }
        ]
      },
      quote: {
        paymentMethod: [
          {
            date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)',
            user: 'rich@blacksandsolutions.co',
            value: 'Turnkey Payment method'
          }
        ]
      }
    };

    expect(afterChange).toEqual(expected);
  });

  it('It updates local audit correctly when a field changed, and section does not yet have any audit change', function() {
    const sectionName = 'section_details';
    const fieldName = 'sectionSize';
    const groupName = '';
    const user = 'rich@blacksandsolutions.co';
    const date = '2020-06-26T00:21:47.761Z';
    const change = {
      user,
      date,
      value: '1000'
    };

    const afterChange = getAuditList(beforeChange, sectionName, fieldName, change, groupName);

    const expected = {
      'cladding-additional': {
        'cladding-additional-0': {
          claddingType: [
            { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Brick' }
          ]
        }
      },
      details: {
        client: [
          { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'rich' }
        ],
        status: [
          { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Quote' }
        ],
        subdivision: [
          { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'rich' }
        ],
        scheme: [
          { value: 'scheme 1', user: 'rich@blacksandsolutions.co', date: '2020-06-25T23:40:14.076Z' },
          { value: 'scheme 2', user: 'rich@blacksandsolutions.co', date: '2020-06-25T23:41:28.795Z' }
        ]
      },
      'flooring-additional': {
        'flooring-additional-0': {
          floorTypes: [
            { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Carpet' },
            { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Tiles' }
          ]
        }
      },
      section_details: {
        lot: [
          { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'rich new 2' }
        ],
        sectionSize: [{ date: '2020-06-26T00:21:47.761Z', user: 'rich@blacksandsolutions.co', value: '1000' }]
      },
      quote: {
        paymentMethod: [
          {
            date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)',
            user: 'rich@blacksandsolutions.co',
            value: 'Turnkey Payment method'
          }
        ]
      }
    };

    expect(afterChange).toEqual(expected);
  });

  it('It updates local audit correctly when a field changed, and section has audit, but field does not', function() {
    const sectionName = 'garage';
    const fieldName = 'garageDoor';
    const groupName = '';
    const user = 'rich@blacksandsolutions.co';
    const date = '2020-06-26T00:21:47.761Z';
    const change = {
      user,
      date,
      value: 'Maxima'
    };

    const afterChange = getAuditList(beforeChange, sectionName, fieldName, change, groupName);

    const expected = {
      'cladding-additional': {
        'cladding-additional-0': {
          claddingType: [
            { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Brick' }
          ]
        }
      },
      details: {
        client: [
          { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'rich' }
        ],
        status: [
          { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Quote' }
        ],
        subdivision: [
          { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'rich' }
        ],
        scheme: [
          { value: 'scheme 1', user: 'rich@blacksandsolutions.co', date: '2020-06-25T23:40:14.076Z' },
          { value: 'scheme 2', user: 'rich@blacksandsolutions.co', date: '2020-06-25T23:41:28.795Z' }
        ]
      },
      'flooring-additional': {
        'flooring-additional-0': {
          floorTypes: [
            { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Carpet' },
            { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Tiles' }
          ]
        }
      },
      garage: {
        garageDoor: [{ date: '2020-06-26T00:21:47.761Z', user: 'rich@blacksandsolutions.co', value: 'Maxima' }]
      },
      section_details: {
        lot: [
          { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'rich new 2' }
        ]
      },
      quote: {
        paymentMethod: [
          {
            date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)',
            user: 'rich@blacksandsolutions.co',
            value: 'Turnkey Payment method'
          }
        ]
      }
    };

    expect(afterChange).toEqual(expected);
  });

  it('It updates local audit correctly when a block field changed and audit already exists for section and field', function() {
    const sectionName = 'cladding-additional';
    const groupName = 'cladding-additional-0';
    const fieldName = 'claddingType';
    const user = 'rich@blacksandsolutions.co';
    const date = '2020-06-26T00:21:47.761Z';
    const change = {
      user,
      date,
      value: 'Bagged Brick'
    };

    const afterChange = getAuditList(beforeChange, sectionName, fieldName, change, groupName);

    const expected = {
      'cladding-additional': {
        'cladding-additional-0': {
          claddingType: [
            { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Brick' },
            { date: '2020-06-26T00:21:47.761Z', user: 'rich@blacksandsolutions.co', value: 'Bagged Brick' }
          ]
        }
      },
      details: {
        client: [
          { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'rich' }
        ],
        status: [
          { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Quote' }
        ],
        subdivision: [
          { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'rich' }
        ],
        scheme: [
          { value: 'scheme 1', user: 'rich@blacksandsolutions.co', date: '2020-06-25T23:40:14.076Z' },
          { value: 'scheme 2', user: 'rich@blacksandsolutions.co', date: '2020-06-25T23:41:28.795Z' }
        ]
      },
      'flooring-additional': {
        'flooring-additional-0': {
          floorTypes: [
            { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Carpet' },
            { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Tiles' }
          ]
        }
      },
      section_details: {
        lot: [
          { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'rich new 2' }
        ]
      },
      quote: {
        paymentMethod: [
          {
            date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)',
            user: 'rich@blacksandsolutions.co',
            value: 'Turnkey Payment method'
          }
        ]
      }
    };

    expect(afterChange).toEqual(expected);
  });

  it('It updates local audit correctly when a block field changed and audit already exists for section only', function() {
    const sectionName = 'cladding-additional';
    const groupName = 'cladding-additional-0';
    const fieldName = 'area';
    const user = 'rich@blacksandsolutions.co';
    const date = '2020-06-26T00:21:47.761Z';
    const change = {
      user,
      date,
      value: '100'
    };

    const afterChange = getAuditList(beforeChange, sectionName, fieldName, change, groupName);

    const expected = {
      'cladding-additional': {
        'cladding-additional-0': {
          claddingType: [
            { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Brick' }
          ],
          area: [{ date: '2020-06-26T00:21:47.761Z', user: 'rich@blacksandsolutions.co', value: '100' }]
        }
      },
      details: {
        client: [
          { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'rich' }
        ],
        status: [
          { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Quote' }
        ],
        subdivision: [
          { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'rich' }
        ],
        scheme: [
          { value: 'scheme 1', user: 'rich@blacksandsolutions.co', date: '2020-06-25T23:40:14.076Z' },
          { value: 'scheme 2', user: 'rich@blacksandsolutions.co', date: '2020-06-25T23:41:28.795Z' }
        ]
      },
      'flooring-additional': {
        'flooring-additional-0': {
          floorTypes: [
            { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Carpet' },
            { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Tiles' }
          ]
        }
      },
      section_details: {
        lot: [
          { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'rich new 2' }
        ]
      },
      quote: {
        paymentMethod: [
          {
            date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)',
            user: 'rich@blacksandsolutions.co',
            value: 'Turnkey Payment method'
          }
        ]
      }
    };

    expect(afterChange).toEqual(expected);
  });

  it('It updates local audit correctly when a block field changed and audit does not exist', function() {
    const sectionName = 'blinds-additional';
    const groupName = 'blinds-additional-0';
    const fieldName = 'blinds';
    const user = 'rich@blacksandsolutions.co';
    const date = '2020-06-26T00:21:47.761Z';
    const change = {
      user,
      date,
      value: 'Venetian'
    };

    const afterChange = getAuditList(beforeChange, sectionName, fieldName, change, groupName);

    const expected = {
      'blinds-additional': {
        'blinds-additional-0': {
          blinds: [{ date: '2020-06-26T00:21:47.761Z', user: 'rich@blacksandsolutions.co', value: 'Venetian' }]
        }
      },
      'cladding-additional': {
        'cladding-additional-0': {
          claddingType: [
            { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Brick' }
          ]
        }
      },
      details: {
        client: [
          { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'rich' }
        ],
        status: [
          { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Quote' }
        ],
        subdivision: [
          { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'rich' }
        ],
        scheme: [
          { value: 'scheme 1', user: 'rich@blacksandsolutions.co', date: '2020-06-25T23:40:14.076Z' },
          { value: 'scheme 2', user: 'rich@blacksandsolutions.co', date: '2020-06-25T23:41:28.795Z' }
        ]
      },
      'flooring-additional': {
        'flooring-additional-0': {
          floorTypes: [
            { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Carpet' },
            { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Tiles' }
          ]
        }
      },
      section_details: {
        lot: [
          { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'rich new 2' }
        ]
      },
      quote: {
        paymentMethod: [
          {
            date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)',
            user: 'rich@blacksandsolutions.co',
            value: 'Turnkey Payment method'
          }
        ]
      }
    };

    expect(afterChange).toEqual(expected);
  });
});

describe('Auditing - removing blocks', function() {
  it('It removes block and updates indexes correctly, when removing block from end of list ', function() {
    const beforeChange = {
      'cladding-additional': {
        'cladding-additional-0': {
          claddingType: [
            { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Brick' }
          ]
        },
        'cladding-additional-1': {
          claddingType: [
            { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Brick' }
          ]
        },
        'cladding-additional-2': {
          claddingType: [
            { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Brick' }
          ]
        }
      }
    };

    const result = removeBlockAndUpdateOrder(beforeChange, 'cladding-additional', 'cladding-additional-2');

    const expected = {
      'cladding-additional': {
        'cladding-additional-0': {
          claddingType: [
            { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Brick' }
          ]
        },
        'cladding-additional-1': {
          claddingType: [
            { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Brick' }
          ]
        }
      }
    };

    expect(result).toEqual(expected);
  });

  it('It removes block and updates indexes correctly, when removing block from start of list', function() {
    const beforeChange = {
      'cladding-additional': {
        'cladding-additional-0': {
          claddingType: [
            { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Brick' }
          ]
        },
        'cladding-additional-1': {
          claddingType: [
            { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Brick' }
          ]
        },
        'cladding-additional-2': {
          claddingType: [
            { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Brick' }
          ]
        }
      }
    };

    const result = removeBlockAndUpdateOrder(beforeChange, 'cladding-additional', 'cladding-additional-0');

    const expected = {
      'cladding-additional': {
        'cladding-additional-0': {
          claddingType: [
            { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Brick' }
          ]
        },
        'cladding-additional-1': {
          claddingType: [
            { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Brick' }
          ]
        }
      }
    };

    expect(result).toEqual(expected);
  });

  xit('It removes block and restores default, when LAST block removed from list', function() {
    // This ensures tha audit is in the state we started with when client created
    const beforeChange = {
      'cladding-additional': {
        'cladding-additional-0': {
          claddingType: [
            {
              date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)',
              user: 'rich@blacksandsolutions.co',
              value: 'Bagged Brick'
            }
          ],
          area: [
            { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: '100' }
          ]
        }
      }
    };

    const result = removeBlockAndUpdateOrder(beforeChange, 'cladding-additional', 'cladding-additional-0');

    const expected = {
      'cladding-additional': {
        'cladding-additional-0': {
          claddingType: [
            { date: 'Fri Jun 26 2020 11:39:31 GMT+1200 (New Zealand Standard Time)', user: 'rich@blacksandsolutions.co', value: 'Brick' }
          ]
        }
      }
    };

    expect(result).toEqual(expected);
  });
});
