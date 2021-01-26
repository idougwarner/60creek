/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
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
export const onCreateProspectList = /* GraphQL */ `
  subscription OnCreateProspectList {
    onCreateProspectList {
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
export const onUpdateProspectList = /* GraphQL */ `
  subscription OnUpdateProspectList {
    onUpdateProspectList {
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
export const onDeleteProspectList = /* GraphQL */ `
  subscription OnDeleteProspectList {
    onDeleteProspectList {
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
export const onCreateProspect = /* GraphQL */ `
  subscription OnCreateProspect {
    onCreateProspect {
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
export const onUpdateProspect = /* GraphQL */ `
  subscription OnUpdateProspect {
    onUpdateProspect {
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
export const onDeleteProspect = /* GraphQL */ `
  subscription OnDeleteProspect {
    onDeleteProspect {
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
export const onCreatePaymentMethod = /* GraphQL */ `
  subscription OnCreatePaymentMethod {
    onCreatePaymentMethod {
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
export const onUpdatePaymentMethod = /* GraphQL */ `
  subscription OnUpdatePaymentMethod {
    onUpdatePaymentMethod {
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
export const onDeletePaymentMethod = /* GraphQL */ `
  subscription OnDeletePaymentMethod {
    onDeletePaymentMethod {
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
export const onCreateMarketingCampaign = /* GraphQL */ `
  subscription OnCreateMarketingCampaign {
    onCreateMarketingCampaign {
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
export const onUpdateMarketingCampaign = /* GraphQL */ `
  subscription OnUpdateMarketingCampaign {
    onUpdateMarketingCampaign {
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
export const onDeleteMarketingCampaign = /* GraphQL */ `
  subscription OnDeleteMarketingCampaign {
    onDeleteMarketingCampaign {
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
