/* eslint-disable */
// this is an auto generated file. This will be overwritten

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
      receiveEmail
      code
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
        receiveEmail
        code
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
      nextToken
      scannedCount
      count
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
      nextToken
    }
  }
`;
export const usersByUserId = /* GraphQL */ `
  query UsersByUserId(
    $cognitoUserName: String
    $lastName: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    usersByUserId(
      cognitoUserName: $cognitoUserName
      lastName: $lastName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
        receiveEmail
        code
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const usersByUserEmail = /* GraphQL */ `
  query UsersByUserEmail(
    $email: String
    $lastName: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    usersByUserEmail(
      email: $email
      lastName: $lastName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
        receiveEmail
        code
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const usersByUserResetToken = /* GraphQL */ `
  query UsersByUserResetToken(
    $code: String
    $lastName: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    usersByUserResetToken(
      code: $code
      lastName: $lastName
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
        receiveEmail
        code
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const prospectsByUserId = /* GraphQL */ `
  query ProspectsByUserId(
    $userId: ID
    $prospectListId: ModelIDKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelProspectFilterInput
    $limit: Int
    $nextToken: String
  ) {
    prospectsByUserId(
      userId: $userId
      prospectListId: $prospectListId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
      nextToken
      scannedCount
      count
    }
  }
`;
export const prospectsByProspectListId = /* GraphQL */ `
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
      nextToken
      scannedCount
      count
    }
  }
`;
export const prospectListsByUserId = /* GraphQL */ `
  query ProspectListsByUserId(
    $userId: ID
    $name: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelProspectListFilterInput
    $limit: Int
    $nextToken: String
  ) {
    prospectListsByUserId(
      userId: $userId
      name: $name
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
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
export const campaignsByUserId = /* GraphQL */ `
  query CampaignsByUserId(
    $userId: ID
    $createdAt: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelMarketingCampaignFilterInput
    $limit: Int
    $nextToken: String
  ) {
    campaignsByUserId(
      userId: $userId
      createdAt: $createdAt
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
    }
  }
`;
