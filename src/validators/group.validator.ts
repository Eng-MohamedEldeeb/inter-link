// import joi from "joi"

// import * as DTO from "../modules/group/dto/group.dto"
// import { Validator } from "../common/utils/validator/validator"

// export class GroupValidator extends Validator {
//   public static readonly getSingleGroupChatValidator = {
//     schema: joi
//       .object<DTO.IGetSingleGroup>()
//       .keys({
//         id: this.generalFields.mongoId.required(),
//       })
//       .required(),

//     http() {
//       return {
//         params: this.schema.required(),
//       }
//     },

//     graphql() {
//       return {
//         args: this.schema.required(),
//       }
//     },
//   }

//   public static readonly createGroupValidator = {
//     schema: joi
//       .object<DTO.ICreateGroup>()
//       .keys({
//         name: joi.string().required(),
//         description: joi.string().required(),
//         members: joi.array().items(this.generalFields.mongoId).required(),
//       })
//       .required(),

//     http() {
//       return {
//         body: this.schema.required(),
//       }
//     },

//     graphql() {
//       return {
//         args: this.schema.required(),
//       }
//     },
//   }

//   public static readonly addMemberValidator = {
//     schema: {
//       memberId: this.generalFields.mongoId,
//       id: this.generalFields.mongoId,
//     },

//     http() {
//       return {
//         body: joi
//           .object<DTO.IAddMember>()
//           .keys({ memberId: this.schema.memberId })
//           .required(),
//         params: joi
//           .object<DTO.IAddMember>()
//           .keys({ id: this.schema.id })
//           .required(),
//       }
//     },

//     graphql() {
//       return {
//         args: joi.object<DTO.IAddMember>().keys(this.schema).required(),
//       }
//     },
//   }

//   public static readonly removeMemberValidator = {
//     schema: {
//       memberId: this.generalFields.mongoId,
//       id: this.generalFields.mongoId,
//     },

//     http() {
//       return {
//         body: joi
//           .object<DTO.IAddMember>()
//           .keys({ memberId: this.schema.memberId })
//           .required(),
//         params: joi
//           .object<DTO.IAddMember>()
//           .keys({ id: this.schema.id })
//           .required(),
//       }
//     },

//     graphql() {
//       return {
//         args: joi.object<DTO.IAddMember>().keys(this.schema).required(),
//       }
//     },
//   }

//   public static readonly likeMessageValidator = {
//     params: {
//       id: this.generalFields.mongoId.required(),
//     },

//     query: {
//       messageId: this.generalFields.mongoId.required(),
//     },

//     http() {
//       return {
//         params: joi
//           .object<Pick<DTO.ILikeMessage, "id">>()
//           .keys(this.params)
//           .required()
//           .messages({
//             "any.required": "id param is required",
//           }),

//         query: joi
//           .object<Pick<DTO.ILikeMessage, "messageId">>()
//           .keys(this.query)
//           .required(),
//       }
//     },

//     graphql() {
//       return {
//         args: joi
//           .object<DTO.ILikeMessage>()
//           .keys({ ...this.query, ...this.params })
//           .required(),
//       }
//     },
//   }

//   public static readonly editGroupValidator = {
//     query: {
//       id: this.generalFields.mongoId.required(),
//     },

//     body: {
//       newMessage: joi.string().max(700).required(),
//     },

//     http() {
//       return {
//         params: joi
//           .object<Pick<DTO.IDeleteMessage, "id">>()
//           .keys(this.query)
//           .required(),
//       }
//     },

//     graphql() {
//       return {
//         args: joi
//           .object<DTO.ILikeMessage>()
//           .keys({ ...this.query })
//           .required(),
//       }
//     },
//   }

//   public static readonly deleteMessageValidator = {
//     params: {
//       id: this.generalFields.mongoId.required(),
//     },

//     query: {
//       messageId: this.generalFields.mongoId.required(),
//     },

//     http() {
//       return {
//         params: joi
//           .object<Pick<DTO.ILikeMessage, "id">>()
//           .keys(this.params)
//           .required(),
//         query: joi
//           .object<Pick<DTO.ILikeMessage, "messageId">>()
//           .keys(this.query)
//           .required(),
//       }
//     },

//     graphql() {
//       return {
//         args: joi
//           .object<DTO.ILikeMessage>()
//           .keys({ ...this.query, ...this.params })
//           .required(),
//       }
//     },
//   }

//   public static readonly editMessageValidator = {
//     params: {
//       id: this.generalFields.mongoId.required(),
//     },

//     query: {
//       messageId: this.generalFields.mongoId.required(),
//     },

//     body: {
//       newMessage: joi.string().max(700).required(),
//     },

//     http() {
//       return {
//         params: joi
//           .object<Pick<DTO.IEditMessage, "id">>()
//           .keys(this.params)
//           .required(),
//         query: joi
//           .object<Pick<DTO.IEditMessage, "messageId">>()
//           .keys(this.query)
//           .required(),
//         body: joi
//           .object<Pick<DTO.IEditMessage, "newMessage">>()
//           .keys(this.body)
//           .required(),
//       }
//     },

//     graphql() {
//       return {
//         args: joi
//           .object<DTO.ILikeMessage>()
//           .keys({ ...this.query, ...this.params, ...this.body })
//           .required(),
//       }
//     },
//   }

//   public static readonly leaveGroupValidator = {
//     schema: joi
//       .object<DTO.ILeaveGroup>()
//       .keys({
//         id: this.generalFields.mongoId.required(),
//         profileId: this.generalFields.mongoId.required(),
//       })
//       .required(),

//     http() {
//       return {
//         query: this.schema.required(),
//       }
//     },

//     graphql() {
//       return {
//         args: this.schema.required(),
//       }
//     },
//   }

//   public static readonly updateGroupValidator = {
//     query: {
//       id: this.generalFields.mongoId.required(),
//     },

//     body: {
//       name: joi.string().required(),
//       description: joi.string().required(),
//     },

//     http() {
//       return {
//         query: joi
//           .object<Pick<DTO.IUpdateGroup, "id">>()
//           .keys(this.query)
//           .required(),
//         body: joi.object<DTO.IUpdateGroup>().keys(this.body).required(),
//       }
//     },

//     graphql() {
//       return {
//         args: joi
//           .object<DTO.ILikeMessage>()
//           .keys({ ...this.query, ...this.body })
//           .required(),
//       }
//     },
//   }

//   public static readonly deleteGroupValidator = {
//     schema: joi
//       .object<DTO.IDeleteGroup>()
//       .keys({
//         id: this.generalFields.mongoId.required(),
//       })
//       .required(),

//     http() {
//       return {
//         query: this.schema.required(),
//       }
//     },

//     graphql() {
//       return {
//         args: this.schema.required(),
//       }
//     },
//   }
// }
