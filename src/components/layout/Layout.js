import React, { useEffect } from "react";
import Sidebar from "./Sidebar";
import "./Layout.scss";
import { useHistory } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { APP_URLS } from "../../helpers/routers";
import { API, Auth, graphqlOperation } from "aws-amplify";
import { listUsers } from "../../graphql/queries";
import { ACTIONS, UPLOAD_STATUS } from "../../redux/actionTypes";
import { WORKER_STATUS } from "../../redux/uploadWorkerReducer";

// Import your worker
import worker from "workerize-loader!../../workers/upload-worker"; // eslint-disable-line import/no-webpack-loader-syntax

import { useIndexedDB } from "react-indexed-db";
import { IndexDBStores } from "../../helpers/DBConfig";
import { toast, ToastContainer } from "react-toastify";

var g_workerInstance;

const Layout = ({ children }) => {
  const history = useHistory();
  const user = useSelector((state) => state.userStore);
  const uploadStatus = useSelector((state) => state.uploadWorkerStore);

  const prospectsDb = useIndexedDB(IndexDBStores.PROSPECT);
  const prospectListDb = useIndexedDB(IndexDBStores.PROSPECT_LIST);

  const dispatch = useDispatch();
  useEffect(() => {
    if (!user) {
      const f = async () => {
        let rt = await Auth.currentUserInfo();
        if (rt) {
          const rtUser = await API.graphql(
            graphqlOperation(listUsers, {
              filter: { cognitoUserName: { eq: rt.username } },
            })
          );
          if (rtUser?.data?.listUsers?.items[0]) {
            dispatch({
              type: ACTIONS.SET_USER,
              user: rtUser?.data?.listUsers?.items[0],
            });
          }
        } else {
          history.replace(APP_URLS.LOGIN);
        }
      };
      f();
    }
    // eslint-disable-next-line
  }, [user, history]);

  useEffect(() => {
    const f = async () => {
      if (!g_workerInstance) return;
      if (!user) return;
      if (uploadStatus.status === WORKER_STATUS.START) {
        try {
          const storedProspectList = await prospectListDb.getAll();
          const storedProspects = await prospectsDb.getAll();
          g_workerInstance.startUploadProspects(
            user.id,
            storedProspects,
            storedProspectList
          );
        } catch (err) {}
      } else if (uploadStatus.status === WORKER_STATUS.CHANGE) {
      } else if (uploadStatus.status === WORKER_STATUS.COMPLETED) {
        toast.success("Successfully uploaded.", { hideProgressBar: true });
      } else if (uploadStatus.status === WORKER_STATUS.ERROR) {
      } else {
      }
    };
    f();
  }, [uploadStatus, prospectListDb, prospectsDb, user]);

  const serviceWorkerListener = async ({ data }) => {
    if (data.type === UPLOAD_STATUS.STARTED) {
    } else if (data.type === UPLOAD_STATUS.UPLOADED_ONE) {
      if (data.data.type === "prospect-list") {
        await prospectListDb.clear();
        await prospectListDb.add({
          prospectName: data.data.prospectName,
          prospectId: data.data.prospectListId,
        });
      } else if (data.data.type === "prospect") {
        await prospectsDb.deleteRecord(data.data.prospectId);
      }
      dispatch({
        type: ACTIONS.UPDATE_UPLOADE_WORKER,
        uploaded: data.uploaded,
        estimate: data.estimate,
        percentage: data.percentage,
      });
    } else if (data.type === UPLOAD_STATUS.COMPLETED_UPLOAD) {
      await prospectListDb.clear();
      await prospectsDb.clear();
      dispatch({
        type: ACTIONS.COMPLETED_UPLOADE_WORKER,
        estimate: "",
        percentage: 100,
      });
      setTimeout(() => {
        dispatch({
          type: ACTIONS.IDLE_UPLOADE_WORKER,
          estimate: "",
          percentage: 100,
        });
      }, 3000);
    } else if (data.type === UPLOAD_STATUS.ERROR) {
      dispatch({
        type: ACTIONS.ERROR_UPLOADE_WORKER,
      });
      toast.error(
        "Oops! It looks like something went wrong. Please retry your upload here!",
        {
          autoClose: false,
        }
      );
    } else {
    }
  };

  useEffect(() => {
    const workerInstance = worker();
    // Attach an event listener to receive calculations from your worker
    workerInstance.addEventListener("message", serviceWorkerListener);
    // Run your calculations
    g_workerInstance = workerInstance;
    return () => {
      workerInstance.removeEventListener("message", serviceWorkerListener);
    };
    // eslint-disable-next-line
  }, []);
  return (
    <div className="admin-layout">
      <ToastContainer />
      <Sidebar />
      <main className="admin-body">{children}</main>
    </div>
  );
};

export default Layout;
