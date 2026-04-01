import Joi from "joi";

export const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).messages({
    "string.min": "Name must be at least 2 characters",
  }),

  email: Joi.string().email().messages({
    "string.email": "Please provide a valid email",
  }),
})
  .min(1) // minimal satu field harus diisi
  .messages({
    "object.min": "Please provide at least one field to update",
  });

export const idParamSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    "number.base": "ID must be a number",
    "number.positive": "ID must be a positive number",
  }),
});
