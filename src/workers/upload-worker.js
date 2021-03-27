import Amplify, { API, graphqlOperation } from "aws-amplify";
import {
  uploadProspects,
  batchCreateProspects,
  createProspectList,
  updateProspectList,
} from "../graphql/mutations";
import { timeConversion } from "../helpers/utils";
import { UPLOAD_STATUS } from "../redux/actionTypes";
import awsconfig from "../aws-exports";
import { INTEREST_STATUS } from "../helpers/interestStatus";
import { UPLOAD_PROSPECTS_LIMIT } from "../helpers/constants";
Amplify.configure(awsconfig);

const MAX_ITEMS = 25; // don't change this value

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

    if (storedProspects.length >= UPLOAD_PROSPECTS_LIMIT) {
      estimate = timeConversion(7000);
      percentage = Math.round(25);

      postMessage({
        type: UPLOAD_STATUS.UPLOADED_ONE,
        estimate: estimate,
        percentage: percentage,
        data: {
          type: "file-uploaded",
        },
      });
    }
    {
      const start = new Date().getTime();
      if (prospectList.prospectListId) {
        prospectListId = prospectList.prospectListId;
        await API.graphql(
          graphqlOperation(updateProspectList, {
            input: {
              id: prospectListId,
              file: "",
              enhance: enhance,
              uploadStatus: "upload-start",
            },
          })
        );
      } else {
        const listInfo = await API.graphql(
          graphqlOperation(createProspectList, {
            input: {
              userId: userId,
              file: "",
              name: prospectList.prospectName,
              enhance: enhance,
              uploadStatus: "upload-start",
            },
          })
        );
        prospectListId = listInfo.data.createProspectList.id;
      }
      const end = new Date().getTime();
      const delta = end - start;
      if (storedProspects.length < UPLOAD_PROSPECTS_LIMIT) {
        estimate = timeConversion((delta * storedProspects.length) / MAX_ITEMS);
        percentage = Math.round((1 / (storedProspects.length + 1)) * 100);
      } else {
        estimate = timeConversion(delta * 2);
        percentage = Math.round(50);
      }
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
      for (let i = 0; i < storedProspects.length; i += MAX_ITEMS) {
        const start = new Date().getTime();
        const prospects = storedProspects.slice(i, i + MAX_ITEMS);
        await API.graphql(
          graphqlOperation(batchCreateProspects, {
            prospects: prospects.map((item) => ({
              userId: userId,
              prospectListId: prospectListId,
              firstName: item.firstName,
              lastName: item.lastName,
              address1: item.address1,
              city: item.city,
              state: item.state,
              zip: item.zip,
              company: item.company,
              phone: item.phone,
              email: item.email,
              facebook: item.facebook,
              status: item.status || INTEREST_STATUS.INTERESTED,
              enhance: item.enhance,
              enhanced: false,
              fetched: false,
              demographic: null,
              lifestyle: null,
            })),
          })
        );
        const end = new Date().getTime();
        const delta = end - start;
        estimate = timeConversion(
          delta * ((storedProspects.length - i) / MAX_ITEMS + 1)
        );
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
            prospectIds: prospects.map((item) => item.id),
          },
        });
      }

      await API.graphql(
        graphqlOperation(updateProspectList, {
          input: {
            id: prospectListId,
            file: "",
            customerId: prospectList.customerId || "",
            customerEmail: prospectList.customerEmail || "",
            paymentMethodId: prospectList.paymentMethodId || "",
            enhance: enhance,
            uploadStatus: enhance ? "need-enhance" : "completed",
          },
        })
      );
    } else {
      await API.graphql(
        graphqlOperation(uploadProspects, {
          input: {
            file: fileKey,
            prospectListId: prospectListId,
            srcBucketName: awsconfig.aws_user_files_s3_bucket,
            userId: userId,
            enhance: enhance,
            customerId: prospectList.customerId || "",
            customerEmail: prospectList.customerEmail || "",
            paymentMethodId: prospectList.paymentMethodId || "",
          },
        })
      );
      estimate = timeConversion(2000);
      percentage = Math.round(75);

      postMessage({
        type: UPLOAD_STATUS.UPLOADED_ONE,
        estimate: estimate,
        percentage: percentage,
        data: {
          type: "file-uploaded",
        },
      });
    }

    postMessage({
      type: UPLOAD_STATUS.COMPLETED_UPLOAD,
      prospectListId: prospectListId,
    });
  } catch (err) {
    postMessage({ type: UPLOAD_STATUS.ERROR, error: err });
  }
};
