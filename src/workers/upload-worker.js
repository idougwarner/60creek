import Amplify, { API, graphqlOperation } from "aws-amplify";
import {
  createProspect,
  createProspectList,
  updateProspectList,
  uploadProspects,
} from "../graphql/mutations";
import { delay, timeConversion } from "../helpers/utils";
import { UPLOAD_STATUS } from "../redux/actionTypes";
import awsconfig from "../aws-exports";
import { INTEREST_STATUS } from "../helpers/interestStatus";
import { UPLOAD_PROSPECTS_LIMIT } from "../helpers/constants";
Amplify.configure(awsconfig);

export const startUploadProspects = async (
  userId,
  storedProspects,
  storedProspectList,
  fileKey = ""
) => {
  postMessage({ type: UPLOAD_STATUS.STARTED });

  try {
    let prospectListId;
    let estimate;
    let percentage;
    const prospectList = storedProspectList[0];
    const enhance = prospectList.enhance || false;
    {
      const start = new Date().getTime();
      if (prospectList.prospectListId) {
        prospectListId = prospectList.prospectListId;
        await API.graphql(
          graphqlOperation(updateProspectList, {
            input: {
              id: prospectListId,
              enhance: enhance,
              uploadCompleted: false,
            },
          })
        );
      } else {
        const listInfo = await API.graphql(
          graphqlOperation(createProspectList, {
            input: {
              userId: userId,
              name: prospectList.prospectName,
              enhance: enhance,
              uploadCompleted: false,
            },
          })
        );
        prospectListId = listInfo.data.createProspectList.id;
      }
      const end = new Date().getTime();
      const delta = end - start;
      estimate = timeConversion(delta * storedProspects.length);
      percentage = Math.round((1 / (storedProspects.length + 1)) * 100);

      postMessage({
        type: UPLOAD_STATUS.UPLOADED_ONE,
        estimate: estimate,
        percentage: percentage,
        data: {
          type: "prospect-list",
          prospectName: prospectList.prospectName,
          prospectListId: prospectListId,
          customerId: prospectList.customerId,
          amount: prospectList.amount,
          paymentMethodId: prospectList.paymentMethodId,
          customerEmail: prospectList.customerEmail,
          enhance: enhance,
        },
      });
    }

    if (storedProspects.length < UPLOAD_PROSPECTS_LIMIT) {
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
              status: storedProspects[i].status || INTEREST_STATUS.INTERESTED,
              enhance: storedProspects[i].enhance,
              enhanced: false,
              fetched: false,
              demographic: null,
              lifestyle: null,
            },
          })
        );
        const end = new Date().getTime();
        const delta = end - start;
        estimate = timeConversion(delta * (storedProspects.length - i + 1));
        percentage = Math.round(
          ((i + 1 + 1) / (storedProspects.length + 1)) * 100
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

      if (enhance) {
        await API.graphql(
          graphqlOperation(updateProspectList, {
            input: {
              id: prospectListId,
              customerId: prospectList.customerId,
              customerEmail: prospectList.customerEmail,
              paymentMethodId: prospectList.paymentMethodId,
              enhance: enhance,
              uploadCompleted: true,
            },
          })
        );
        console.log("finished -------");
      }
    } else {
      await API.graphql(
        graphqlOperation(uploadProspects, {
          input: {
            file: fileKey,
            prospectListId: prospectListId,
            srcBucketName: awsconfig.aws_user_files_s3_bucket,
            userId: userId,
            enhance: enhance,
            customerId: prospectList.customerId,
            customerEmail: prospectList.customerEmail,
            paymentMethodId: prospectList.paymentMethodId,
          },
        })
      );
      const delayTime = 15;
      let count = 0;
      const timer = setInterval(() => {
        count++;
        postMessage({
          type: UPLOAD_STATUS.UPLOADED_ONE,
          estimate: timeConversion((delayTime - count) * 1000),
          percentage: count * (90 / delayTime) + 10,
          uploaded: Math.round((storedProspects.length / delayTime) * count),
          data: {
            type: "bulk-upload",
          },
        });
        if (count >= delayTime) {
          clearInterval(timer);
        }
      }, 1000);
      await delay(delayTime * 1000);
    }

    postMessage({
      type: UPLOAD_STATUS.COMPLETED_UPLOAD,
      prospectListId: prospectListId,
    });
  } catch (err) {
    console.log(err);
    postMessage({ type: UPLOAD_STATUS.ERROR, error: err });
  }
};
