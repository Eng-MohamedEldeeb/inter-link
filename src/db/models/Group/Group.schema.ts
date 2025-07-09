import { Schema, SchemaTypes } from 'mongoose'
import { IGroup } from '../../interface/IGroup.interface'

export const GroupSchema = new Schema<IGroup>(
  {
    name: {
      type: String,
      minlength: [2, "group's name can't be less than 2 characters at least"],
      maxlength: [50, "group's name can't be more than 50 characters"],
      required: [true, "Group's name is required"],
    },

    createdBy: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      required: [true, 'createdBy is required'],
    },

    admins: [{ type: SchemaTypes.ObjectId, ref: 'User' }],

    followers: [{ type: SchemaTypes.ObjectId, ref: 'User' }],
  },
  { timestamps: true },
)

GroupSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: '',
})
// GroupSchema.post('findOneAndDelete', async function (res: IGroup, next) {
//   Promise.allSettled([
//     posteRepository.deleteMany({ createdBy: res._id }),

//     groupRepository.deleteMany({ createdBy: res._id }),
//   ])
// })
