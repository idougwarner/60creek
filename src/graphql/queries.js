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
      userId
      name
      enhance
      createdAt
      updatedAt
    }
  }
`;
export const prospect = /* GraphQL */ `
  query Prospect {
    prospect {
      id
      userId
      prospectListId
      status
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
      prospectList {
        id
        userId
        name
        enhance
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const paymentMethod = /* GraphQL */ `
  query PaymentMethod {
    paymentMethod {
      id
      address
      name
      email
      phone
      paymentMethodId
      subscriptionId
      customerId
      cardType
      expMonth
      expYear
      last4
      subscriptionType
      discount
      unitAmount
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
export const subscriptionInfo = /* GraphQL */ `
  query SubscriptionInfo {
    subscriptionInfo {
      data {
        id
        object
        active
        billing_scheme
        created
        currency
        livemode
        lookup_key
        metadata
        nickname
        product
        recurring {
          aggregate_usage
          interval
          interval_count
          usage_type
        }
        tiers_mode
        transform_quantity
        type
        unit_amount
        unit_amount_decimal
      }
      error {
        message
      }
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
export const getProspect = /* GraphQL */ `
  query GetProspect($id: ID!) {
    getProspect(id: $id) {
      id
      userId
      prospectListId
      status
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
      prospectList {
        id
        userId
        name
        enhance
        createdAt
        updatedAt
      }
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
        userId
        prospectListId
        status
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
        prospectList {
          id
          userId
          name
          enhance
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
export const getProspectList = /* GraphQL */ `
  query GetProspectList($id: ID!) {
    getProspectList(id: $id) {
      id
      userId
      name
      enhance
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
        userId
        name
        enhance
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
      address
      name
      email
      phone
      paymentMethodId
      subscriptionId
      customerId
      cardType
      expMonth
      expYear
      last4
      subscriptionType
      discount
      unitAmount
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
        address
        name
        email
        phone
        paymentMethodId
        subscriptionId
        customerId
        cardType
        expMonth
        expYear
        last4
        subscriptionType
        discount
        unitAmount
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
