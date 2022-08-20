import { User } from './src/users/entity/user.entity';

declare module 'express-serve-static-core' {
  interface Request {
    user?: User;
  }
}
