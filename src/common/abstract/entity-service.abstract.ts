import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';

export abstract class EntityService<Entity> {
  constructor(private readonly _repository: Repository<Entity>) {}

  async findMany(options?: FindManyOptions<Entity>) {
    return this._repository.find(options);
  }

  async findOne(options: FindOneOptions<Entity>) {
    return this._repository.findOne(options);
  }

  saveOne(entity: DeepPartial<Entity>) {
    return this._repository.save(entity);
  }

  saveMany(entities: DeepPartial<Entity>[]) {
    return this._repository.save(entities);
  }
}
