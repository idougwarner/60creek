export const AUTH_USER_TOKEN_KEY = 'AUTH_USER_TOKEN_KEY'

export const API_END_POINT = 'https://jlm6lzpzgbh5xgdvgtpgdz2ppq.appsync-api.us-east-2.amazonaws.com/graphql'
export const GRAPHQL_API_KEY = 'da2-2oom5klzhrb4nd6zy2rb6qpvt4'

const HASURA_GRAPHQL_ENGINE_HOSTNAME = "https://sixty-creek-80.hasura.app";

const scheme = proto => {
  return window.location.protocol === "https:" ? `${proto}s` : proto;
};

export const GRAPHQL_URL = `${scheme(
  "http"
)}://${HASURA_GRAPHQL_ENGINE_HOSTNAME}/v1alpha1/graphql`;

export const REALTIME_GRAPHQL_URL = `${scheme(
  "ws"
)}://${HASURA_GRAPHQL_ENGINE_HOSTNAME}/v1alpha1/graphql`;

export const authClientId = "<YOUR AUTH0 CLIENT ID>";
export const authDomain = "<YOUR AUTH0 DOMAIN>";
export const callbackUrl = `http://localhost:3000/callback`; 

// Hasura cloud info User randall.w.wright@comcast.net password: SixtyCreek2020!
// postgres db user: postgres, pw: 9xW96My1!

// version: '2'
// services:
//   graphql-engine:
//     image: hasura/graphql-engine:latest
//     ports:
//       - '80:8080'
//     restart: always
//     environment:
//       HASURA_GRAPHQL_DATABASE_URL: postgres://postgres:9xW96My1!@sixty-creek-db.c4bcxwbwcjfl.us-east-2.rds.amazonaws.com:5432/SixtyCreek
//       HASURA_GRAPHQL_ACCESS_KEY: mylongsecretaccesskeyforsixtycreek
//     command:
//       - graphql-engine
//       - serve
//         - --enable - console
      
//         sudo curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose