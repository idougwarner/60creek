export const IndexDBStores = {
  PROSPECT: "prospect",
  PROSPECT_LIST: "prospectlist",
  PROSPECT_UPLOAD_STEP: "uploadStep",
};

export const DBConfig = {
  name: "ProspectDB",
  version: 1,
  objectStoresMeta: [
    {
      store: IndexDBStores.PROSPECT,
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        { name: "firstName", keypath: "firstName", options: { unique: false } },
        { name: "lastName", keypath: "lastName", options: { unique: false } },
        { name: "address1", keypath: "address1", options: { unique: false } },
        // { name: "address2", keypath: "address2", options: { unique: false } },
        { name: "city", keypath: "city", options: { unique: false } },
        { name: "state", keypath: "state", options: { unique: false } },
        { name: "zip", keypath: "zip", options: { unique: false } },
        { name: "company", keypath: "company", options: { unique: false } },
        { name: "phone", keypath: "phone", options: { unique: false } },
        { name: "email", keypath: "email", options: { unique: false } },
        { name: "facebook", keypath: "facebook", options: { unique: false } },
        { name: "status", keypath: "status", options: { unique: false } },
      ],
    },
    {
      store: IndexDBStores.PROSPECT_LIST,
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        {
          name: "prospectName",
          keypath: "prospectName",
          options: { unique: false },
        },
        {
          name: "prospectId",
          keypath: "prospectId",
          options: { unique: false },
        },
      ],
    },
    {
      store: IndexDBStores.PROSPECT_UPLOAD_STEP,
      storeConfig: { keyPath: "id", autoIncrement: true },
      storeSchema: [
        {
          name: "step",
          keypath: "step",
          options: { unique: false },
        },
      ],
    },
  ],
};
