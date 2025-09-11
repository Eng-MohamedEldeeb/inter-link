import { Schema, SchemaTypes } from "mongoose"

import { ICommunity } from "../../interfaces/ICommunity.interface"
import { CloudUploader } from "../../../common/services/upload/cloud.service"

import postRepository from "../../../common/repositories/post.repository"
import slugify from "slugify"

export const communitySchema = new Schema<ICommunity>(
  {
    cover: {
      fullPath: String,
      folderId: String,
      path: {
        secure_url: {
          type: String,
          default:
            "https://res.cloudinary.com/djjqzi02l/image/upload/v1750848008/blank-profile-picture_d3zmwj.png",
        },
        public_id: String,
      },
    },

    name: {
      type: String,
      minlength: [
        2,
        "Community's name can't be less than 2 characters at least",
      ],
      maxlength: [50, "Community's name can't be more than 50 characters"],
      required: [true, "Community's name is required"],
      unique: [true, "Community name must be unique"],
    },

    description: {
      type: String,
      maxlength: [
        700,
        "Community's description can't be more than 700 characters",
      ],
      required: [true, "Community's name is required"],
    },

    slug: {
      type: String,
      default: function () {
        return slugify(this.name).toLowerCase()
      },
    },

    admins: [{ type: SchemaTypes.ObjectId, ref: "User" }],

    members: [{ type: SchemaTypes.ObjectId, ref: "User" }],

    requests: [{ type: SchemaTypes.ObjectId, ref: "User" }],

    isPrivateCommunity: { type: Boolean, default: false },

    createdBy: {
      type: SchemaTypes.ObjectId,
      ref: "User",
      required: [true, "createdBy is required"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

communitySchema.virtual("posts", {
  ref: "Post",
  localField: "_id",
  foreignField: "onCommunity",
})

communitySchema.virtual("totalMembers").get(function (this: ICommunity) {
  if (this.members) return this.members.length
  return 0
})

communitySchema.post("findOneAndDelete", async function (res: ICommunity) {
  const { _id, cover } = res

  await postRepository.deleteMany({ onCommunity: _id })

  if (cover.path) {
    await CloudUploader.deleteFolder({ fullPath: cover.fullPath })
  }
})
