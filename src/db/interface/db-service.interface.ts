import { RootFilterQuery, UpdateQuery } from 'mongoose'
import {
  FilterQuery,
  PopulateOptions,
  ProjectionType,
  QueryOptions,
  Types,
} from 'mongoose'
import { MongoObjId } from '../../common/types/db/mongo.types'

export interface IFind<T> {
  filter?: RootFilterQuery<T>
  projection?: ProjectionType<T>
  options?: QueryOptions<T>
  populate?: PopulateOptions[]
  limit?: number
  skip?: number
}

export interface IFilterQuery<T> {
  filter: FilterQuery<T>
  options?: QueryOptions<T>
}

export interface IFindOne<T> extends IFilterQuery<T> {
  projection?: ProjectionType<T>
  populate?: PopulateOptions[]
}

export interface IFindOneAndUpdate<T> extends IFilterQuery<T> {
  data: UpdateQuery<T>
}

export interface IFindOneAndDelete<T> extends IFilterQuery<T> {}

export interface IFilterById<T> {
  _id: MongoObjId
  options?: QueryOptions<T>
}
export interface IFindById<T> extends IFilterById<T> {
  projection?: ProjectionType<T>
  populate?: PopulateOptions[]
}

export interface IFindByIdAndUpdate<T> extends IFilterById<T> {
  data: UpdateQuery<T>
}

export interface IFindByIdAndDelete<T> extends IFilterById<T> {}

export interface IUpdateMany<T> {
  filter: RootFilterQuery<T>
  data: UpdateQuery<T>
}
