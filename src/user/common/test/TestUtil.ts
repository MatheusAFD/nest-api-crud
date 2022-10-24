import { User } from '../../../user/user.entity';

export class TestUtil {
  static giveAMeAValidUser(): User {
    const user = new User();
    (user.email = 'valid@email.com'),
      (user.name = 'Matheus Araújo'),
      (user.id = '1');

    return user;
  }
}
