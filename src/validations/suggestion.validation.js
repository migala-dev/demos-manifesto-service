const Joi = require('joi');

const { optionTypeEnum } = require('../shared/enums');

const suggestion = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    content: Joi.string().allow(null, ''),
    optionType: Joi.number().valid(optionTypeEnum.SUGGESTION_TO_PROPOSAL),
  })
};

module.exports = {
  suggestion
};