import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

export abstract class EntityService<Entity> {
  constructor(private readonly _repository: Repository<Entity>) {}

  async findMany(options?: FindManyOptions<Entity>) {
    return this._repository.find(options);
  }

  async findOne(options: FindOneOptions<Entity>) {
    return this._repository.findOne(options);
  }
}
