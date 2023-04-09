// import * as express from 'express';
// import
// export {};
// declare global {
//   namespace Express {
//     interface Request {
//       user?: Record<string, any>;
//     }
//   }
// }

declare namespace Express {
  export interface Request {
    [x: string]: any;
    user: {
      refresh_Token: string;
      id: string;
      email: string;
    };
    CSRFValidator: {
      instance;
    };
  }
}
