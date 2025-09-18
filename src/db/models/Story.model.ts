import { Schema, SchemaTypes } from "mongoose"

import { IStory } from "../interfaces/IStory.interface"
import { CloudUploader } from "../../common/services/upload/cloud.service"
import { DataBaseService } from "../db.service"

export class Story {
  private static readonly DataBaseService = DataBaseService

  private static readonly schema = new Schema<IStory>(
    {
      body: {
        type: String,
        required: function () {
          return this.attachment.folderId ? false : true
        },
      },

      attachment: {
        folderId: String,
        path: {
          secure_url: String,
          public_id: String,
        },
      },

      viewers: [{ type: SchemaTypes.ObjectId, ref: "User" }],

      likedBy: [{ type: SchemaTypes.ObjectId, ref: "User" }],

      createdBy: {
        type: SchemaTypes.ObjectId,
        ref: "User",
        required: [true, "story creator id is required"],
      },
    },
    {
      timestamps: true,
      toObject: { virtuals: true },
      toJSON: { virtuals: true },
    },
  )

  private static readonly schemaFactory = () => {
    this.schema.index(
      { createdAt: 1 },
      {
        expires: "24h",
      },
    )

    this.schema.virtual("totalViewers").get(function () {
      return this.viewers?.length ?? 0
    })

    this.schema.virtual("totalLikes").get(function () {
      return this.likedBy?.length ?? 0
    })

    this.schema.post("findOneAndDelete", async function (res: IStory) {
      const { attachment } = res

      if (attachment?.path.public_id) {
        await CloudUploader.deleteFolder({ fullPath: attachment.fullPath })
      }
    })

    return this.schema
  }

  public static readonly Model =
    this.DataBaseService.generalDB.models[this.name] ??
    this.DataBaseService.generalDB.model(this.name, this.schemaFactory())
}
