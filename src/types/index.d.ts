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
    user: {
      refresh_Token: string;
      id: string;
      email: string;
    };
    [x: string]: any;
  }

  export interface Response {
    [x: string]: any;
    res: {
      user: any;
    };
  }
}
