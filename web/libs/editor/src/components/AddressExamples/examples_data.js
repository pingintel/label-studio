export default [
  {
    title: "Multiple addresses",
    input: {
      CITY: "Charlotte",
      ST: "NC",
      "STREET ADDRESS": "7124 Wallace Road (7120, 7124, 7128 & 7132)",
      "ZIP CODE": "28203"
    },
    output: [
      {
        street: "7124 Wallace Road",
        city: "Charlotte",
        state: "NC",
        zip: "28203"
      },
      {
        street: "7120 Wallace Road",
        city: "Charlotte",
        state: "NC",
        zip: "28203"
      },
      {
        street: "7124 Wallace Road",
        city: "Charlotte",
        state: "NC",
        zip: "28203"
      },
      {
        street: "7128 Wallace Road",
        city: "Charlotte",
        state: "NC",
        zip: "28203"
      }
    ],
    description: [
      "Extract all addresses from the input. Usually, all addresses will be within the same city, state, and zip code."
    ]
  },
  {
    title: "Address ranges",
    input: {
      Address: "1401 - 1457 W. Schaumburg Road (28% 2 Story Office)",
      City: "Schaumburg",
      County: "Cook",
      "Location Name": "Schaumburg Plaza",
      ST: "IL",
      Zip: "60194"
    },
    output: [
      {
        street: "1401-1457 W. Schaumburg Road",
        city: "Schaumburg",
        state: "IL",
        zip: "60194"
      }
    ],
    description: [
      "Preserve address ranges from the input. Address ranges are on the same street and they have a dash between them. Make sure to remove spaces around the dash."
    ]
  },
  {
    title: "Multiple secondary units",
    input: {
      CITY: "Charlotte",
      ST: "NC",
      "STREET ADDRESS": "7124 Wallace Road (Unit A, B; and Suite 100, 200)",
      "ZIP CODE": "28203"
    },
    output: [
      {
        street: "7124 Wallace Road",
        unit: "Unit A",
        city: "Charlotte",
        state: "NC",
        zip: "28203"
      },
      {
        street: "7124 Wallace Road",
        unit: "Unit B",
        city: "Charlotte",
        state: "NC",
        zip: "28203"
      },
      {
        street: "7124 Wallace Road",
        unit: "Suite 100",
        city: "Charlotte",
        state: "NC",
        zip: "28203"
      },
      {
        street: "7124 Wallace Road",
        unit: "Suite 200",
        city: "Charlotte",
        state: "NC",
        zip: "28203"
      }
    ],
    description: [
      "If there are multiple secondary units, you should treat each one as a separate address."
    ]
  },
  {
    title: "Intersections (simple)",
    input: {
      City: "Long Island City",
      "Postal Code": "11004",
      "Property Name": "Phipps Sunnyside",
      State: "NY",
      "Street Address": "39th Ave & 50th St."
    },
    output: [
      {
        street: "39th Ave and 50th St.",
        city: "Long Island City",
        state: "NY",
        zip: "11004"
      }
    ],
    description: [
      "Intersections in the input generally have a connector between them like <code>&</code>,  <code>@</code>, or <code>and</code>. Format intersections as <code>street1 and street2</code>."
    ]
  },
  {
    title: "Intersections",
    input: {
      City: "Long Island City",
      "Postal Code": "11004",
      "Property Name": "Phipps Sunnyside",
      State: "NY",
      "Street Address": "N. Side 39th Ave B/N 50th & 52nd Sts"
    },
    output: [
      {
        city: "Long Island City",
        zip: "11004",
        placeName: "Phipps Sunnyside",
        state: "NY",
        street: "39th Ave and 50th St"
      },
      {
        city: "Long Island City",
        zip: "11004",
        placeName: "Phipps Sunnyside",
        state: "NY",
        street: "39th Ave and 52nd St"
      }
    ],
    description: [
      "Intersections in the input generally have a connector between them like <code>&</code>,  <code>@</code>, or <code>and</code>. Format intersections as <code>street1 and street2</code>.",
      'In this example, the street address is "the north side of 39th Ave between 50th St and 52nd St.". We extract two intersections: 39th Ave and 50th St, and 39th Ave and 52nd St.'
    ],
    description_position: "after"
  },
  {
    title: "Extraneous information",
    input: {
      Address: "W. Grant Ranch Blvd & W. Sumac Ave (Eastbound)",
      City: "Littleton",
      County: "Jefferson",
      "Location Name": "Bus Stop Bench / Concrete Pad",
      ZIP: "80123"
    },
    output: [
      {
        street: "W. Grant Ranch Blvd and W. Sumac Ave",
        city: "Littleton",
        county: "Jefferson",
        zip: "80123"
      }
    ],
    description: [
      "In this example, the Address field contains a description (Eastbound) that isn't needed. This description should not be included in the output."
    ]
  },
  {
    title: "Missing information",
    input: {
      LOCATION:
        "211-217 (aka 217A) & 215 Roebling St aka 222-224 South 2nd Street"
    },
    output: [
      { street: "211-217 Roebling St" },
      { street: "217A Roebling St" },
      { street: "215 Roebling St" },
      { street: "222-224 South 2nd Street" }
    ],
    description: [
      "In this example, a lot of information is missing: city, state, and zip are all missing. Use as much information as you have available for these addresses."
    ]
  },
  {
    title: 'dealing with "also known as" (AKA)',
    input: {
      Address: "413 Lafayette Ave\n(aka RR2 & Western Ave)",
      City: "Moundsville",
      State: "WV",
      Zip: "26041"
    },
    output: [
      {
        street: "413 Lafayette Ave",
        city: "Moundsville",
        state: "WV",
        zip: "26041"
      },
      {
        street: "RR2 and Western Ave",
        city: "Moundsville",
        state: "WV",
        zip: "26041"
      }
    ],
    description: [
      'Addresses might contain multiple addresses where one or more addresses is "also known as" another address. In these cases, include all addresses in your labels.'
    ]
  },
  {
    title: "addresses with coordinates",
    input: {
      Address: "26° 46' 31\" N, 81° 50' 50\" W",
      City: "N Ft Myers",
      ST: "FL",
      ZIP: "33903"
    },
    output: [
      {
        city: "N Ft Myers",
        state: "FL",
        zip: "33903"
      }
    ],
    description: [
      "Addresses might contain coordinates. You should leave coordinates out of your cleaned addresses."
    ]
  },
  {
    title: "addresses with no address information",
    input: {
      "PROPERTY VALUES AND LOCATIONS:":
        "(2nd Fl:Unit #2 is ARMC&Unit #4 is AHServices-UC, "
    },
    output: [],
    description: [
      "If the location has no information that could be used to deliver mail or find the location on a map, leave the output blank."
    ]
  },
  {
    title: "addresses that require following directions",
    input: {
      City: "Fairfax",
      County: "Fairfax",
      State: "VA",
      StreetAddress:
        "Beginning at an iron pipe on the southerly side of Washington Street (Route #606) 50 ft. wide; said pipe being a corner common to Nelson J. Post and to Scudder Hail Darragh, et ux; thence along the southerly line of Washington Street and being also along",
      ZipCode: "22030"
    },
    output: [
      {
        city: "Fairfax",
        county: "Fairfax",
        state: "VA",
        zip: "22030"
      }
    ],
    description: [
      "If the address requires you to follow directions, only include the city, state, and zip, depending on which are available. If a county is given without a city or zip, include the county."
    ]
  }
];
