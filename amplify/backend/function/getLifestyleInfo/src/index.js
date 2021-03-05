const axios = require("axios");
const AWS = require("aws-sdk");
const ssm = new AWS.SSM();
const datafinderKeyPromise = ssm
  .getParameter({
    Name: `/sixtycreek-${process.env.ENV}/datafinder-key`,
    WithDecryption: true,
  })
  .promise();

exports.handler = async (event) => {
  try {
    const datafinderKey = await datafinderKeyPromise;
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
    } = event.arguments.input;
    let rt = await axios.get("https://api.datafinder.com/v2/qdf.php", {
      params: {
        service: "lifeint",
        k2: datafinderKey.Parameter.Value,
        d_email: email ? email : null,
        d_phone: phone ? phone : null,
        d_fulladdr: address ? address : null,
        d_first: firstName ? firstName : null,
        d_last: lastName ? lastName : null,
      },
    });
    let dt = null;
    if (rt.data && rt.data.datafinder["num-results"] > 0) {
      const fetchedData = rt.data.datafinder.results[0];
      dt = {
        magazines: fetchedData.Magazines,
        computerAndTechnology: fetchedData.ComputerAndTechnology,
        dietingWeightLoss: fetchedData.DietingWeightLoss,
        exerciseHealthGrouping: fetchedData.ExerciseHealthGrouping,
        doItYourselferHomeImprovement:
          fetchedData.DoItYourselferHomeImprovement,
        jewelry: fetchedData.Jewelry,
        mailOrderBuyer: fetchedData.MailOrderBuyer,
        membershipClubs: fetchedData.MembershipClubs,
        travelGrouping: fetchedData.TravelGrouping,
        onlineEducation: fetchedData.OnlineEducation,
        sportsGrouping: fetchedData.SportsGrouping,
        sportsOutdoorsGrouping: fetchedData.SportsOutdoorsGrouping,
        investing: fetchedData.Investing,
        booksAndReading: fetchedData.BooksAndReading,
        politicalDonor: fetchedData.PoliticalDonor,
        hobbiesAndCrafts: fetchedData.HobbiesAndCrafts,
        cosmetics: fetchedData.Cosmetics,
        charitableDonations: fetchedData.CharitableDonations,
        artsAntiquesCollectibles: fetchedData.ArtsAntiquesCollectibles,
        petOwner: fetchedData.PetOwner,
        cooking: fetchedData.Cooking,
        autoPartsAccessories: fetchedData.AutoPartsAccessories,
        healthBeautyWellness: fetchedData.HealthBeautyWellness,
        parentingAndChildrensProducts:
          fetchedData.ParentingAndChildrensProducts,
        music: fetchedData.Music,
        movie: fetchedData.Movie,
        selfImprovement: fetchedData.SelfImprovement,
        womensApparel: fetchedData.WomensApparel,
      };
    }

    return { data: dt, error: null };
  } catch (err) {
    return { data: null, error: { message: new Error(err).message } };
  }
};
