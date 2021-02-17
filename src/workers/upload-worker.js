import Amplify, { API, graphqlOperation } from "aws-amplify";
import { createProspect, createProspectList } from "../graphql/mutations";
import { timeConversion } from "../helpers/utils";
import { UPLOAD_STATUS } from "../redux/actionTypes";
import awsconfig from "../aws-exports";
Amplify.configure(awsconfig);

export const startUploadProspects = async (
  userId,
  storedProspects,
  storedProspectList
) => {
  postMessage({ type: UPLOAD_STATUS.STARTED });

  try {
    let prospectListId;
    let estimate;
    let percentage;
    let existingList = false;
    if (storedProspectList[0].prospectId) {
      prospectListId = storedProspectList[0].prospectId;
    } else {
      const start = new Date().getTime();
      const listInfo = await API.graphql(
        graphqlOperation(createProspectList, {
          input: {
            userId: userId,
            name: storedProspectList[0].prospectName,
            enhance: storedProspectList[0].enhance || false,
          },
        })
      );
      const end = new Date().getTime();
      const delta = end - start;
      prospectListId = listInfo.data.createProspectList.id;
      estimate = timeConversion(delta * storedProspects.length);
      percentage = Math.round((1 / (storedProspects.length + 1)) * 100);

      existingList = true;
      postMessage({
        type: UPLOAD_STATUS.UPLOADED_ONE,
        estimate: estimate,
        percentage: percentage,
        data: {
          type: "prospect-list",
          prospectName: storedProspectList[0].prospectName,
          prospectId: prospectListId,
        },
      });
    }

    for (let i = 0; i < storedProspects.length; i++) {
      const start = new Date().getTime();
      await API.graphql(
        graphqlOperation(createProspect, {
          input: {
            userId: userId,
            prospectListId: prospectListId,
            firstName: storedProspects[i].firstName,
            lastName: storedProspects[i].lastName,
            address1: storedProspects[i].address1,
            city: storedProspects[i].city,
            state: storedProspects[i].state,
            zip: storedProspects[i].zip,
            company: storedProspects[i].company,
            phone: storedProspects[i].phone,
            email: storedProspects[i].email,
            facebook: storedProspects[i].facebook,
            status: storedProspects[i].status || "Interested",
          },
        })
      );
      const end = new Date().getTime();
      const delta = end - start;
      estimate = timeConversion(delta * (storedProspects.length - i + 1));
      percentage = Math.round(
        ((i + 1 + (existingList ? 0 : 1)) /
          (storedProspects.length + (existingList ? 0 : 1))) *
          100
      );
      postMessage({
        type: UPLOAD_STATUS.UPLOADED_ONE,
        estimate: estimate,
        percentage: percentage,
        uploaded: i + 1,
        data: {
          type: "prospect",
          prospectId: storedProspects[i].id,
        },
      });
    }
    postMessage({ type: UPLOAD_STATUS.COMPLETED_UPLOAD });
  } catch (err) {
    postMessage({ type: UPLOAD_STATUS.ERROR, error: err });
  }
};
