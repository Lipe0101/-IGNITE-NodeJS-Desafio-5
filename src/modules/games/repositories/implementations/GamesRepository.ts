import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";
import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder("games")
      .where("Lower(games.title) like Lower(:titleSearch)", {
        titleSearch: `%${param}%`,
      })
      .getMany();
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query("SELECT COUNT(id) FROM games"); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const query = await this.repository
      .createQueryBuilder("games")
      .where("games.id = :id", { id: `${id}` })
      .leftJoinAndSelect("games.users", "users")
      .getOne() as Game;

    return query.users;
    // Complete usando query builder
  }
}
