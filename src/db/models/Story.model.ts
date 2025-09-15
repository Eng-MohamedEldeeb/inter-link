import { Schema, SchemaTypes, model, models } from "mongoose"

import { IStory } from "../interfaces/IStory.interface"
import { CloudUploader } from "../../common/services/upload/cloud.service"

export class Story {
  private static readonly schema = new Schema<IStory>(
    {
      content: {
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
    models.Story ?? model(this.name, this.schemaFactory())
}
