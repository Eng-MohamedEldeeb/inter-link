import { IGetUserProfileDTO } from '../../http/modules/user/dto/user.dto'
import { ContextDetector } from '../decorators/context/context-detector.decorator'
import { throwHttpError } from '../handlers/http/error-message.handler'
import userRepository from '../repositories/user.repository'
import { GuardActivator } from './can-activate.guard'

class IsExistedUserGuard extends GuardActivator {
  private readonly userRepository = userRepository

  async canActivate(...params: any[any]) {
    const { req } = ContextDetector.switchToHTTP<IGetUserProfileDTO>(params)
    const { id } = req.params

    const { _id } = req.profile

    const isExistedUser = await this.userRepository.findOne({
      filter: {
        $and: [{ _id: id }, { deactivatedAt: { $exists: false } }],
      },
      projection: {
        password: 0,
        oldPasswords: 0,
        phone: 0,
      },
      options: { lean: true },
    })

    if (!isExistedUser)
      return throwHttpError({
        msg: "user doesn't exists or in-valid id",
        status: 400,
      })

    const checkViewers = isExistedUser.viewers.some(({ visitor }) =>
      visitor.equals(_id),
    )

    if (checkViewers) {
      const updatedViews = await this.userRepository.findOneAndUpdate({
        filter: {
          _id: id,
          'viewers.visitor': _id,
        },
        data: {
          $in: { 'viewers.$.totalVisits': 1 },
        },

        options: {
          new: true,
          projection: {
            password: 0,
            oldPasswords: 0,
            phone: 0,
          },
          lean: true,
        },
      })
      req.user = updatedViews!

      return true
    }

    const updatedViews = await this.userRepository.findOneAndUpdate({
      filter: {
        _id: id,
      },
      data: {
        $push: {
          viewers: {
            visitor: _id,
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
        },
        lean: true,
      },
    })

    req.user = updatedViews!

    return true
  }
}

export default new IsExistedUserGuard()
