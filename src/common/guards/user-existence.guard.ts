import { IGetUserProfileDTO } from '../../modules/user/dto/user.dto'
import { ContextDetector } from '../decorators/context/context-detector.decorator'
import { ContextType } from '../decorators/enums/async-handler.types'
import { throwHttpError } from '../handlers/http/error-message.handler'
import userRepository from '../repositories/user.repository'
import { GuardActivator } from './can-activate.guard'

class UserExistenceGuard extends GuardActivator {
  private readonly userRepository = userRepository

  async canActivate(...params: any[any]) {
    const ctx = ContextDetector.detect(params)

    if (ctx.type === ContextType.httpContext) {
      const { req } = ctx.switchToHTTP<
        Pick<IGetUserProfileDTO, 'id'>,
        IGetUserProfileDTO
      >()

      const { user, id: userId } = { ...req.query, ...req.params }
      const { _id: profileId } = req.profile

      const isExistedUser = await this.userRepository.findOne({
        filter: {
          ...(user
            ? {
                $or: [
                  {
                    $and: [
                      { username: { $regex: user } },

                      {
                        deactivatedAt: { $exists: false },
                      },
                    ],
                  },
                  {
                    $and: [
                      { fullName: { $regex: user } },

                      {
                        deactivatedAt: { $exists: false },
                      },
                    ],
                  },
                ],
              }
            : {
                $and: [{ _id: userId }, { deactivatedAt: { $exists: false } }],
              }),
        },
        projection: {
          password: 0,
          oldPasswords: 0,
          phone: 0,
          'avatar.public_id': 0,
        },
        options: { lean: true },
      })

      if (!isExistedUser)
        return throwHttpError({
          msg: "user doesn't exist",
          status: 400,
        })

      if (isExistedUser._id.equals(profileId)) {
        req.user = isExistedUser
        return true
      }

      const checkviewers = isExistedUser.viewers?.some(({ viewer }) =>
        viewer.equals(profileId),
      )

      if (checkviewers) {
        const updatedViews = await this.userRepository.findOneAndUpdate({
          filter: {
            $and: [
              { _id: isExistedUser._id },
              { 'viewers.viewer': profileId },
              { deactivatedAt: { $exists: false } },
            ],
          },
          data: {
            $inc: { 'viewers.$.totalVisits': 1 },
          },

          options: {
            new: true,
            projection: {
              password: 0,
              oldPasswords: 0,
              phone: 0,
              'avatar.public_id': 0,
            },
            lean: true,
          },
        })

        req.user = updatedViews!

        return true
      }

      const updatedViews = await this.userRepository.findOneAndUpdate({
        filter: {
          $and: [
            { _id: isExistedUser._id },
            { deactivatedAt: { $exists: false } },
          ],
        },
        data: {
          $push: {
            viewers: {
              viewer: profileId,
              totalVisits: 1,
            },
          },
        },
        options: {
          new: true,
          projection: {
            password: 0,
            oldPasswords: 0,
            phone: 0,
            'avatar.public_id': 0,
          },
          lean: true,
        },
      })

      req.user = updatedViews!

      return true
    }

    if (ctx.type === ContextType.graphContext) {
      const { args, context } = ctx.switchToGraphQL<IGetUserProfileDTO>()

      const { user, id: userId } = args
      const { _id: profileId } = context.profile

      const isExistedUser = await this.userRepository.findOne({
        filter: {
          ...(user
            ? {
                $or: [
                  {
                    $and: [
                      { username: { $regex: user } },

                      {
                        deactivatedAt: { $exists: false },
                      },
                    ],
                  },
                  {
                    $and: [
                      { fullName: { $regex: user } },

                      {
                        deactivatedAt: { $exists: false },
                      },
                    ],
                  },
                ],
              }
            : {
                $and: [{ _id: userId }, { deactivatedAt: { $exists: false } }],
              }),
        },
        projection: {
          password: 0,
          oldPasswords: 0,
          phone: 0,
          'avatar.public_id': 0,
        },
        options: { lean: true },
      })

      if (!isExistedUser)
        return throwHttpError({
          msg: "user doesn't exist",
          status: 400,
        })

      if (isExistedUser._id.equals(profileId)) {
        context.user = isExistedUser
        return true
      }

      const checkviewers = isExistedUser.viewers?.some(({ viewer }) =>
        viewer.equals(profileId),
      )

      if (checkviewers) {
        const updatedViews = await this.userRepository.findOneAndUpdate({
          filter: {
            $and: [
              { _id: isExistedUser._id },
              { 'viewers.viewer': profileId },
              { deactivatedAt: { $exists: false } },
            ],
          },
          data: {
            $inc: { 'viewers.$.totalVisits': 1 },
          },

          options: {
            new: true,
            projection: {
              password: 0,
              oldPasswords: 0,
              phone: 0,
              'avatar.public_id': 0,
            },
            lean: true,
          },
        })

        context.user = updatedViews!

        return true
      }

      const updatedViews = await this.userRepository.findOneAndUpdate({
        filter: {
          $and: [
            { _id: isExistedUser._id },
            { deactivatedAt: { $exists: false } },
          ],
        },
        data: {
          $push: {
            viewers: {
              viewer: profileId,
              totalVisits: 1,
            },
          },
        },
        options: {
          new: true,
          projection: {
            password: 0,
            oldPasswords: 0,
            phone: 0,
            'avatar.public_id': 0,
          },
          lean: true,
        },
      })

      context.user = updatedViews!

      return true
    }
  }
}

export default new UserExistenceGuard()
