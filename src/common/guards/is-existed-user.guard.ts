import { IGetUserProfileDTO } from '../../http/modules/user/dto/user.dto'
import { ContextDetector } from '../decorators/context/context-detector.decorator'
import { throwHttpError } from '../handlers/http/error-message.handler'
import userRepository from '../repositories/user.repository'
import { GuardActivator } from './can-activate.guard'

class IsExistedUserGuard extends GuardActivator {
  private readonly userRepository = userRepository

  async canActivate(...params: any[any]) {
    const { req } = ContextDetector.switchToHTTP<
      Pick<IGetUserProfileDTO, 'id'>,
      IGetUserProfileDTO
    >(params)

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

    const checkViewers = isExistedUser.viewers?.some(({ visitor }) =>
      visitor.equals(profileId),
    )

    if (checkViewers) {
      const updatedViews = await this.userRepository.findOneAndUpdate({
        filter: {
          $and: [
            { _id: isExistedUser._id },
            { 'viewers.visitor': profileId },
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
            visitor: profileId,
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
}

export default new IsExistedUserGuard()
