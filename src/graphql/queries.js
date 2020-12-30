/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const user = /* GraphQL */ `
  query User($id: ID) {
    user(id: $id) {
      id
      cognitoUserName
      firstName
      lastName
      company
      address1
      address2
      city
      state
      zip
      phone
      email
      signature
      createdAt
      updatedAt
    }
  }
`;
export const prospectList = /* GraphQL */ `
  query ProspectList {
    prospectList {
      id
      name
      owningUserId
      prospects {
        id
        status
        prospectListId
        firstName
        lastName
        company
        address1
        address2
        city
        state
        zip
        phone
        email
        facebook
        owningUserId
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const prospect = /* GraphQL */ `
  query Prospect {
    prospect {
      id
      status
      prospectListId
      firstName
      lastName
      company
      address1
      address2
      city
      state
      zip
      phone
      email
      facebook
      owningUserId
      createdAt
      updatedAt
    }
  }
`;
export const paymentMethod = /* GraphQL */ `
  query PaymentMethod {
    paymentMethod {
      id
      userId
      title
      stripeInfo
      name
      email
      phone
      createdAt
      updatedAt
    }
  }
`;
export const marketingCampaign = /* GraphQL */ `
  query MarketingCampaign {
    marketingCampaign {
      id
      title
      prospectListId
      startDateTime
      autmatedEmail
      automatedText
      automatedRinglessVoiceMail
      automatedPostcard
      paymentMethodId
      consent
      owningUserId
      createdAt
      updatedAt
    }
  }
`;
export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      cognitoUserName
      firstName
      lastName
      company
      address1
      address2
      city
      state
      zip
      phone
      email
      signature
      createdAt
      updatedAt
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        cognitoUserName
        firstName
        lastName
        company
        address1
        address2
        city
        state
        zip
        phone
        email
        signature
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getProspectList = /* GraphQL */ `
  query GetProspectList($id: ID!) {
    getProspectList(id: $id) {
      id
      name
      owningUserId
      prospects {
        id
        status
        prospectListId
        firstName
        lastName
        company
        address1
        address2
        city
        state
        zip
        phone
        email
        facebook
        owningUserId
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listProspectLists = /* GraphQL */ `
  query ListProspectLists(
    $filter: ModelProspectListFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProspectLists(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        owningUserId
        prospects {
          id
          status
          prospectListId
          firstName
          lastName
          company
          address1
          address2
          city
          state
          zip
          phone
          email
          facebook
          owningUserId
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getProspect = /* GraphQL */ `
  query GetProspect($id: ID!) {
    getProspect(id: $id) {
      id
      status
      prospectListId
      firstName
      lastName
      company
      address1
      address2
      city
      state
      zip
      phone
      email
      facebook
      owningUserId
      createdAt
      updatedAt
    }
  }
`;
export const listProspects = /* GraphQL */ `
  query ListProspects(
    $filter: ModelProspectFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProspects(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        status
        prospectListId
        firstName
        lastName
        company
        address1
        address2
        city
        state
        zip
        phone
        email
        facebook
        owningUserId
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getPaymentMethod = /* GraphQL */ `
  query GetPaymentMethod($id: ID!) {
    getPaymentMethod(id: $id) {
      id
      userId
      title
      stripeInfo
      name
      email
      phone
      createdAt
      updatedAt
    }
  }
`;
export const listPaymentMethods = /* GraphQL */ `
  query ListPaymentMethods(
    $filter: ModelPaymentMethodFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPaymentMethods(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        title
        stripeInfo
        name
        email
        phone
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getMarketingCampaign = /* GraphQL */ `
  query GetMarketingCampaign($id: ID!) {
    getMarketingCampaign(id: $id) {
      id
      title
      prospectListId
      startDateTime
      autmatedEmail
      automatedText
      automatedRinglessVoiceMail
      automatedPostcard
      paymentMethodId
      consent
      owningUserId
      createdAt
      updatedAt
    }
  }
`;
export const listMarketingCampaigns = /* GraphQL */ `
  query ListMarketingCampaigns(
    $filter: ModelMarketingCampaignFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMarketingCampaigns(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        title
        prospectListId
        startDateTime
        autmatedEmail
        automatedText
        automatedRinglessVoiceMail
        automatedPostcard
        paymentMethodId
        consent
        owningUserId
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
