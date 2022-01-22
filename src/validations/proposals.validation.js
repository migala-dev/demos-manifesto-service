const Joi = require('joi');
const optionTypeEnum = require('../shared/enums/option-type.enum');

const createDraft = {
  body: Joi.object().keys({
    title: Joi.string().allow(null, ''),
    content: Joi.string().allow(null, ''),
    optionType: Joi.number().valid(...Object.values(optionTypeEnum)),
    options: Joi.array()
    .items(
        Joi.object().keys({
            title: Joi.string().allow(null, ''),
        })
      )
  }),
};

module.exports = {
    createDraft,
};
