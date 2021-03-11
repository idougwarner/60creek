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
      receiveEmail
      code
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
      receiveEmail
      code
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
      receiveEmail
      code
      createdAt
      updatedAt
    }
  }
`;
export const onCreateProspect = /* GraphQL */ `
  subscription OnCreateProspect {
    onCreateProspect {
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
      notes
      interested
      enhance
      fetched
      demographic {
        DOB
        ageRange
        ethnicCode
        singleParent
        seniorAdultInHousehold
        youngAdultInHousehold
        workingWoman
        SOHOIndicator
        businessOwner
        language
        religion
        numberOfChildren
        maritalStatusInHousehold
        homeOwnerRenter
        education
        occupation
        occupationDetail
        gender
        socialPresence
        presenceOfChildren
      }
      lifestyle {
        magazines
        computerAndTechnology
        dietingWeightLoss
        exerciseHealthGrouping
        doItYourselferHomeImprovement
        jewelry
        mailOrderBuyer
        membershipClubs
        travelGrouping
        onlineEducation
        sportsGrouping
        sportsOutdoorsGrouping
        investing
        booksAndReading
        politicalDonor
        hobbiesAndCrafts
        cosmetics
        charitableDonations
        artsAntiquesCollectibles
        petOwner
        cooking
        autoPartsAccessories
        healthBeautyWellness
        parentingAndChildrensProducts
        music
        movie
        selfImprovement
        womensApparel
      }
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
export const onUpdateProspect = /* GraphQL */ `
  subscription OnUpdateProspect {
    onUpdateProspect {
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
      notes
      interested
      enhance
      fetched
      demographic {
        DOB
        ageRange
        ethnicCode
        singleParent
        seniorAdultInHousehold
        youngAdultInHousehold
        workingWoman
        SOHOIndicator
        businessOwner
        language
        religion
        numberOfChildren
        maritalStatusInHousehold
        homeOwnerRenter
        education
        occupation
        occupationDetail
        gender
        socialPresence
        presenceOfChildren
      }
      lifestyle {
        magazines
        computerAndTechnology
        dietingWeightLoss
        exerciseHealthGrouping
        doItYourselferHomeImprovement
        jewelry
        mailOrderBuyer
        membershipClubs
        travelGrouping
        onlineEducation
        sportsGrouping
        sportsOutdoorsGrouping
        investing
        booksAndReading
        politicalDonor
        hobbiesAndCrafts
        cosmetics
        charitableDonations
        artsAntiquesCollectibles
        petOwner
        cooking
        autoPartsAccessories
        healthBeautyWellness
        parentingAndChildrensProducts
        music
        movie
        selfImprovement
        womensApparel
      }
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
export const onDeleteProspect = /* GraphQL */ `
  subscription OnDeleteProspect {
    onDeleteProspect {
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
      notes
      interested
      enhance
      fetched
      demographic {
        DOB
        ageRange
        ethnicCode
        singleParent
        seniorAdultInHousehold
        youngAdultInHousehold
        workingWoman
        SOHOIndicator
        businessOwner
        language
        religion
        numberOfChildren
        maritalStatusInHousehold
        homeOwnerRenter
        education
        occupation
        occupationDetail
        gender
        socialPresence
        presenceOfChildren
      }
      lifestyle {
        magazines
        computerAndTechnology
        dietingWeightLoss
        exerciseHealthGrouping
        doItYourselferHomeImprovement
        jewelry
        mailOrderBuyer
        membershipClubs
        travelGrouping
        onlineEducation
        sportsGrouping
        sportsOutdoorsGrouping
        investing
        booksAndReading
        politicalDonor
        hobbiesAndCrafts
        cosmetics
        charitableDonations
        artsAntiquesCollectibles
        petOwner
        cooking
        autoPartsAccessories
        healthBeautyWellness
        parentingAndChildrensProducts
        music
        movie
        selfImprovement
        womensApparel
      }
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
export const onCreateProspectList = /* GraphQL */ `
  subscription OnCreateProspectList {
    onCreateProspectList {
      id
      userId
      name
      enhance
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateProspectList = /* GraphQL */ `
  subscription OnUpdateProspectList {
    onUpdateProspectList {
      id
      userId
      name
      enhance
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteProspectList = /* GraphQL */ `
  subscription OnDeleteProspectList {
    onDeleteProspectList {
      id
      userId
      name
      enhance
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
      userId
      title
      prospectListId
      startDateTime {
        day
        month
        year
        hour
        minute
        am
      }
      automatedEmail {
        prospects
        message
      }
      automatedText {
        prospects
        text
        phone
      }
      automatedRinglessVoiceMail {
        prospects
        file
        phone
      }
      automatedPostcard {
        prospects
        file
      }
      automatedSocialPost {
        prospects
        image
        content
      }
      checkout {
        brand
        last4
        total
        discount
        email
      }
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
export const onUpdateMarketingCampaign = /* GraphQL */ `
  subscription OnUpdateMarketingCampaign {
    onUpdateMarketingCampaign {
      id
      userId
      title
      prospectListId
      startDateTime {
        day
        month
        year
        hour
        minute
        am
      }
      automatedEmail {
        prospects
        message
      }
      automatedText {
        prospects
        text
        phone
      }
      automatedRinglessVoiceMail {
        prospects
        file
        phone
      }
      automatedPostcard {
        prospects
        file
      }
      automatedSocialPost {
        prospects
        image
        content
      }
      checkout {
        brand
        last4
        total
        discount
        email
      }
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
export const onDeleteMarketingCampaign = /* GraphQL */ `
  subscription OnDeleteMarketingCampaign {
    onDeleteMarketingCampaign {
      id
      userId
      title
      prospectListId
      startDateTime {
        day
        month
        year
        hour
        minute
        am
      }
      automatedEmail {
        prospects
        message
      }
      automatedText {
        prospects
        text
        phone
      }
      automatedRinglessVoiceMail {
        prospects
        file
        phone
      }
      automatedPostcard {
        prospects
        file
      }
      automatedSocialPost {
        prospects
        image
        content
      }
      checkout {
        brand
        last4
        total
        discount
        email
      }
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
