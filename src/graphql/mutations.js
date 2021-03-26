/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const batchCreateProspects = /* GraphQL */ `
  mutation BatchCreateProspects($prospects: [BatchCreateProspectInput]) {
    batchCreateProspects(prospects: $prospects) {
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
        enhanced
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
          file
          name
          enhance
          customerEmail
          customerId
          paymentMethodId
          amount
          uploadStatus
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
export const createStripeCustomer = /* GraphQL */ `
  mutation CreateStripeCustomer($input: CreateStripeCustomerInput) {
    createStripeCustomer(input: $input) {
      data {
        paymentMethodId
        customerId
      }
      error {
        message
      }
    }
  }
`;
export const createStripeSubscription = /* GraphQL */ `
  mutation CreateStripeSubscription($input: CreateStripeSubscriptionInput) {
    createStripeSubscription(input: $input) {
      data {
        address
        name
        email
        phone
        paymentMethodId
        subscriptionId
        customerId
        subscriptionType
        discount
        unitAmount
      }
      error {
        message
      }
    }
  }
`;
export const validatePromoCode = /* GraphQL */ `
  mutation ValidatePromoCode($input: ValidatePromoCodeInput) {
    validatePromoCode(input: $input) {
      data {
        id
        object
        amount_off
        created
        currency
        duration
        duration_in_months
        livemode
        max_redemptions
        name
        percent_off
        redeem_by
        times_redeemed
        valid
      }
      error {
        message
      }
    }
  }
`;
export const checkout = /* GraphQL */ `
  mutation Checkout($input: CheckoutInput) {
    checkout(input: $input) {
      data {
        id
        amount
        amountCaptured
        amountRefunded
        description
        paid
        receiptEmail
        receiptNumber
        receiptUrl
        source
        status
      }
      error {
        message
      }
    }
  }
`;
export const sendCampaignConfirmEmail = /* GraphQL */ `
  mutation SendCampaignConfirmEmail($input: SendCampaignConfirmEmailInput) {
    sendCampaignConfirmEmail(input: $input) {
      data
      error {
        message
      }
    }
  }
`;
export const requestPasswordReset = /* GraphQL */ `
  mutation RequestPasswordReset($input: RequestPasswordResetInput) {
    requestPasswordReset(input: $input) {
      data
      error {
        message
      }
    }
  }
`;
export const resetPassword = /* GraphQL */ `
  mutation ResetPassword($input: ResetPasswordInput) {
    resetPassword(input: $input) {
      data
      error {
        message
      }
    }
  }
`;
export const changeEmail = /* GraphQL */ `
  mutation ChangeEmail($input: ChangeEmailInput) {
    changeEmail(input: $input) {
      data
      error {
        message
      }
    }
  }
`;
export const fetchEnhanceData = /* GraphQL */ `
  mutation FetchEnhanceData($input: FetchEnhanceDataInput) {
    fetchEnhanceData(input: $input)
  }
`;
export const uploadProspects = /* GraphQL */ `
  mutation UploadProspects($input: UploadProspectsInput) {
    uploadProspects(input: $input)
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
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
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
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
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
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
export const createProspect = /* GraphQL */ `
  mutation CreateProspect(
    $input: CreateProspectInput!
    $condition: ModelProspectConditionInput
  ) {
    createProspect(input: $input, condition: $condition) {
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
      enhanced
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
        file
        name
        enhance
        customerEmail
        customerId
        paymentMethodId
        amount
        uploadStatus
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateProspect = /* GraphQL */ `
  mutation UpdateProspect(
    $input: UpdateProspectInput!
    $condition: ModelProspectConditionInput
  ) {
    updateProspect(input: $input, condition: $condition) {
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
      enhanced
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
        file
        name
        enhance
        customerEmail
        customerId
        paymentMethodId
        amount
        uploadStatus
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteProspect = /* GraphQL */ `
  mutation DeleteProspect(
    $input: DeleteProspectInput!
    $condition: ModelProspectConditionInput
  ) {
    deleteProspect(input: $input, condition: $condition) {
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
      enhanced
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
        file
        name
        enhance
        customerEmail
        customerId
        paymentMethodId
        amount
        uploadStatus
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const createProspectList = /* GraphQL */ `
  mutation CreateProspectList(
    $input: CreateProspectListInput!
    $condition: ModelProspectListConditionInput
  ) {
    createProspectList(input: $input, condition: $condition) {
      id
      userId
      file
      name
      enhance
      customerEmail
      customerId
      paymentMethodId
      amount
      uploadStatus
      createdAt
      updatedAt
    }
  }
`;
export const updateProspectList = /* GraphQL */ `
  mutation UpdateProspectList(
    $input: UpdateProspectListInput!
    $condition: ModelProspectListConditionInput
  ) {
    updateProspectList(input: $input, condition: $condition) {
      id
      userId
      file
      name
      enhance
      customerEmail
      customerId
      paymentMethodId
      amount
      uploadStatus
      createdAt
      updatedAt
    }
  }
`;
export const deleteProspectList = /* GraphQL */ `
  mutation DeleteProspectList(
    $input: DeleteProspectListInput!
    $condition: ModelProspectListConditionInput
  ) {
    deleteProspectList(input: $input, condition: $condition) {
      id
      userId
      file
      name
      enhance
      customerEmail
      customerId
      paymentMethodId
      amount
      uploadStatus
      createdAt
      updatedAt
    }
  }
`;
export const createPaymentMethod = /* GraphQL */ `
  mutation CreatePaymentMethod(
    $input: CreatePaymentMethodInput!
    $condition: ModelPaymentMethodConditionInput
  ) {
    createPaymentMethod(input: $input, condition: $condition) {
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
export const updatePaymentMethod = /* GraphQL */ `
  mutation UpdatePaymentMethod(
    $input: UpdatePaymentMethodInput!
    $condition: ModelPaymentMethodConditionInput
  ) {
    updatePaymentMethod(input: $input, condition: $condition) {
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
export const deletePaymentMethod = /* GraphQL */ `
  mutation DeletePaymentMethod(
    $input: DeletePaymentMethodInput!
    $condition: ModelPaymentMethodConditionInput
  ) {
    deletePaymentMethod(input: $input, condition: $condition) {
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
export const createMarketingCampaign = /* GraphQL */ `
  mutation CreateMarketingCampaign(
    $input: CreateMarketingCampaignInput!
    $condition: ModelMarketingCampaignConditionInput
  ) {
    createMarketingCampaign(input: $input, condition: $condition) {
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
        replyEmail
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
        file
        name
        enhance
        customerEmail
        customerId
        paymentMethodId
        amount
        uploadStatus
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateMarketingCampaign = /* GraphQL */ `
  mutation UpdateMarketingCampaign(
    $input: UpdateMarketingCampaignInput!
    $condition: ModelMarketingCampaignConditionInput
  ) {
    updateMarketingCampaign(input: $input, condition: $condition) {
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
        replyEmail
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
        file
        name
        enhance
        customerEmail
        customerId
        paymentMethodId
        amount
        uploadStatus
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteMarketingCampaign = /* GraphQL */ `
  mutation DeleteMarketingCampaign(
    $input: DeleteMarketingCampaignInput!
    $condition: ModelMarketingCampaignConditionInput
  ) {
    deleteMarketingCampaign(input: $input, condition: $condition) {
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
        replyEmail
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
        file
        name
        enhance
        customerEmail
        customerId
        paymentMethodId
        amount
        uploadStatus
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
