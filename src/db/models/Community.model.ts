import { Schema, SchemaTypes } from "mongoose"

import { ICommunity } from "../interfaces/ICommunity.interface"
import { CloudUploader } from "../../common/services/upload/cloud.service"
import { postRepository } from "../repositories"

import slugify from "slugify"
import { DataBaseService } from "../db.service"

export class Community {
  private static readonly DataBaseService = DataBaseService

  private static readonly schema = new Schema<ICommunity>(
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

  private static readonly schemaFactory = () => {
    this.schema.virtual("posts", {
      ref: "Post",
      localField: "_id",
      foreignField: "onCommunity",
    })

    this.schema.virtual("totalMembers").get(function (this: ICommunity) {
      if (this.members) return this.members.length
      return 0
    })

    this.schema.post("findOneAndDelete", async function (res: ICommunity) {
      const { _id, cover } = res

      await postRepository.deleteMany({ onCommunity: _id })

      if (cover.path) {
        await CloudUploader.deleteFolder({ fullPath: cover.fullPath })
      }
    })

    return this.schema
  }

  public static readonly Model =
    this.DataBaseService.generalDB.models[this.name] ??
    this.DataBaseService.generalDB.model(this.name, this.schemaFactory())
}
