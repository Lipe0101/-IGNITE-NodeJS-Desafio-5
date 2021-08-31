import { getRepository, Repository } from "typeorm";

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from "../../dtos";
import { User } from "../../entities/User";
import { IUsersRepository } from "../IUsersRepository";

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const userGames = await this.repository.findOne({
      where: {
        id: user_id,
      },
      relations: ["games"],
    });

    return userGames as User;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query(
      "SELECT * FROM users ORDER BY users.first_name ASC"
    );
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    const user: User[] = await this.repository.query(
      `SELECT * FROM users WHERE Lower(first_name) = Lower('${first_name}') AND Lower(last_name) = Lower('${last_name}')`
    );

    return user;
  }
}
