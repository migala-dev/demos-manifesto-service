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

const updateDraft = {
  body: Joi.object().keys({
    title: Joi.string().allow(null, ''),
    content: Joi.string().allow(null, ''),
    optionType: Joi.number().valid(...Object.values(optionTypeEnum)),
    options: Joi.array()
    .items(
        Joi.object().keys({
            manifestoOptionId: Joi.string().allow(null, ''),
            title: Joi.string().allow(null, ''),
        })
      )
  }),
};

const proposal = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().allow(null, ''),
    optionType: Joi.number().valid(...Object.values(optionTypeEnum)),
    options: Joi.array()
    .items(
        Joi.object().keys({
            title: Joi.string().required(),
        })
      )
  }),
};

module.exports = {
    createDraft,
    updateDraft,
};
