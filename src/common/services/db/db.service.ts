import chalk from "chalk"

import { connect, Mongoose, Model, RootFilterQuery } from "mongoose"

import {
  IFind,
  IFindById,
  IFindByIdAndDelete,
  IFindByIdAndUpdate,
  IFindOne,
  IFindOneAndDelete,
  IFindOneAndUpdate,
  IUpdateMany,
} from "../../../db/interfaces/db-service.interface"

export abstract class DataBaseService<Inputs, TDocument> {
  constructor(private readonly model: Model<TDocument>) {}

  public static readonly connect = async (): Promise<Mongoose | void> => {
    try {
      return await connect(String(process.env.DB_URI)).then(() => {
        console.log(
          chalk.yellowBright("#"),
          chalk.greenBright("   ", "DB Connection Established", "   "),
          chalk.yellowBright("#"),
        )
        console.log(chalk.yellowBright("-".repeat(37)))
      })
    } catch (error) {
      if (error instanceof Error)
        console.error({ msg: chalk.red("DB Connection Error"), error })
      console.error({ msg: chalk.red("DB Connection Error"), error })
    }
  }

  public readonly create = async (
    data: Partial<Omit<Inputs, "_id" | "createdAt" | "updatedAt" | "__V">>,
  ): Promise<TDocument> => {
    return await this.model.create(data)
  }

  public readonly find = async ({
    filter = {},
    projection = {},
    options = {},
    populate = [],
    limit = 0,
    skip = 0,
  }: IFind<Inputs> = {}): Promise<TDocument[] | []> => {
    return await this.model
      .find(filter, projection, options)
      .populate(populate)
      .limit(limit)
      .skip(skip)
  }

  public readonly findOne = async ({
    filter = {},
    projection = {},
    options = {},
    populate = [],
  }: IFindOne<TDocument>): Promise<TDocument | null> => {
    return await this.model
      .findOne(filter, projection, options)
      .populate(populate)
  }

  public readonly findOneAndUpdate = async ({
    filter,
    data,
    options = {},
  }: IFindOneAndUpdate<TDocument>): Promise<TDocument | null> => {
    return await this.model.findOneAndUpdate(filter, data, options)
  }

  public readonly findOneAndDelete = async ({
    filter,
    options = {},
  }: IFindOneAndDelete<Inputs>): Promise<TDocument | null> => {
    return await this.model.findOneAndDelete(filter, options)
  }
  public readonly findById = async ({
    _id,
    projection = {},
    options = {},
    populate = [],
  }: IFindById<Inputs>): Promise<TDocument | null> => {
    return await this.model
      .findById(_id, projection, options)
      .populate(populate || [])
  }

  public readonly findByIdAndUpdate = async ({
    _id,
    data,
    options = {},
  }: IFindByIdAndUpdate<TDocument>): Promise<TDocument | null> => {
    return await this.model.findByIdAndUpdate(_id, data, options)
  }

  public readonly findByIdAndDelete = async ({
    _id,
    options = {},
  }: IFindByIdAndDelete<Inputs>): Promise<TDocument | null> => {
    return await this.model.findByIdAndDelete(_id, options)
  }

  public readonly deleteMany = async (filter: RootFilterQuery<Inputs>) => {
    return await this.model.deleteMany(filter)
  }

  public readonly updateMany = async ({
    filter,
    data,
  }: IUpdateMany<TDocument>) => {
    return await this.model.updateMany(filter, data)
  }
}
