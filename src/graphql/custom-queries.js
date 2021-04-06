export const listProspectsCounts = /* GraphQL */ `
  query listProspectsCounts(
    $filter: ModelProspectFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProspects(filter: $filter, limit: $limit, nextToken: $nextToken) {
      nextToken
      scannedCount
      count
      items {
        id
        prospectListId
      }
    }
  }
`;

export const prospectsCountsByProspectListId = /* GraphQL */ `
  query ProspectsByProspectListId(
    $prospectListId: ID
    $sortDirection: ModelSortDirection
    $filter: ModelProspectFilterInput
    $limit: Int
    $nextToken: String
  ) {
    prospectsByProspectListId(
      prospectListId: $prospectListId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      nextToken
      scannedCount
      count
    }
  }
`;
