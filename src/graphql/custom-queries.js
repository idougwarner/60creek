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
