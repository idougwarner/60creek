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
export const customSearchProspects = /* GraphQL */ `
  query SearchProspects(
    $filter: SearchableProspectFilterInput
    $sort: SearchableProspectSortInput
    $limit: Int
    $nextToken: String
    $from: Int
  ) {
    searchProspects(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
    ) {
      items {
        id
        status
        firstName
        lastName
        company
        address1
        city
        state
        phone
        email
        enhance
        enhanced
        fetched
      }
      nextToken
      total
    }
  }
`;
